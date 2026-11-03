import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatWithFallback } from '@/lib/local-ai'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bullet, jobTitle } = await req.json()

  const prompt = `Improve this resume bullet point to be more impactful and quantified.
Job Title: ${jobTitle || 'Not specified'}
Original bullet: ${bullet}

Requirements:
- Start with a strong action verb
- Include metrics/numbers where possible (estimate if needed)
- Be specific and concise (under 15 words)
- Return ONLY the improved bullet point, no quotes or explanations`

  try {
    const improved = await chatWithFallback({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    })
    return NextResponse.json({ improved })
  } catch (err) {
    console.error('AI improve error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
