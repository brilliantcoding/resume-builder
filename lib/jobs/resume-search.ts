import { prisma } from '@/lib/db'
import { parseResumeData } from '@/lib/resume/normalize'
import type { ExperienceEntry, ResumeData } from '@/types/resume'

export interface ResumeJobSearchProfile {
  resumeId: string
  resumeTitle: string
  updatedAt: string
  q: string
  location?: string
  targetRole: string
  seniority: string | null
  searchSkills: string[]
  skills: string[]
  searchReady: boolean
}

export type ResumeJobSearchProfileResult =
  | { ok: true; profile: ResumeJobSearchProfile }
  | { ok: false; status: number; code: string; error: string }

interface SkillSignal {
  display: string
  lower: string
  score: number
  count: number
  suppressed?: boolean
}

const NOISE_SKILLS = new Set([
  'ability',
  'adaptable',
  'adaptability',
  'attention to detail',
  'collaboration',
  'communication',
  'communication skills',
  'detail oriented',
  'detail-oriented',
  'excellent',
  'fast learner',
  'fast-paced',
  'flexibility',
  'interpersonal skills',
  'leadership',
  'multitasking',
  'organization',
  'problem solving',
  'problem-solving',
  'proficient',
  'self motivated',
  'strong',
  'team player',
  'teamwork',
  'time management',
  'typing',
  'work ethic'
])

const GENERIC_SKILL_CATEGORIES = new Set([
  'core skills',
  'framework',
  'frameworks',
  'language',
  'languages',
  'platform',
  'platforms',
  'skills',
  'soft skills',
  'technical skills',
  'technology',
  'technologies',
  'tool',
  'tools'
])

const GENERIC_CERTIFICATIONS = new Set([
  'certified',
  'certification',
  'course',
  'coursework',
  'training'
])

const TECHNICAL_CATEGORY =
  /(?:technical|technology|technologies|programming|language|framework|library|tool|platform|cloud|data|database|devops|design|analytics|testing|quality|marketing|product|project|operational|methodology)/i

const KNOWN_SKILL_TERMS = [
  '.net',
  'accessibility',
  'adobe xd',
  'airflow',
  'agile',
  'amazon dynamodb',
  'amazon web services',
  'angular',
  'analytics',
  'ansible',
  'api gateway',
  'arcgis',
  'aurora',
  'asp.net',
  'aws',
  'azure',
  'azure devops',
  'bash',
  'bigquery',
  'brand strategy',
  'c',
  'c#',
  'c++',
  'confluence',
  'content marketing',
  'content strategy',
  'copywriting',
  'css',
  'customer research',
  'cicd',
  'cloudformation',
  'cloudfront',
  'cloudwatch',
  'cosmos db',
  'cypress',
  'data analysis',
  'data science',
  'dbt',
  'design systems',
  'django',
  'docker',
  'dynamodb',
  'ec2',
  'ecs',
  'eks',
  'elastic stack',
  'elasticsearch',
  'excel',
  'express',
  'express.js',
  'figma',
  'flask',
  'gcp',
  'git',
  'github',
  'gitlab',
  'go',
  'golang',
  'graphql',
  'html',
  'hubspot',
  'illustrator',
  'information architecture',
  'java',
  'javascript',
  'jest',
  'jira',
  'jquery',
  'karma',
  'kotlin',
  'kubernetes',
  'lambda',
  'laravel',
  'machine learning',
  'market research',
  'mocha',
  'mongodb',
  'mysql',
  'nest.js',
  'nestjs',
  'next.js',
  'node.js',
  'numpy',
  'pandas',
  'php',
  'playwright',
  'postgreSQL',
  'power bi',
  'powerbi',
  'product management',
  'product roadmap',
  'prototyping',
  'python',
  'quality assurance',
  'rails',
  'rds',
  'react',
  'redis',
  'rest api',
  'responsive design',
  'route 53',
  'ruby',
  'rust',
  's3',
  'salesforce',
  'sagemaker',
  'sass',
  'scala',
  'scrum',
  'sdlc',
  'seo',
  'sketch',
  'snowflake',
  'spark',
  'sql',
  'svelte',
  'swift',
  'tailwind',
  'tableau',
  'tensorflow',
  'terraform',
  'test automation',
  'typescript',
  'ui design',
  'user research',
  'ux design',
  'vertex ai',
  'vitest',
  'vite',
  'vpc',
  'vue',
  'webpack',
  'wireframing',
  'wordpress',
  'xml'
]

