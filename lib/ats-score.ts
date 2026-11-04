import { ResumeData } from '@/types/resume'

// ── Types ──────────────────────────────────────────────────────────────────

export interface ScoreCategory {
  id: string
  label: string
  score: number
  max: number
  details: string[]   // what scored well
  missing: string[]   // what's costing points
}

export interface ATSResult {
  total: number        // 0-100
  grade: 'poor' | 'fair' | 'good' | 'excellent'
  categories: ScoreCategory[]
  suggestions: Suggestion[]
}

export interface Suggestion {
  priority: 'high' | 'medium' | 'low'
  text: string
  section: string    // which section to go to
}

// ── Constants ──────────────────────────────────────────────────────────────

const ACTION_VERBS = new Set([
  // Leadership
  'led', 'managed', 'directed', 'oversaw', 'supervised', 'headed', 'spearheaded',
  'established', 'founded', 'launched', 'pioneered', 'initiated',
  // Building
  'built', 'developed', 'created', 'designed', 'architected', 'engineered',
  'implemented', 'deployed', 'shipped', 'delivered', 'coded', 'programmed',
  // Improvement
  'improved', 'optimized', 'streamlined', 'enhanced', 'upgraded', 'modernized',
  'refactored', 'automated', 'accelerated', 'reduced', 'decreased', 'cut',
  // Growth
  'increased', 'grew', 'expanded', 'scaled', 'generated', 'boosted', 'drove',
  'achieved', 'exceeded', 'surpassed', 'doubled', 'tripled',
  // Collaboration
  'collaborated', 'partnered', 'coordinated', 'liaised', 'negotiated', 'advised',
  'mentored', 'coached', 'trained', 'onboarded',
  // Analysis
  'analyzed', 'researched', 'evaluated', 'assessed', 'identified', 'diagnosed',
  'investigated', 'audited', 'monitored', 'tracked',
  // Communication
  'presented', 'communicated', 'wrote', 'authored', 'documented', 'published',
  // Other strong verbs
  'transformed', 'resolved', 'migrated', 'integrated', 'maintained',
  'supported', 'tested', 'validated', 'reviewed', 'owned',
])

// Patterns that indicate quantified achievements
const QUANTITY_PATTERNS = [
  /\d+\s*%/,                                   // 30%
  /\$\s*\d+/,                                  // $500k
  /\d+\s*[kmb]\b/i,                            // 10k, 2M, 1B
  /\d+\s*(users?|customers?|clients?|members?|employees?|people|engineers?)/i,
  /\d+\s*(projects?|products?|services?|features?|apps?|applications?)/i,
  /\d+\s*(times?|x\b)/i,                       // 3x, 5 times
  /reduced\s+by\s+\d+/i,
  /increased\s+by\s+\d+/i,
  /saved\s+\$?\d+/i,
  /\d+\s*(hours?|days?|weeks?|months?)/i,
  /\d+\s*(million|billion|thousand)/i,
]

// ── Scoring engine ─────────────────────────────────────────────────────────

export function calculateATSScore(data: ResumeData): ATSResult {
  const categories: ScoreCategory[] = [
    scoreContact(data),
    scoreExperience(data),
    scoreEducation(data),
    scoreSkills(data),
    scoreSummary(data),
  ]

  const total = Math.min(100, categories.reduce((s, c) => s + c.score, 0))

  const grade: ATSResult['grade'] =
    total >= 85 ? 'excellent' :
    total >= 70 ? 'good' :
    total >= 50 ? 'fair' :
    'poor'

  const suggestions = buildSuggestions(categories)

  return { total, grade, categories, suggestions }
}

// ── Category scorers ───────────────────────────────────────────────────────

/** Contact & Identity — 20 pts */
function scoreContact(data: ResumeData): ScoreCategory {
  const p = data.personalInfo
  let score = 0
  const details: string[] = []
  const missing: string[] = []

  const check = (val: string | undefined, pts: number, good: string, bad: string) => {
    if (val?.trim()) { score += pts; details.push(good) }
    else missing.push(bad)
  }

  check(p.fullName,   4, 'Full name present',    'Add your full name')
  check(p.email,      4, 'Email address present', 'Add your email address')
  check(p.phone,      3, 'Phone number present',  'Add a phone number — many ATS require it')
  check(p.location,   3, 'Location present',      'Add city/state — ATS filters by location')
  check(p.jobTitle,   3, 'Job title specified',   'Add a job title / headline')

  const hasLinks = p.linkedin?.trim() || p.github?.trim() || p.website?.trim()
  if (hasLinks) { score += 3; details.push('Professional links included') }
  else missing.push('Add LinkedIn or GitHub — increases profile credibility')

  return { id: 'contact', label: 'Contact & Profile', score, max: 20, details, missing }
}

