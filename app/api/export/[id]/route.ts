import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { renderToBuffer } from '@react-pdf/renderer'
import { buildPDFDocument } from '@/lib/pdf'
import { isTemplateId, ResumeData } from '@/types/resume'

async function getOwnedResume(id: string, userId: string) {
  return prisma.resume.findFirst({ where: { id, userId } })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeResumeData(value: unknown): ResumeData | null {
  if (!isRecord(value)) return null

  const asString = (record: Record<string, unknown>, key: string) =>
    typeof record[key] === 'string' ? record[key] as string : ''
  const asStringArray = (record: Record<string, unknown>, key: string) =>
    Array.isArray(record[key]) ? record[key].filter((item): item is string => typeof item === 'string') : []
  const asRecords = (key: string) => {
    const entries = value[key]
    return entries == null ? [] : Array.isArray(entries) && entries.every(isRecord) ? entries : null
  }
  const personalInfo = value.personalInfo == null ? {} : value.personalInfo
  if (!isRecord(personalInfo)) return null

  const experience = asRecords('experience')
  const education = asRecords('education')
  const skills = asRecords('skills')
  const projects = asRecords('projects')
  const certifications = asRecords('certifications')
  if (!experience || !education || !skills || !projects || !certifications) return null
  if (value.summary != null && typeof value.summary !== 'string') return null

  return {
    personalInfo: {
      fullName: asString(personalInfo, 'fullName'),
      email: asString(personalInfo, 'email'),
      phone: asString(personalInfo, 'phone'),
      location: asString(personalInfo, 'location'),
      website: asString(personalInfo, 'website'),
      linkedin: asString(personalInfo, 'linkedin'),
      github: asString(personalInfo, 'github'),
      jobTitle: asString(personalInfo, 'jobTitle'),
    },
    summary: typeof value.summary === 'string' ? value.summary : '',
    experience: experience.map((entry, index) => ({
      id: asString(entry, 'id') || `experience-${index}`,
      company: asString(entry, 'company'),
      position: asString(entry, 'position'),
      startDate: asString(entry, 'startDate'),
      endDate: asString(entry, 'endDate'),
      current: typeof entry.current === 'boolean' ? entry.current : false,
      description: asString(entry, 'description'),
      bullets: asStringArray(entry, 'bullets'),
    })),
    education: education.map((entry, index) => ({
      id: asString(entry, 'id') || `education-${index}`,
      institution: asString(entry, 'institution'),
      degree: asString(entry, 'degree'),
      field: asString(entry, 'field'),
      startDate: asString(entry, 'startDate'),
      endDate: asString(entry, 'endDate'),
      gpa: asString(entry, 'gpa'),
      honors: asString(entry, 'honors'),
    })),
    skills: skills.map((entry, index) => ({
      id: asString(entry, 'id') || `skills-${index}`,
      category: asString(entry, 'category'),
      skills: asStringArray(entry, 'skills'),
    })),
    projects: projects.map((entry, index) => ({
      id: asString(entry, 'id') || `project-${index}`,
      name: asString(entry, 'name'),
      description: asString(entry, 'description'),
      technologies: asStringArray(entry, 'technologies'),
      url: asString(entry, 'url'),
      github: asString(entry, 'github'),
      startDate: asString(entry, 'startDate'),
      endDate: asString(entry, 'endDate'),
    })),
    certifications: certifications.map((entry, index) => ({
      id: asString(entry, 'id') || `certification-${index}`,
      name: asString(entry, 'name'),
      issuer: asString(entry, 'issuer'),
      date: asString(entry, 'date'),
      url: asString(entry, 'url'),
    })),
  }
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

  let storedData: unknown
  try {
    storedData = JSON.parse(resume.data)
  } catch {
    return NextResponse.json({ error: 'Saved resume data is invalid.' }, { status: 500 })
  }
  const data = normalizeResumeData(storedData)
  if (!data) return NextResponse.json({ error: 'Saved resume data is invalid.' }, { status: 500 })
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
  const data = normalizeResumeData(request.data)
  if (!data) {
    return NextResponse.json({ error: 'Resume data is invalid.' }, { status: 400 })
  }
  if (!isTemplateId(request.template)) {
    return NextResponse.json({ error: 'Invalid resume template.' }, { status: 400 })
  }

  const title = typeof request.title === 'string' ? request.title : resume.title
  return renderPDF(data, request.template, title)
}