const SHORT_SKILL_TERMS = new Set(['c', 'c#', 'go', 'r'])

const SKILL_ALIASES: Record<string, string> = {
  'amazon dynamodb': 'DynamoDB',
  'amazon web services': 'AWS',
  'aws': 'AWS',
  'c++': 'C++',
  'c#': 'C#',
  'cpp': 'C++',
  'dynamo db': 'DynamoDB',
  'dynamodb': 'DynamoDB',
  'express.js': 'Express',
  'gcp': 'Google Cloud',
  'golang': 'Go',
  'js': 'JavaScript',
  'nest': 'NestJS',
  'nestjs': 'NestJS',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'next': 'Next.js',
  'nextjs': 'Next.js',
  'powerbi': 'Power BI',
  'power-bi': 'Power BI',
  'reactjs': 'React',
  'react.js': 'React',
  'route53': 'Route 53',
  'ts': 'TypeScript',
  'vuejs': 'Vue',
  'vue.js': 'Vue'
}

const TECH_PRIORITY: Record<string, number> = {
  '.net': 108,
  accessibility: 86,
  angular: 100,
  ansible: 106,
  'api gateway': 78,
  aws: 150,
  azure: 148,
  bash: 82,
  'c#': 118,
  'c++': 118,
  cicd: 102,
  cloudformation: 76,
  cloudwatch: 72,
  'cosmos db': 78,
  cypress: 68,
  dbt: 102,
  django: 112,
  docker: 124,
  dynamodb: 88,
  ec2: 76,
  ecs: 76,
  eks: 82,
  elasticsearch: 94,
  express: 102,
  figma: 82,
  flask: 106,
  'google cloud': 146,
  graphql: 118,
  html: 62,
  java: 132,
  javascript: 128,
  jest: 66,
  karma: 54,
  kotlin: 116,
  kubernetes: 128,
  lambda: 78,
  laravel: 98,
  'machine learning': 130,
  mocha: 54,
  mongodb: 112,
  mysql: 114,
  nestjs: 96,
  'next.js': 124,
  'node.js': 132,
  numpy: 104,
  pandas: 104,
  php: 96,
  playwright: 74,
  postgresql: 116,
  'power bi': 100,
  python: 134,
  rails: 98,
  rds: 76,
  react: 136,
  redis: 110,
  'rest api': 92,
  'route 53': 72,
  ruby: 106,
  rust: 122,
  s3: 80,
  sagemaker: 84,
  sass: 74,
  scala: 114,
  snowflake: 108,
  spark: 112,
  sql: 126,
  svelte: 96,
  swift: 114,
  tailwind: 80,
  tableau: 94,
  tensorflow: 110,
  terraform: 122,
  typescript: 130,
  'vertex ai': 86,
  vitest: 64,
  vite: 88,
  vpc: 70,
  vue: 104,
  webpack: 78
}

const AWS_CHILD_TERMS = new Set([
  'api gateway',
  'aurora',
  'cloudformation',
  'cloudfront',
  'cloudwatch',
  'dynamodb',
  'ec2',
  'ecs',
  'eks',
  'lambda',
  'rds',
  'route 53',
  's3',
  'sagemaker',
  'vpc'
])