/** Work Experience — 30 pts */
function scoreExperience(data: ResumeData): ScoreCategory {
  const exp = data.experience
  let score = 0
  const details: string[] = []
  const missing: string[] = []

  if (exp.length === 0) {
    missing.push('Add at least one work experience entry')
    missing.push('Include 3–5 bullet points per role')
    missing.push('Use action verbs to start bullet points')
    missing.push('Add quantified achievements (numbers, percentages)')
    return { id: 'experience', label: 'Work Experience', score, max: 30, details, missing }
  }

  // Has entries
  score += 5
  details.push(`${exp.length} experience entr${exp.length === 1 ? 'y' : 'ies'} found`)

  // All entries have company + position + dates
  const hasMetadata = exp.every(e => e.company && e.position && e.startDate)
  if (hasMetadata) { score += 4; details.push('All roles have company, title and dates') }
  else missing.push('Fill in company name, job title and dates for all roles')

  // Bullet count (target: 3+ per entry)
  const totalBullets = exp.reduce((n, e) => n + e.bullets.filter(b => b.trim().length > 10).length, 0)
  const avgBullets = totalBullets / exp.length
  if (avgBullets >= 3) { score += 8; details.push('Strong bullet coverage (3+ per role)') }
  else if (avgBullets >= 2) { score += 4; details.push('Decent bullet coverage') }
  else { missing.push('Add at least 3 bullet points per role (aim for 3–5)') }

  // Action verbs
  const allBulletsText = exp.flatMap(e => e.bullets).join(' ').toLowerCase()
  const bulletWords = allBulletsText.split(/\W+/)
  const verbsUsed = bulletWords.filter(w => ACTION_VERBS.has(w))
  const uniqueVerbs = new Set(verbsUsed).size

  if (uniqueVerbs >= 5) { score += 7; details.push(`Strong action verbs (${uniqueVerbs} unique verbs)`) }
  else if (uniqueVerbs >= 2) { score += 3; details.push(`${uniqueVerbs} action verbs found — could use more`) }
  else { missing.push('Start bullet points with strong action verbs (Led, Built, Improved…)') }

  // Quantified achievements
  const bulletsWithNumbers = exp
    .flatMap(e => e.bullets)
    .filter(b => QUANTITY_PATTERNS.some(p => p.test(b)))
  if (bulletsWithNumbers.length >= 3) {
    score += 6; details.push(`${bulletsWithNumbers.length} quantified achievements (numbers/%)`)
  } else if (bulletsWithNumbers.length >= 1) {
    score += 3; details.push(`${bulletsWithNumbers.length} quantified achievement — add more`)
    missing.push('Add more quantified achievements (e.g. "Increased sales by 35%")')
  } else {
    missing.push('Add numbers and percentages to achievements (recruiters love metrics)')
  }

  return { id: 'experience', label: 'Work Experience', score: Math.min(score, 30), max: 30, details, missing }
}

/** Education — 15 pts */
function scoreEducation(data: ResumeData): ScoreCategory {
  const edu = data.education
  let score = 0
  const details: string[] = []
  const missing: string[] = []

  if (edu.length === 0) {
    missing.push('Add your educational background')
    missing.push('Include institution, degree, field of study and graduation year')
    return { id: 'education', label: 'Education', score, max: 15, details, missing }
  }

  score += 5; details.push(`${edu.length} education entr${edu.length === 1 ? 'y' : 'ies'}`)

  const first = edu[0]
  if (first.institution) { score += 3; details.push('Institution name present') }
  else missing.push('Add the institution name')

  if (first.degree) { score += 3; details.push('Degree type specified') }
  else missing.push('Specify your degree type (B.S., M.S., etc.)')

  if (first.field) { score += 2; details.push('Field of study listed') }
  else missing.push('Add your field of study / major')

  const hasDate = first.startDate || first.endDate
  if (hasDate) { score += 2; details.push('Graduation dates present') }
  else missing.push('Add graduation year — ATS often filters by graduation date')

  return { id: 'education', label: 'Education', score, max: 15, details, missing }
}

