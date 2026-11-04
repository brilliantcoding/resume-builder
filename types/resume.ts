export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  jobTitle?: string
}

export interface ExperienceEntry {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  bullets: string[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
}

export interface SkillGroup {
  id: string
  category: string
  skills: string[]
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate?: string
  endDate?: string
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export const TEMPLATE_IDS = [
  'modern',
  'classic',
  'minimal',
  'creative',
  'professional',
  'executive',
  'timeline',
  'elegant',
  'compact',
  'altacv',
  'jakes',
  'sixtyseconds',
  'berlin',
  'tokyo',
  'vienna',
] as const

export type TemplateId = (typeof TEMPLATE_IDS)[number]

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === 'string' && TEMPLATE_IDS.some((template) => template === value)
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillGroup[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    jobTitle: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}
