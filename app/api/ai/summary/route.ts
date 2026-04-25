import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatWithFallback } from '@/lib/nvidia'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobTitle, experience, skills } = await req.json()

  const prompt = `Write a concise, compelling professional summary for a resume.
Job Title: ${jobTitle || 'Not specified'}
Years of experience: ${experience || 'Not specified'}
Key skills: ${skills || 'Not specified'}

Requirements:
- 2-3 sentences max
- First person, but don't start with "I"
- Action-oriented and specific
- No clichés like "results-driven" or "passionate"
- Return ONLY the summary text, nothing else`

  try {
    const summary = await chatWithFallback({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    })
    return NextResponse.json({ summary })
  } catch (err) {
    console.error('AI summary error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
