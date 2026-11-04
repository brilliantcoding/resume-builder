import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { renderToBuffer } from '@react-pdf/renderer'
import { buildPDFDocument } from '@/lib/pdf'
import { isTemplateId, ResumeData } from '@/types/resume'

async function getOwnedResume(id: string, userId: string) {
  return prisma.resume.findFirst({ where: { id, userId } })
}

function isResumeData(value: unknown): value is ResumeData {
  const isRecord = (entry: unknown): entry is Record<string, unknown> =>
    Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry)
  const hasStringFields = (entry: unknown, fields: string[]) =>
    isRecord(entry) && fields.every((field) => typeof entry[field] === 'string')
  if (!isRecord(value) || !hasStringFields(value.personalInfo, ['fullName', 'email', 'phone', 'location'])) return false
  if (typeof value.summary !== 'string') return false

  const isStringArray = (entry: unknown) =>
    Array.isArray(entry) && entry.every((item) => typeof item === 'string')
  return (
    Array.isArray(value.experience) &&
    value.experience.every((entry) =>
      isRecord(entry) &&
      hasStringFields(entry, ['company', 'position', 'startDate', 'endDate']) &&
      typeof entry.current === 'boolean' &&
      isStringArray(entry.bullets),
    ) &&
    Array.isArray(value.education) &&
    value.education.every((entry) => isRecord(entry) && hasStringFields(entry, ['institution', 'degree', 'field', 'startDate', 'endDate'])) &&
    Array.isArray(value.skills) &&
    value.skills.every((entry) => isRecord(entry) && hasStringFields(entry, ['category']) && isStringArray(entry.skills)) &&
    Array.isArray(value.projects) &&
    value.projects.every((entry) => isRecord(entry) && hasStringFields(entry, ['name', 'description']) && isStringArray(entry.technologies)) &&
    Array.isArray(value.certifications) &&
    value.certifications.every((entry) => isRecord(entry) && hasStringFields(entry, ['name', 'issuer', 'date']))
  )
}

async function renderPDF(data: ResumeData, template: string, title: string) {
  if (!isTemplateId(template)) {
    return NextResponse.json({ error: 'Invalid resume template.' }, { status: 400 })
  }
  const buffer = await renderToBuffer(buildPDFDocument(data, template))
  const filename = title.replace(/[^a-z0-9]/gi, '_') || 'resume'
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}.pdf"`,
    },
  })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const resume = await getOwnedResume(id, session.user.id)
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data: unknown = JSON.parse(resume.data)
  if (!isResumeData(data)) return NextResponse.json({ error: 'Resume data is invalid.' }, { status: 500 })
  return renderPDF(data, resume.template, resume.title)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const resume = await getOwnedResume(id, session.user.id)
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid export request.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid export request.' }, { status: 400 })
  }
  const request = body as { data?: unknown; template?: unknown; title?: unknown }
  if (!isResumeData(request.data)) {
    return NextResponse.json({ error: 'Resume data is invalid.' }, { status: 400 })
  }
  if (!isTemplateId(request.template)) {
    return NextResponse.json({ error: 'Invalid resume template.' }, { status: 400 })
  }

  const title = typeof request.title === 'string' ? request.title : resume.title
  return renderPDF(request.data, request.template, title)
}
