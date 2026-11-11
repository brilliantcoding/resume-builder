import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { chatForParsing, getAiErrorDetails } from '@/lib/local-ai'
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
function sanitizeParsed(parsed: unknown): ResumeData {
  // Ensure parsed is an object before spreading
  const parsedObj = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  const base = { ...defaultResumeData, ...parsedObj } as ResumeData

  // Fix experience bullets
  const experienceArray = Array.isArray(parsedObj.experience) ? parsedObj.experience : []
  base.experience = experienceArray.map((e: unknown, i: number) => {
    const entry = e as { id?: string; company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; description?: string; bullets?: string[] }
    let bullets: string[] = Array.isArray(entry.bullets) ? entry.bullets : []

    // Filter out empty/whitespace-only bullets
    bullets = bullets.map((b) => String(b).trim()).filter((b) => b.length > 0)

    // If bullets are empty but description has content, split description into bullets
    if (bullets.length === 0 && entry.description?.trim()) {
      bullets = String(entry.description)
        .split(/\n|•|–|▪|·|\*/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5)
    }

    // Ensure at least one non-empty bullet so the section isn't blank
    if (bullets.length === 0) bullets = ['']

    return {
      id: entry.id || `exp${i + 1}`,
      company: entry.company ?? '',
      position: entry.position ?? '',
      startDate: entry.startDate ?? '',
      endDate: entry.endDate ?? '',
      current: !!entry.current,
      description: '',  // always blank — content lives in bullets
      bullets,
    }
  })

  // Fix education IDs
  const educationArray = Array.isArray(parsedObj.education) ? parsedObj.education : []
  base.education = educationArray.map((e: unknown, i: number) => {
    const entry = e as { id?: string; institution?: string; degree?: string; field?: string; startDate?: string; endDate?: string; gpa?: string; honors?: string }
    return {
      id: entry.id || `edu${i + 1}`,
      institution: entry.institution ?? '',
      degree: entry.degree ?? '',
      field: entry.field ?? '',
      startDate: entry.startDate ?? '',
      endDate: entry.endDate ?? '',
      gpa: entry.gpa ?? '',
      honors: entry.honors ?? '',
    }
  })

  // Fix skill groups — remove groups with no skills
  const skillsArray = Array.isArray(parsedObj.skills) ? parsedObj.skills : []
  base.skills = skillsArray
    .map((g: unknown, i: number) => {
      const group = g as { id?: string; category?: string; skills?: unknown[] }
      const skillsArray = Array.isArray(group.skills) ? group.skills : []
      return {
        id: group.id || `sk${i + 1}`,
        category: group.category ?? '',
        skills: skillsArray.map((s: unknown) => String(s).trim()).filter(Boolean),
      }
    })
    .filter((g: { skills: unknown[] }) => g.skills.length > 0)

  // Fix projects
  const projectsArray = Array.isArray(parsedObj.projects) ? parsedObj.projects : []
  base.projects = projectsArray.map((p: unknown, i: number) => {
    const project = p as { id?: string; name?: string; description?: string; technologies?: unknown[]; url?: string; github?: string }
    const techArray = Array.isArray(project.technologies) ? project.technologies : []
    return {
      id: project.id || `proj${i + 1}`,
      name: project.name ?? '',
      description: project.description ?? '',
      technologies: techArray.map((t: unknown) => String(t).trim()).filter(Boolean),
      url: project.url ?? '',
      github: project.github ?? '',
    }
  })

  // Fix certifications — this is the section most often missing or malformed
  const certificationsArray = Array.isArray(parsedObj.certifications) ? parsedObj.certifications : []
  base.certifications = certificationsArray
    .map((c: unknown, i: number) => {
      const cert = c as { id?: string; name?: string; issuer?: string; date?: string; title?: string; organization?: string; provider?: string; url?: string; link?: string; year?: string; issued?: string; certification?: string }
      return {
        id: cert.id || `cert${i + 1}`,
        name: cert.name ?? cert.title ?? cert.certification ?? '',
        issuer: cert.issuer ?? cert.organization ?? cert.provider ?? '',
        date: cert.date ?? cert.year ?? cert.issued ?? '',
        url: cert.url ?? cert.link ?? '',
      }
    })
    .filter((c: { name: string }) => c.name.trim().length > 0)

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

    // Parse with AI — a failed parse must NOT create an empty resume
    let resumeData: ResumeData
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

      if (start === -1 || end <= start) {
        console.error('[Upload] No JSON object found in AI response. Response preview:', aiResponse.slice(0, 300))
        return NextResponse.json(
          { error: 'AI did not return structured data. Please try again.', code: 'AI_BAD_OUTPUT', retryable: true },
          { status: 422 },
        )
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(stripped.slice(start, end + 1))
      } catch (parseErr) {
        console.error('[Upload] JSON.parse failed:', parseErr)
        return NextResponse.json(
          { error: 'AI returned malformed JSON. Please try again.', code: 'AI_BAD_OUTPUT', retryable: true },
          { status: 422 },
        )
      }

      resumeData = sanitizeParsed(parsed)
      console.log('[Upload] Parsed OK — name:', resumeData.personalInfo?.fullName,
        '| exp:', resumeData.experience.length,
        '| certs:', resumeData.certifications.length,
        '| bullets[0]:', resumeData.experience[0]?.bullets?.length ?? 0)

      const looksEmpty = !resumeData.personalInfo?.fullName
        && resumeData.experience.length === 0
        && resumeData.skills.length === 0
        && !resumeData.summary
      if (looksEmpty) {
        return NextResponse.json(
          { error: 'AI extracted no usable content from this file. It may be a scanned image — try a text-based PDF.', code: 'AI_EMPTY_OUTPUT', retryable: true },
          { status: 422 },
        )
      }
    } catch (err) {
      console.error('[Upload] AI parse error:', err)
      const details = getAiErrorDetails(err, 'AI parsing')
      return NextResponse.json(
        {
          error: details.error,
          code: details.code,
          retryable: details.retryable,
        },
        { status: 502 },
      )
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
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
