import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatForParsing } from '@/lib/local-ai'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobDescription, currentSummary, currentSkills } = await req.json()

  const prompt = `You are a professional resume writer. Tailor the following resume content to match this job description.

Job Description:
${jobDescription}

Current Summary: ${currentSummary || 'None'}
Current Skills: ${currentSkills || 'None'}

Return a JSON object with:
{
  "summary": "tailored professional summary (2-3 sentences)",
  "keywords": ["keyword1", "keyword2", ...] // 8-10 key terms from the job posting to incorporate
}
Return ONLY the JSON, no explanation.`

  try {
    const content = await chatForParsing({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.6,
    })
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: '', keywords: [] }
    return NextResponse.json(result)
  } catch (err) {
    console.error('AI tailor error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