const GCP_CHILD_TERMS = new Set(['bigquery', 'vertex ai'])
const AZURE_CHILD_TERMS = new Set(['azure devops', 'cosmos db'])
const NODE_CHILD_TERMS = new Set(['express', 'express.js', 'nestjs', 'npm', 'pnpm', 'yarn'])
const JS_TEST_TERMS = new Set(['cypress', 'jest', 'karma', 'mocha', 'playwright', 'vitest'])

const US_STATE_NAMES: Record<string, string> = {
  al: 'Alabama',
  ak: 'Alaska',
  az: 'Arizona',
  ar: 'Arkansas',
  ca: 'California',
  co: 'Colorado',
  ct: 'Connecticut',
  de: 'Delaware',
  fl: 'Florida',
  ga: 'Georgia',
  hi: 'Hawaii',
  id: 'Idaho',
  il: 'Illinois',
  in: 'Indiana',
  ia: 'Iowa',
  ks: 'Kansas',
  ky: 'Kentucky',
  la: 'Louisiana',
  me: 'Maine',
  md: 'Maryland',
  ma: 'Massachusetts',
  mi: 'Michigan',
  mn: 'Minnesota',
  ms: 'Mississippi',
  mo: 'Missouri',
  mt: 'Montana',
  ne: 'Nebraska',
  nv: 'Nevada',
  nh: 'New Hampshire',
  nj: 'New Jersey',
  nm: 'New Mexico',
  ny: 'New York',
  nc: 'North Carolina',
  nd: 'North Dakota',
  oh: 'Ohio',
  ok: 'Oklahoma',
  or: 'Oregon',
  pa: 'Pennsylvania',
  ri: 'Rhode Island',
  sc: 'South Carolina',
  sd: 'South Dakota',
  tn: 'Tennessee',
  tx: 'Texas',
  ut: 'Utah',
  vt: 'Vermont',
  va: 'Virginia',
  wa: 'Washington',
  wv: 'West Virginia',
  wi: 'Wisconsin',
  wy: 'Wyoming',
  dc: 'District of Columbia'
}

const US_STATE_NAME_ENTRIES: Array<[string, string]> = Object.entries(US_STATE_NAMES)
  .map(([abbrev, name]) => [name.toLowerCase(), abbrev] as [string, string])
  .sort((a, b) => b[0].length - a[0].length)

const SENIORITY_SIGNALS: Array<[string, RegExp]> = [
  ['Executive', /chief|executive/i],
  ['VP', /vice president|\bvp\b/i],
  ['Director', /director|head of/i],
  ['Principal', /principal/i],
  ['Staff', /staff/i],
  ['Manager', /manager|team lead|project lead/i],
  ['Senior', /senior|\bsr\.?/i],
  ['Lead', /\blead\b/i],
  ['Entry level', /junior|entry level|intern/i]
]

function cleanPhrase(value: string | undefined | null): string {
  return (value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s•·,;:|-]+|[\s•·,;:|-]+$/g, '')
    .trim()
}

function isUsablePhrase(value: string): boolean {
  if (value.length < 2) return false
  if (/@|https?:\/\/|\d{3}[-.) ]?\d{3}[-.]?\d{4}/i.test(value)) return false
  if (GENERIC_CERTIFICATIONS.has(value.toLowerCase())) return false
  return value.length <= 96
}

function tokenizePhrase(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/\+\+/g, 'pp')
      .replace(/[^a-z0-9+#]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 1 && !['the', 'and', 'of', 'with', 'for', 'in'].includes(token))
  )
}