/** Skills — 20 pts */
function scoreSkills(data: ResumeData): ScoreCategory {
  const skillGroups = data.skills
  let score = 0
  const details: string[] = []
  const missing: string[] = []

  const totalSkills = skillGroups.reduce((n, g) => n + g.skills.filter(s => s.trim()).length, 0)

  if (totalSkills === 0) {
    missing.push('Add a Skills section — ATS heavily keyword-matches against it')
    missing.push('Include both technical and soft skills')
    missing.push('Organize skills into categories (Languages, Frameworks, Tools)')
    return { id: 'skills', label: 'Skills', score, max: 20, details, missing }
  }

  // Raw skill count
  if (totalSkills >= 15) { score += 8; details.push(`${totalSkills} skills listed`) }
  else if (totalSkills >= 8) { score += 5; details.push(`${totalSkills} skills listed — add more for better keyword coverage`) }
  else if (totalSkills >= 4) { score += 3; details.push(`${totalSkills} skills — ATS needs more to match`) }
  else { score += 1; missing.push('Add more skills — target 10–20 for good ATS coverage') }

  if (totalSkills < 10) missing.push(`You have ${totalSkills} skills — aim for 12+ to maximize keyword matches`)

  // Has categories
  const hasCats = skillGroups.some(g => g.category?.trim())
  if (hasCats) { score += 6; details.push('Skills organized into categories') }
  else missing.push('Group skills into categories (e.g. Languages, Frameworks, Tools)')

  // Multiple groups
  const filledGroups = skillGroups.filter(g => g.skills.some(s => s.trim()))
  if (filledGroups.length >= 3) { score += 6; details.push(`${filledGroups.length} skill groups`) }
  else if (filledGroups.length >= 2) { score += 3 }
  else { missing.push('Create separate skill groups for different competency areas') }

  return { id: 'skills', label: 'Skills', score: Math.min(score, 20), max: 20, details, missing }
}

/** Summary / Profile — 15 pts */
function scoreSummary(data: ResumeData): ScoreCategory {
  const summary = data.summary?.trim() ?? ''
  const jobTitle = data.personalInfo.jobTitle?.trim() ?? ''
  let score = 0
  const details: string[] = []
  const missing: string[] = []

  if (!summary) {
    missing.push('Add a professional summary — it\'s the first thing ATS parses')
    missing.push('Aim for 40–80 words packed with relevant keywords')
    missing.push('Mirror keywords from your target job description')
    return { id: 'summary', label: 'Summary / Profile', score, max: 15, details, missing }
  }

  score += 5; details.push('Professional summary present')

  const wordCount = summary.split(/\s+/).filter(Boolean).length
  if (wordCount >= 50) { score += 5; details.push(`Good length (${wordCount} words)`) }
  else if (wordCount >= 30) { score += 3; details.push(`${wordCount} words — could be a bit longer`) }
  else { missing.push(`Summary is only ${wordCount} words — expand to 40–80 words with keywords`) }

  // Does summary mention job title or related terms?
  if (jobTitle) {
    const titleWords = jobTitle.toLowerCase().split(/\W+/).filter(w => w.length > 3)
    const hasTitle = titleWords.some(w => summary.toLowerCase().includes(w))
    if (hasTitle) { score += 5; details.push('Summary aligns with your job title') }
    else missing.push(`Mention "${jobTitle}" or related terms in your summary for better keyword alignment`)
  } else {
    missing.push('Add a job title/headline — ATS ranks candidates by target role')
  }

  return { id: 'summary', label: 'Summary / Profile', score, max: 15, details, missing }
}

// ── Suggestion builder ─────────────────────────────────────────────────────

function buildSuggestions(categories: ScoreCategory[]): Suggestion[] {
  const suggestions: Suggestion[] = []

  for (const cat of categories) {
    const sectionMap: Record<string, string> = {
      contact: 'personal',
      experience: 'experience',
      education: 'education',
      skills: 'skills',
      summary: 'summary',
    }
    const section = sectionMap[cat.id] ?? cat.id

    for (const miss of cat.missing.slice(0, 2)) {
      // Priority = high if category is less than 50%, medium if < 75%
      const pct = cat.score / cat.max
      const priority: Suggestion['priority'] = pct < 0.5 ? 'high' : pct < 0.75 ? 'medium' : 'low'
      suggestions.push({ priority, text: miss, section })
    }
  }

  // Sort: high → medium → low
  const order = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => order[a.priority] - order[b.priority])

  return suggestions.slice(0, 6)
}
