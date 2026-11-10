import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resumeId = req.nextUrl.searchParams.get('resumeId')
  if (!resumeId) return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })

  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.user.id } })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const letters = await prisma.coverLetter.findMany({
    where: { resumeId },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json({ letters })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { resumeId, company, role, jobDescription, tone, content } = await req.json()
  if (!resumeId || !content?.trim()) return NextResponse.json({ error: 'resumeId and content are required' }, { status: 400 })

  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.user.id } })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const letter = await prisma.coverLetter.create({
    data: {
      resumeId,
      company: String(company || 'Target company').trim(),
      role: String(role || 'Target role').trim(),
      jobDescription: String(jobDescription || ''),
      tone: String(tone || 'professional'),
      content: String(content),
    },
  })
  return NextResponse.json({ letter }, { status: 201 })
}
