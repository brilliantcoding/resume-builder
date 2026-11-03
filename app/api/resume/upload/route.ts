import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { chatForParsing } from '@/lib/local-ai'
import { defaultResumeData, ResumeData } from '@/types/resume'
// Use internal path to avoid pdf-parse running its test file on import
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse: (buf: Buffer) => Promise<{ text: string }> = require('pdf-parse/lib/pdf-parse')
import mammoth from 'mammoth'

export const maxDuration = 60 // allow up to 60s for AI parsing

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf')) {
    const parsed = await pdfParse(buffer)
    return parsed.text
  }

  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  if (name.endsWith('.txt')) {
    return buffer.toString('utf-8')
  }

  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
}

const PARSE_PROMPT = (text: string) => `You are a resume parser. Extract ALL information from the resume text below and return it as a single JSON object.

Resume Text:
"""
${text.slice(0, 15000)}
"""

Return a JSON object with this EXACT structure. Do NOT omit any section even if empty:
{
  "personalInfo": {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1 555-123-4567",
    "location": "San Francisco, CA",
    "website": "https://janedoe.com",
    "linkedin": "https://linkedin.com/in/janedoe",
    "github": "https://github.com/janedoe",
    "jobTitle": "Senior Software Engineer"
  },
  "summary": "Full verbatim text of the professional summary/profile section.",
  "experience": [
    {
      "id": "exp1",
      "company": "Acme Corp",
      "position": "Software Engineer",
      "startDate": "Jan 2021",
      "endDate": "Present",
      "current": true,
      "description": "",
      "bullets": [
        "Led team of 5 engineers to ship microservices platform serving 2M users",
        "Reduced deployment time by 40% through CI/CD automation",
        "Increased test coverage from 45% to 90% using Jest and Playwright"
      ]
    }
  ],
  "education": [
    {
      "id": "edu1",
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "Sep 2015",
      "endDate": "Jun 2019",
      "gpa": "3.8",
      "honors": "Magna Cum Laude"
    }
  ],
  "skills": [
    {
      "id": "sk1",
      "category": "Languages",
      "skills": ["JavaScript", "TypeScript", "Python"]
    },
    {
      "id": "sk2",
      "category": "Frameworks",
      "skills": ["React", "Next.js", "Node.js"]
    },
    {
      "id": "sk3",
      "category": "Tools",
      "skills": ["Docker", "Kubernetes", "AWS"]
    }
  ],
  "projects": [
    {
      "id": "proj1",
      "name": "Project Name",
      "description": "What the project does and your role in it.",
      "technologies": ["React", "Node.js", "PostgreSQL"],
      "url": "https://project.com",
      "github": "https://github.com/user/project"
    }
  ],
  "certifications": [
    {
      "id": "cert1",
      "name": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "Mar 2023",
      "url": "https://aws.amazon.com/certification"
    }
  ]
}

Critical rules:
- EVERY experience entry MUST have a "bullets" array with the actual job responsibilities/achievements from the resume. Do NOT leave bullets empty — pull the real text from the resume.
- If a role has a paragraph description instead of bullet points, split it into individual bullet sentences and put them in the "bullets" array. Leave "description" as empty string "".
- Copy the summary/profile section VERBATIM — do not paraphrase or shorten.
- Extract ALL certifications, licenses, awards, and accomplishments listed — do not skip any.
- For current/present jobs: set "current": true and "endDate": "Present".
- Generate sequential IDs: exp1, exp2 … edu1, edu2 … sk1, sk2 … proj1, proj2 … cert1, cert2
- Return ONLY the JSON object. No markdown fences, no explanation, no trailing text.`

