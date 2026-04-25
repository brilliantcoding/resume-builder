import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getOwned(id: string, userId: string) {
  return prisma.resume.findFirst({ where: { id, userId } })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const resume = await getOwned(id, session.user.id)
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...resume, data: JSON.parse(resume.data) })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await getOwned(id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.resume.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      template: body.template ?? existing.template,
      data: body.data ? JSON.stringify(body.data) : existing.data,
    },
  })
  return NextResponse.json({ ...updated, data: JSON.parse(updated.data) })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await getOwned(id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.resume.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
