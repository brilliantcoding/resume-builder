import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { defaultResumeData } from '@/types/resume'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, template: true, updatedAt: true, createdAt: true },
  })
  return NextResponse.json(resumes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const title = body.title || 'Untitled Resume'

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title,
      template: 'modern',
      data: JSON.stringify(defaultResumeData),
    },
  })
  return NextResponse.json(resume, { status: 201 })
}
