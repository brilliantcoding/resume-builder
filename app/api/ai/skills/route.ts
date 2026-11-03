import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatWithFallback } from '@/lib/local-ai'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobTitle, jobDescription } = await req.json()

  const prompt = `Suggest relevant technical and soft skills for a resume.
Job Title: ${jobTitle || 'Not specified'}
Job Description: ${jobDescription || 'Not provided'}

Return a JSON object with this exact structure:
{
  "technical": ["skill1", "skill2", ...],
  "soft": ["skill1", "skill2", ...]
}
Include 6-8 technical skills and 4-5 soft skills. Return ONLY the JSON, no explanation.`

  try {
    const content = await chatWithFallback({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.5,
    })
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const skills = jsonMatch ? JSON.parse(jsonMatch[0]) : { technical: [], soft: [] }
    return NextResponse.json({ skills })
  } catch (err) {
    console.error('AI skills error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
