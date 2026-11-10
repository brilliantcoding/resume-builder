import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatWithFallback } from '@/lib/local-ai'
import { ResumeData } from '@/types/resume'

export const maxDuration = 60

const TONE_GUIDE: Record<string, string> = {
  professional: 'Formal, confident, recruiter-ready. No slang, no clichés like "team player".',
  enthusiastic: 'Warm and energetic but still factual and recruiter-ready.',
  concise: 'Tight and direct — every sentence earns its place. 200-280 words.',
  executive: 'Senior-level voice: business impact, scope, and outcomes first.',
}

function resumeDigest(data: ResumeData): string {
  const p = data.personalInfo
  const exp = (data.experience || []).slice(0, 5)
    .map((e) => `- ${e.position}${e.company ? ` at ${e.company}` : ''}${e.startDate ? ` (${e.startDate}${e.current || e.endDate ? ` – ${e.current ? 'Present' : e.endDate}` : ''})` : ''}\n${(e.bullets || []).filter(Boolean).slice(0, 4).map((b) => `  • ${b}`).join('\n')}`)
    .join('\n')
  const skills = (data.skills || []).map((g) => `${g.category}: ${(g.skills || []).join(', ')}`).join('\n')
  const projects = (data.projects || []).slice(0, 3)
    .map((pr) => `- ${pr.name}: ${pr.description}`)
    .join('\n')
  return [
    `Name: ${p.fullName}`,
    p.jobTitle ? `Target role: ${p.jobTitle}` : '',
    p.email ? `Email: ${p.email}` : '',
    p.phone ? `Phone: ${p.phone}` : '',
    p.location ? `Location: ${p.location}` : '',
    [p.website, p.linkedin, p.github].filter(Boolean).length ? `Links: ${[p.website, p.linkedin, p.github].filter(Boolean).join(', ')}` : '',
    data.summary ? `\nProfessional summary:\n${data.summary}` : '',
    exp ? `\nExperience:\n${exp}` : '',
    skills ? `\nSkills:\n${skills}` : '',
    projects ? `\nProjects:\n${projects}` : '',
  ].filter(Boolean).join('\n')
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { resumeData, company, role, jobDescription, tone } = (await req.json()) as {
    resumeData?: ResumeData
    company?: string
    role?: string
    jobDescription?: string
    tone?: string
  }

  if (!resumeData?.personalInfo) return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
  if (!company?.trim() || !role?.trim()) {
    return NextResponse.json({ error: 'Company and role are required' }, { status: 400 })
  }

  const prompt = `You are a professional career coach writing a cover letter a candidate sends to recruiters.

CANDIDATE PROFILE (use ONLY these facts — never invent experience, metrics, or employers):
${resumeDigest(resumeData)}

TARGET
Company: ${company.trim()}
Role: ${role.trim()}
${jobDescription?.trim() ? `\nJOB POSTING (mirror its language and priorities where the candidate genuinely matches):\n${jobDescription.trim().slice(0, 4000)}\n` : ''}
TONE: ${TONE_GUIDE[tone || 'professional'] || TONE_GUIDE.professional}

FORMAT (plain text, no markdown):
Line 1: candidate name
Line 2: email · phone · location (only the ones available)
${resumeData.personalInfo.linkedin ? 'Include the LinkedIn URL in the header line when available.\n' : ''}Blank line, then "Dear Hiring Manager," (or the company's team if obvious from the posting).
Then 3 short paragraphs: (1) the specific role and a one-line hook with the candidate's strongest matching credential; (2) two or three concrete achievements from the profile that map to the role's needs; (3) brief closing that invites a conversation.
End with "Sincerely," and the candidate name.
250-350 words unless the tone says otherwise. Return ONLY the letter text — no preamble, no markdown fences, no placeholders like [Name].`

  try {
    const content = await chatWithFallback({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.6,
    })
    const cleaned = content.replace(/^```(?:\w+)?\s*/i, '').replace(/```\s*$/, '').trim()
    if (!cleaned) {
      return NextResponse.json(
        { error: 'AI returned an empty letter. Please try again.', code: 'AI_EMPTY_OUTPUT', retryable: true },
        { status: 502 },
      )
    }
    return NextResponse.json({ content: cleaned })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[CoverLetter] AI error:', err)
    const unavailable = /connection|network|ECONNREFUSED|ECONNRESET|ETIMEDOUT|timeout|fetch failed|401|403|Unauthorized|404|not found|model/i.test(msg)
    return NextResponse.json(
      {
        error: unavailable
          ? 'AI service is unavailable or misconfigured. Check the model server and try again.'
          : 'Cover letter generation failed. Please try again.',
        code: unavailable ? 'AI_UNAVAILABLE' : 'AI_PARSE_FAILED',
        retryable: true,
      },
      { status: 502 },
    )
  }
}
