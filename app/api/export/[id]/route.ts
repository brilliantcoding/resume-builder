import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { renderToBuffer } from '@react-pdf/renderer'
import { buildPDFDocument } from '@/lib/pdf'
import { ResumeData, TemplateId } from '@/types/resume'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const resume = await prisma.resume.findFirst({ where: { id, userId: session.user.id } })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data: ResumeData = JSON.parse(resume.data)
  const doc = buildPDFDocument(data, resume.template as TemplateId)
  const buffer = await renderToBuffer(doc)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
    },
  })
}
