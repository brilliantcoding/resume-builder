import type { ResumeData } from '@/types/resume'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function asString(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === 'string' ? record[key] as string : ''
}

function asStringArray(record: Record<string, unknown>, key: string): string[] {
  return Array.isArray(record[key])
    ? record[key].filter((item): item is string => typeof item === 'string')
    : []
}

export function normalizeResumeData(value: unknown): ResumeData | null {
  if (!isRecord(value)) return null

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

export function parseResumeData(raw: string | null | undefined): ResumeData | null {
  if (!raw) return null
  try {
    return normalizeResumeData(JSON.parse(raw))
  } catch {
    return null
  }
}