// Post-process parsed data: fix empty bullets, bad IDs, etc.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeParsed(parsed: any): ResumeData {
  const base = { ...defaultResumeData, ...parsed }

  // Fix experience bullets
  base.experience = (parsed.experience ?? []).map((e: any, i: number) => {
    let bullets: string[] = Array.isArray(e.bullets) ? e.bullets : []

    // Filter out empty/whitespace-only bullets
    bullets = bullets.map((b: string) => String(b).trim()).filter((b: string) => b.length > 0)

    // If bullets are empty but description has content, split description into bullets
    if (bullets.length === 0 && e.description?.trim()) {
      bullets = e.description
        .split(/\n|•|–|▪|·|\*/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5)
    }

    // Ensure at least one non-empty bullet so the section isn't blank
    if (bullets.length === 0) bullets = ['']

    return {
      id: e.id || `exp${i + 1}`,
      company: e.company ?? '',
      position: e.position ?? '',
      startDate: e.startDate ?? '',
      endDate: e.endDate ?? '',
      current: !!e.current,
      description: '',  // always blank — content lives in bullets
      bullets,
    }
  })

  // Fix education IDs
  base.education = (parsed.education ?? []).map((e: any, i: number) => ({
    id: e.id || `edu${i + 1}`,
    institution: e.institution ?? '',
    degree: e.degree ?? '',
    field: e.field ?? '',
    startDate: e.startDate ?? '',
    endDate: e.endDate ?? '',
    gpa: e.gpa ?? '',
    honors: e.honors ?? '',
  }))

  // Fix skill groups — remove groups with no skills
  base.skills = (parsed.skills ?? [])
    .map((g: any, i: number) => ({
      id: g.id || `sk${i + 1}`,
      category: g.category ?? '',
      skills: Array.isArray(g.skills) ? g.skills.map((s: any) => String(s).trim()).filter(Boolean) : [],
    }))
    .filter((g: any) => g.skills.length > 0)

  // Fix projects
  base.projects = (parsed.projects ?? []).map((p: any, i: number) => ({
    id: p.id || `proj${i + 1}`,
    name: p.name ?? '',
    description: p.description ?? '',
    technologies: Array.isArray(p.technologies) ? p.technologies.map((t: any) => String(t).trim()).filter(Boolean) : [],
    url: p.url ?? '',
    github: p.github ?? '',
  }))

  // Fix certifications — this is the section most often missing or malformed
  base.certifications = (parsed.certifications ?? []).map((c: any, i: number) => ({
    id: c.id || `cert${i + 1}`,
    name: c.name ?? c.title ?? c.certification ?? '',
    issuer: c.issuer ?? c.organization ?? c.provider ?? '',
    date: c.date ?? c.year ?? c.issued ?? '',
    url: c.url ?? c.link ?? '',
  })).filter((c: any) => c.name.trim().length > 0)

  return base as ResumeData
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    // Extract raw text
    let rawText: string
    try {
      rawText = await extractText(file)
    } catch (err: unknown) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 })
    }

    if (!rawText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file. Make sure it\'s not a scanned image PDF.' }, { status: 400 })
    }

    // Parse with AI
    let resumeData: ResumeData = defaultResumeData
    let aiParseError: string | null = null

    try {
      const aiResponse = await chatForParsing({
        messages: [{ role: 'user', content: PARSE_PROMPT(rawText) }],
        max_tokens: 8192,
        temperature: 0.1,
      })

      console.log('[Upload] Raw AI response length:', aiResponse.length)

      // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
      const stripped = aiResponse
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/, '')
        .trim()

      // Extract the outermost JSON object
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')

      if (start !== -1 && end !== -1 && end > start) {
        const jsonStr = stripped.slice(start, end + 1)
        try {
          const parsed = JSON.parse(jsonStr)
          resumeData = sanitizeParsed(parsed)
          console.log('[Upload] Parsed OK — name:', resumeData.personalInfo?.fullName,
            '| exp:', resumeData.experience.length,
            '| certs:', resumeData.certifications.length,
            '| bullets[0]:', resumeData.experience[0]?.bullets?.length ?? 0)
        } catch (parseErr) {
          console.error('[Upload] JSON.parse failed:', parseErr)
          aiParseError = 'AI returned malformed JSON. The resume was created but you may need to fill in details manually.'
        }
      } else {
        console.error('[Upload] No JSON object found in AI response. Response preview:', aiResponse.slice(0, 300))
        aiParseError = 'AI did not return structured data. The resume was created but you may need to fill in details manually.'
      }
    } catch (err) {
      console.error('[Upload] AI parse error:', err)
      aiParseError = 'AI parsing failed (model unavailable or API error). The resume was created but you may need to fill in details manually.'
    }

    // Derive title from name or filename
    const title = resumeData.personalInfo?.fullName
      ? `${resumeData.personalInfo.fullName}'s Resume`
      : file.name.replace(/\.(pdf|docx?|txt)$/i, '')

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title,
        template: 'modern',
        data: JSON.stringify(resumeData),
      },
    })

    return NextResponse.json({
      id: resume.id,
      title: resume.title,
      warning: aiParseError ?? undefined,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