function phraseContainsTerm(phrase: string, term: string): boolean {
  const normalized = ` ${phrase.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()} `
  const candidate = term.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()
  return normalized.includes(` ${candidate} `)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function knownTermsFromText(text: string): string[] {
  const normalized = ` ${text.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim()} `
  const found = new Set<string>()

  for (const term of KNOWN_SKILL_TERMS) {
    if (term.length < 3 && !SHORT_SKILL_TERMS.has(term)) continue
    const pattern = new RegExp(`(?:^|[\\s,;])${escapeRegExp(term)}(?:$|[\\s,;])`, 'i')
    if (pattern.test(normalized)) found.add(term)
  }

  return [...found]
}

function canonicalSkill(term: string): { display: string; lower: string } | null {
  const raw = cleanPhrase(term).replace(/\s*\/\s*/g, ' ').replace(/\s{2,}/g, ' ').trim()
  if (!raw) return null

  const alias = SKILL_ALIASES[raw.toLowerCase()]
  const display = alias ?? raw
  const lower = display.toLowerCase()
  if (lower.length < 2 && !SHORT_SKILL_TERMS.has(lower)) return null
  if (NOISE_SKILLS.has(lower)) return null
  if (display.length > 44) return null
  return { display, lower }
}

function skillPriority(lower: string): number {
  return TECH_PRIORITY[lower] ?? 50
}

function addSignalToMap(signals: Map<string, SkillSignal>, display: string, score: number, count = 1): void {
  const term = canonicalSkill(display)
  if (!term) return
  const existing = signals.get(term.lower)
  if (existing) {
    existing.score = Math.max(existing.score, score)
    existing.count += count
    return
  }
  signals.set(term.lower, { ...term, score, count })
}

function parentKeywordFor(lower: string, signals: Map<string, SkillSignal>): string | null {
  if (AWS_CHILD_TERMS.has(lower)) return 'AWS'
  if (GCP_CHILD_TERMS.has(lower)) return 'Google Cloud'
  if (AZURE_CHILD_TERMS.has(lower)) return 'Azure'
  if (NODE_CHILD_TERMS.has(lower)) return 'Node.js'
  if (JS_TEST_TERMS.has(lower)) {
    if (signals.has('typescript')) return 'TypeScript'
    if (signals.has('javascript')) return 'JavaScript'
    return 'JavaScript'
  }
  return null
}

function promoteHighPriorityKeywords(signals: Map<string, SkillSignal>): void {
  const snapshot = [...signals.values()]

  for (const signal of snapshot) {
    if (signal.suppressed) continue
    const parent = parentKeywordFor(signal.lower, signals)
    if (!parent) continue

    const parentTerm = canonicalSkill(parent)
    if (!parentTerm || parentTerm.lower === signal.lower) continue

    const parentScore = signal.score + skillPriority(parentTerm.lower) / 4 + 16
    addSignalToMap(signals, parentTerm.display, parentScore)
    const child = signals.get(signal.lower)
    if (child) child.suppressed = true
  }
}

function splitSkillTerms(value: string): string[] {
  return value
    .replace(/[()[\]]/g, ' ')
    .split(/[\n;,|/]+/)
    .map(cleanPhrase)
    .filter(Boolean)
}

function addSkillSignal(
  signals: Map<string, SkillSignal>,
  value: string | undefined | null,
  baseScore: number
) {
  if (!value) return
  for (const rawTerm of splitSkillTerms(value)) {
    const term = canonicalSkill(rawTerm)
    if (!term) continue

    const priorityScore = skillPriority(term.lower) / 10
    const existing = signals.get(term.lower)
    if (existing) {
      existing.count += 1
      existing.score += baseScore + Math.min(2, existing.count) + priorityScore
      if (existing.display.length < term.display.length && baseScore >= 6) {
        existing.display = term.display
      }
      continue
    }

    signals.set(term.lower, { ...term, score: baseScore + priorityScore, count: 1 })
  }
}

function isTechnicalCategory(category: string): boolean {
  return TECHNICAL_CATEGORY.test(category)
}

function addKnownTerms(signals: Map<string, SkillSignal>, text: string, baseScore: number) {
  for (const term of knownTermsFromText(text)) {
    addSkillSignal(signals, term, baseScore)
  }
}

function dateRank(value: string | undefined, current: boolean): number {
  if (current) return Number.POSITIVE_INFINITY
  const text = (value ?? '').trim()
  if (!text) return 0
  const parsed = Date.parse(text)
  if (Number.isFinite(parsed)) return parsed
  const year = text.match(/(?:19|20)\d{2}/)?.[0]
  return year ? Number(year) * 31_556_952_000 : 0
}

function latestExperience(experience: ExperienceEntry[]): ExperienceEntry | undefined {
  return [...experience].sort((a, b) => {
    const aRank = dateRank(a.endDate || a.startDate, a.current)
    const bRank = dateRank(b.endDate || b.startDate, b.current)
    return bRank - aRank
  })[0]
}

function mostFrequentRole(experience: ExperienceEntry[]): string {
  const roles = new Map<string, { display: string; count: number; rank: number }>()

  for (const entry of experience) {
    const role = cleanPhrase(entry.position)
    if (!role || !isUsablePhrase(role)) continue
    const lower = role.toLowerCase()
    const rank = dateRank(entry.endDate || entry.startDate, entry.current)
    const existing = roles.get(lower)
    if (existing) {
      existing.count += 1
      existing.rank = Math.max(existing.rank, rank)
    } else {
      roles.set(lower, { display: role, count: 1, rank })
    }
  }

  return [...roles.values()]
    .sort((a, b) => b.count - a.count || b.rank - a.rank)
    [0]?.display ?? ''
}

function normalizeLocationText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\bd\.?\s?c\.?\b/g, 'dc')
    .replace(/[^a-z0-9\s,#&.+-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenizeLocation(value: string): string[] {
  return value.split(/[^a-z0-9+#]+/).filter(Boolean)
}

function detectResumeState(value: string): string {
  const normalized = normalizeLocationText(value)
  for (const [name, abbrev] of US_STATE_NAME_ENTRIES) {
    const regex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(name)}(?:$|[\\s,;])`)
    if (regex.test(normalized)) return US_STATE_NAMES[abbrev]
  }

  for (const token of tokenizeLocation(normalized)) {
    const name = US_STATE_NAMES[token]
    if (name) return name
  }

  return ''
}

function deriveSearchLocation(value: string | undefined | null): string | undefined {
  const raw = cleanPhrase(value)
  if (!raw) return undefined
  if (/remote|work from home|wfh|anywhere/i.test(raw)) return 'Remote'
  return detectResumeState(raw) || raw
}

function detectSeniority(...texts: Array<string | undefined | null>): string | null {
  const haystack = texts.filter(Boolean).join(' ')
  for (const [label, pattern] of SENIORITY_SIGNALS) {
    if (pattern.test(haystack)) return label
  }
  return null
}

function chooseTargetRole(data: ResumeData): string {
  const headline = cleanPhrase(data.personalInfo.jobTitle)
  const latest = latestExperience(data.experience)?.position
  const latestRole = cleanPhrase(latest)
  const frequentRole = mostFrequentRole(data.experience)
  const educationField = cleanPhrase(data.education[0]?.field)

  return [headline, latestRole, frequentRole, educationField].find(isUsablePhrase) ?? ''
}

function collectSkillSignals(data: ResumeData, targetRole: string): SkillSignal[] {
  const signals = new Map<string, SkillSignal>()
  const roleTerms = tokenizePhrase(targetRole)
  const roleHaystack = targetRole.toLowerCase()

  for (const group of data.skills) {
    const category = cleanPhrase(group.category)
    const categoryScore = isTechnicalCategory(category) ? 5 : 1
    if (category && isUsablePhrase(category) && !GENERIC_SKILL_CATEGORIES.has(category.toLowerCase())) {
      addSkillSignal(signals, category, Math.max(1, categoryScore - 3))
    }

    for (const skill of group.skills) {
      addSkillSignal(signals, skill, categoryScore)
    }
  }

  for (const project of data.projects) {
    for (const technology of project.technologies) addSkillSignal(signals, technology, 8)
  }

  const resumeText = [
    data.personalInfo.jobTitle,
    data.summary,
    ...data.experience.map((entry) => `${entry.position} ${entry.description} ${entry.bullets.join(' ')}`),
    ...data.projects.map((entry) => `${entry.name} ${entry.description}`)
  ]
    .filter(Boolean)
    .join(' ')

  addKnownTerms(signals, resumeText, 7)
  promoteHighPriorityKeywords(signals)

  for (const [lower, entry] of signals) {
    const roleBonus = roleTerms.has(lower) ? 4 : roleHaystack.includes(lower) ? 3 : 0
    entry.score += roleBonus + Math.min(4, entry.count - 1)
  }

  return [...signals.values()]
    .filter((entry) => !entry.suppressed)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.count !== a.count) return b.count - a.count
      return a.display.localeCompare(b.display)
    })
}

function uniqueQuerySkills(skills: SkillSignal[], targetRole: string, limit: number): string[] {
  const selected: string[] = []
  const seen = new Set<string>()

  for (const skill of skills) {
    if (seen.has(skill.lower)) continue
    if (targetRole && (phraseContainsTerm(targetRole, skill.display) || phraseContainsTerm(skill.display, targetRole))) continue
    seen.add(skill.lower)
    selected.push(skill.display)
    if (selected.length >= limit) break
  }

  return selected
}

function buildQuery(targetRole: string, skillTerms: string[]): string {
  const primary = [targetRole, ...skillTerms].filter(Boolean).join(' ')
  if (isUsablePhrase(primary)) return primary.slice(0, 160)

  if (skillTerms.length > 0) return skillTerms.slice(0, 5).join(' ').slice(0, 160)
  return targetRole.slice(0, 160)
}

export function buildResumeJobSearchProfile(
  resume: { id: string; title: string; updatedAt: Date },
  data: ResumeData
): ResumeJobSearchProfile {
  const targetRole = chooseTargetRole(data)
  const skills = collectSkillSignals(data, targetRole)
  const querySkills = uniqueQuerySkills(skills, targetRole, targetRole ? 3 : 5)
  const q = buildQuery(targetRole, querySkills)
  const visibleSkills = uniqueQuerySkills(skills, targetRole, 8)
  const location = deriveSearchLocation(data.personalInfo.location)
  const seniority = detectSeniority(
    targetRole,
    ...data.experience.map((entry) => entry.position),
    data.summary
  )

  return {
    resumeId: resume.id,
    resumeTitle: cleanPhrase(resume.title) || 'Untitled Resume',
    updatedAt: resume.updatedAt.toISOString(),
    q,
    location,
    targetRole,
    seniority,
    searchSkills: querySkills,
    skills: visibleSkills,
    searchReady: q.trim().length >= 2
  }
}

export async function getResumeJobSearchProfile(
  userId: string,
  resumeId?: string
): Promise<ResumeJobSearchProfileResult> {
  const resume = resumeId
    ? await prisma.resume.findFirst({ where: { id: resumeId, userId } })
    : await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: 'desc' } })

  if (!resume) {
    return {
      ok: false,
      status: 404,
      code: 'NO_RESUME',
      error: 'Create a resume before using resume-based job search.'
    }
  }

  const data = parseResumeData(resume.data)
  if (!data) {
    return {
      ok: false,
      status: 422,
      code: 'INVALID_RESUME',
      error: 'This resume could not be read. Open it and save it again before searching.'
    }
  }

  const profile = buildResumeJobSearchProfile(resume, data)
  if (!profile.searchReady) {
    return {
      ok: false,
      status: 422,
      code: 'RESUME_NOT_READY',
      error: 'Add a target job title, recent role, or skills to this resume before searching jobs.'
    }
  }

  return { ok: true, profile }
}
