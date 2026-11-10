import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getOwned(id: string, userId: string) {
  return prisma.coverLetter.findFirst({ where: { id, resume: { userId } } })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await getOwned(id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.coverLetter.update({
    where: { id },
    data: {
      company: body.company ?? existing.company,
      role: body.role ?? existing.role,
      jobDescription: body.jobDescription ?? existing.jobDescription,
      tone: body.tone ?? existing.tone,
      content: body.content ?? existing.content,
    },
  })
  return NextResponse.json({ letter: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await getOwned(id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.coverLetter.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
