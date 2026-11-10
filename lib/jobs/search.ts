import { linkedinGuestEnabled, searchLinkedInGuest } from './linkedin-guest'

export type RecencyWindow = '24h' | '3d' | '7d'

export const RECENCY_WINDOWS: Record<RecencyWindow, { hours: number; label: string }> = {
  '24h': { hours: 24, label: 'Last 24 hours' },
  '3d': { hours: 72, label: 'Last 3 days' },
  '7d': { hours: 168, label: 'Last 7 days' }
}

export const DEFAULT_RECENCY: RecencyWindow = '24h'

const RECENCY_GRACE_MS = 90_000

export function parseRecency(value: string | null | undefined): RecencyWindow {
  return value === '24h' || value === '3d' || value === '7d' ? value : DEFAULT_RECENCY
}

export interface JobSearchCriteria {
  q: string
  location?: string
  remote?: boolean
  usOnly?: boolean
  recency?: RecencyWindow
  linkedinGuest?: boolean
}

export interface JobResult {
  key: string
  title: string
  company: string
  location: string
  remote: boolean
  salary?: string
  tags: string[]
  snippet?: string
  url: string
  source: string
  postedAt?: string
  restriction?: string
  _match?: string
  _dateScoped?: boolean
}

export interface JobProviderResult {
  id: string
  label: string
  ok: boolean
  count: number
  jobs: JobResult[]
  error?: string
}

const FETCH_TIMEOUT_MS = 9000

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8217;|&rsquo;/g, '’')
}

export function stripHtml(value: string, maxChars = 220): string {
  const text = value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text
}

function upstreamError(status: number, body: string): Error {
  const detail = stripHtml(body, 140).replace(/^\{|\}$/g, '')
  return new Error(detail ? `${status}: ${detail}` : `Upstream returned ${status}`)
}

async function fetchText(url: string, headers?: Record<string, string>): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ResumeAI/1.0 (job search aggregation)', ...headers },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store'
  })
  if (!res.ok) throw upstreamError(res.status, await res.text().catch(() => ''))
  return res.text()
}

async function fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return JSON.parse(await fetchText(url, headers)) as T
}

async function postJson<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store'
  })
  if (!res.ok) throw upstreamError(res.status, await res.text().catch(() => ''))
  return (await res.json()) as T
}

function normalizeKey(...parts: string[]): string {
  return parts
    .join('|')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function isoFromUnix(seconds: number | string | null | undefined): string | undefined {
  const n = Number(seconds)
  if (!Number.isFinite(n) || n <= 0) return undefined
  return new Date(n * 1000).toISOString()
}

function dateWithinHours(iso: string | undefined, hours: number): boolean {
  if (!iso) return false
  const then = new Date(iso).getTime()
  return Number.isFinite(then) && Date.now() - then <= hours * 3_600_000 + RECENCY_GRACE_MS
}

interface ArbeitnowJob {
  slug: string
  title: string
  company_name: string
  location: string
  remote: boolean | number
  url: string
  description: string
  tags?: string[]
  type?: string | null
  created_at?: number | null
  published_at?: number | string | null
}

async function searchArbeitnow(criteria: JobSearchCriteria): Promise<JobResult[]> {
  const params = new URLSearchParams({ search: criteria.q })
  const payload = await fetchJson<{ data: ArbeitnowJob[] }>(
    `https://www.arbeitnow.com/api/job-board-api?${params}`
  )
  return payload.data.map((job) => ({
    key: `arbeitnow:${job.slug}`,
    title: decodeEntities(job.title),
    company: decodeEntities(job.company_name),
    location: decodeEntities(job.location || ''),
    remote: Boolean(job.remote),
    tags: [
      ...(job.tags ?? []),
      ...(job.type && job.type !== 'other' ? [job.type] : [])
    ].slice(0, 5),
    snippet: stripHtml(job.description ?? '', 500),
    _match: stripHtml(job.description ?? '', 4000),
    url: job.url,
    source: 'Arbeitnow',
    postedAt: isoFromUnix(job.created_at ?? job.published_at)
  }))
}

interface RemotiveJob {
  id: number
  title: string
  company_name: string
  location: string | null
  url: string
  description: string
  publication_date: string
  job_type: string | null
  category: string | null
  salary: string | null
  tag_names?: string[]
  candidate_required_location?: string | null
}

async function searchRemotive(criteria: JobSearchCriteria): Promise<JobResult[]> {
  const params = new URLSearchParams({ search: criteria.q, limit: '100' })
  const payload = await fetchJson<{ jobs: RemotiveJob[] }>(
    `https://remotive.com/api/remote-jobs?${params}`
  )
  return payload.jobs.map((job) => ({
    key: `remotive:${job.id}`,
    title: decodeEntities(job.title),
    company: decodeEntities(job.company_name),
    location: job.location ?? 'Remote',
    remote: true,
    salary: job.salary ?? undefined,
    tags: [
      ...(job.tag_names ?? []),
      ...(job.job_type ? [job.job_type.replace(/_/g, ' ')] : []),
      ...(job.category ? [job.category] : [])
    ]
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .slice(0, 5),
    snippet: stripHtml(job.description ?? '', 500),
    _match: stripHtml(job.description ?? '', 4000),
    url: job.url,
    source: 'Remotive',
    postedAt: job.publication_date,
    restriction: job.candidate_required_location ?? undefined
  }))
}

function cdataField(item: string, tag: string): string | null {
  const match = item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))
  return match ? decodeEntities(match[1].trim()) : null
}

async function searchWeWorkRemotely(_criteria: JobSearchCriteria): Promise<JobResult[]> {
  const xml = await fetchText('https://weworkremotely.com/remote-jobs.rss')
  const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1])
  const jobs: JobResult[] = itemBlocks.map((item, index) => {
    const rawTitle = cdataField(item, 'title') ?? ''
    const titleMatch = rawTitle.match(/^(.{2,60}?):\s*(.+)$/)
    const tags = [...item.matchAll(/<tag>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/tag>/g)]
      .map((m) => decodeEntities(m[1]).replace(/_/g, ' '))
      .slice(0, 5)
    let pubDate: string | null = cdataField(item, 'pubDate')
    if (pubDate && Number.isNaN(Date.parse(pubDate))) pubDate = null
    return {
      key: `wwr:${index}:${normalizeKey(rawTitle, cdataField(item, 'link') ?? '')}`,
      title: titleMatch ? decodeEntities(titleMatch[2]) : rawTitle,
      company: titleMatch ? decodeEntities(titleMatch[1]) : '',
      location: cdataField(item, 'region') ?? 'Remote',
      remote: true,
      tags,
      snippet: stripHtml(cdataField(item, 'description') ?? '', 500),
      _match: stripHtml(cdataField(item, 'description') ?? '', 4000),
      url: cdataField(item, 'link') ?? 'https://weworkremotely.com',
      source: 'We Work Remotely',
      postedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
      restriction: cdataField(item, 'region') ?? undefined
    }
  })
  return jobs
}

interface JSearchJob {
  job_id: string
  job_title: string
  company_name?: string
  employer_name?: string
  location?: string
  is_remote?: boolean | number
  snippet?: string
  description?: string
  job_apply_link?: string
  apply_link?: string
  link?: string
  primary_date?: number
  date?: number | string
  job_publisher?: string
  employer_publisher?: string
  salary?: string
  job_function?: string
  job_employment_type?: string
}

async function searchJSearch(criteria: JobSearchCriteria): Promise<JobResult[]> {
  const params = new URLSearchParams({ query: `${criteria.q} United States`, page: '1', num: '20' })
  if (criteria.usOnly) params.set('country_to', 'us')
  const payload = await fetchJson<{ data: JSearchJob[] }>(
    `https://jsearch.p.rapidapi.com/search?${params}`,
    { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'jsearch.p.rapidapi.com' }
  )
  return payload.data.map((job) => {
    const publisher = (job.job_publisher ?? job.employer_publisher ?? 'Google for Jobs')
      .replace(/\s*via\s+Google for Jobs$/i, '')
      .trim()
    return {
      key: `jsearch:${job.job_id}`,
      title: decodeEntities(job.job_title),
      company: decodeEntities(job.employer_name ?? job.company_name ?? ''),
      location: decodeEntities(job.location ?? ''),
      remote: Boolean(job.is_remote),
      salary: job.salary ?? undefined,
      tags: [job.job_function, job.job_employment_type]
        .filter((t): t is string => Boolean(t))
        .map((t) => t.charAt(0) + t.slice(1).toLowerCase()),
      snippet: stripHtml(job.snippet ?? job.description ?? '', 500),
      _match: stripHtml(job.description ?? job.snippet ?? '', 4000),
      url: job.job_apply_link ?? job.apply_link ?? job.link ?? '',
      source: publisher.slice(0, 24),
      postedAt: isoFromUnix(job.primary_date ?? job.date)
    }
  })
}

interface SerperOrganic {
  title?: string
  link?: string
  snippet?: string
  date?: string
  position?: number
}

const SERPER_PAGES = 3

function serperToIso(date: string | undefined): string | undefined {
  if (!date) return undefined
  const now = Date.now()
  const match = date.match(/(\d+)\s+(minute|hour|day|week|month)s?\s+ago/i)
  if (match) {
    const unit = { minute: 60_000, hour: 3_600_000, day: 86_400_000, week: 604_800_000, month: 2_592_000_000 } as const
    const ms = unit[match[2].toLowerCase() as keyof typeof unit] ?? 0
    return new Date(now - Number(match[1]) * ms).toISOString()
  }
  const parsed = Date.parse(date)
  return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString()
}

function serperDateScope(window: RecencyWindow): string {
  if (window === '24h') return 'qdr:d'
  if (window === '7d') return 'qdr:w'
  const usDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  const from = new Date(Date.now() - 2 * 86_400_000)
  return `cdr:1,cd_min:${usDate(from)},cd_max:${usDate(new Date())}`
}

function serperQuery(criteria: JobSearchCriteria): string {
  const parts = [criteria.q.trim()]
  const location = criteria.location?.trim().replace(/,/g, '')
  if (location) parts.push(expandStateAbbreviations(location))
  if (criteria.remote) parts.push('remote')

  parts.push('job', 'hiring')
  if (!location || !NON_US_PATTERNS.some(([pattern]) => pattern.test(location.toLowerCase()))) {
    parts.push('United States')
  }

  return parts.filter(Boolean).join(' ')
}

const BOARD_HOST_LABELS: Array<[string, string]> = [
  ['indeed', 'Indeed'],
  ['linkedin', 'LinkedIn'],
  ['glassdoor', 'Glassdoor'],
  ['dice', 'Dice'],
  ['ziprecruiter', 'ZipRecruiter'],
  ['monster', 'Monster'],
  ['careerbuilder', 'CareerBuilder'],
  ['wellfound', 'Wellfound'],
  ['authenticjobs', 'Wellfound'],
  ['builtin', 'Built In'],
  ['builtinnyc', 'Built In NYC'],
  ['remoteok', 'RemoteOK'],
  ['weworkremotely', 'We Work Remotely'],
  ['jobicy', 'Jobicy'],
  ['himalayas', 'Himalayas'],
  ['dynamitejobs', 'Dynamite Jobs'],
  ['remoterocketship', 'Remote Rocketship'],
  ['haystackapp', 'Haystack'],
  ['jobstreet', 'JobStreet'],
  ['naukri', 'Naukri'],
  ['instahyre', 'InstaHyre'],
  ['cutshort', 'Cutshort'],
  ['foundit', 'Foundit'],
  ['monsterindia', 'Foundit'],
  ['flexjobs', 'FlexJobs'],
  ['workingnomads', 'Working Nomads'],
  ['jobgether', 'Jobgether'],
  ['productmarketingalliance', 'Product Marketing Alliance'],
  ['offstagejobs', 'Offstage Jobs'],
  ['adweek', 'Adweek'],
  ['mediabistro', 'MediaBistro'],
  ['dropboxjobs', 'Dropbox Jobs'],
  ['clearancejobs', 'ClearanceJobs'],
  ['careersingovernment', 'Careers in Government'],
  ['rubyonremote', 'Ruby on Remote'],
  ['dailyremote', 'DailyRemote'],
  ['japan-dev.com', 'Japan Dev'],
  ['arc.dev', 'Arc'],
  ['cryptojobslist.com', 'CryptoJobsList'],
  ['jaabz', 'Jaabz'],
  ['wearedevelopers.com', 'We Are Developers'],
  ['greenhouse', 'Greenhouse'],
  ['lever', 'Lever'],
  ['ashbyhq', 'Ashby'],
  ['myworkdayjobs', 'Workday'],
  ['smartrecruiters', 'SmartRecruiters'],
  ['recruitee', 'Recruitee'],
  ['workable', 'Workable'],
  ['breezy', 'Breezy'],
  ['icims', 'iCIMS'],
  ['avature', 'AVATURE'],
  ['taleo', 'Taleo'],
  ['adp', 'ADP'],
  ['oraclecloud', 'Oracle Cloud'],
  ['jobvite', 'Jobvite'],
  ['jazzhr', 'JazzHR'],
  ['bamboohr', 'BambooHR'],
  ['teamtailor', 'Teamtailor']
]

const ATS_HOST_SUFFIXES = [
  'greenhouse.io',
  'lever.co',
  'ashbyhq.com',
  'myworkdayjobs.com',
  'smartrecruiters.com',
  'recruitee.com',
  'workable.com',
  'breezy.hr',
  'icims.com',
  'avature.net',
  'taleo.net',
  'adp.com',
  'oraclecloud.com',
  'jobvite.com',
  'jazzhr.com',
  'bamboohr.com',
  'teamtailor.com'
]

function stripWww(host: string): string {
  return host.replace(/^www\./, '')
}

function hostMatchesBase(host: string, base: string): boolean {
  const normalized = stripWww(host)
  return normalized === base || normalized.startsWith(`${base}.`) || normalized.includes(`.${base}.`) || normalized.endsWith(`.${base}`)
}

function boardLabelForHost(host: string): string {
  for (const [base, label] of BOARD_HOST_LABELS) {
    if (hostMatchesBase(host, base)) return label
  }
  const builtinCity = stripWww(host).match(/^builtin([a-z]+)\./i)?.[1]
  if (builtinCity) return `Built In ${titleCaseSlug(builtinCity)}`
  return ''
}

function isAtsHost(host: string): boolean {
  return ATS_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))
}

function isBoardHost(host: string): boolean {
  return boardLabelForHost(host) !== '' || isAtsHost(host)
}

const POSTING_URL = [
  /linkedin\.com\/jobs\/view\//i,
  /\/viewjob\?jk=/i,
  /\/jobs?\/(?:results?|details?|detail|view|posting|p|j)\/[a-z0-9]/i,
  /\/jobs?\/\d{3,}/i,
  /\/job\/[a-z0-9#%+_.-]/i,
  /\/job-detail\//i,
  /\/job_details?\//i,
  /\/remote-job\/[a-z0-9#%+_.-]/i,
  /\/job-offer\/[a-z0-9#%+_.-]/i,
  /\/job-openings?\/[a-z0-9#%+_.-]/i,
  /\/vacanc(?:y|ies)\/[a-z0-9#%+_.-]/i,
  /\/positions?\/[a-z0-9]/i,
  /\/opportunit(?:y|ies)\/[a-z0-9]/i,
  /\/opening[s]?\/[a-z0-9]/i,
  /greenhouse\.io\/[a-z0-9-]+\/jobs?\/\d+/i,
  /lever\.co\/[a-z0-9-]+\/jobs?\/[a-f0-9-]{16,}/i,
  /jobs\.ashbyhq\.com\/[a-z0-9-]+\/[a-f0-9-]{16,}/i,
  /apply\.workable\.com\/[a-z0-9-]+\/j\/[a-z0-9]+/i,
  /myworkdayjobs\.com\/[^/]+\/job\/[^/?]+/i,
  /smartrecruiters\.com\/[a-z]+\/[a-f0-9-]{16,}/i,
  /recruitee\.com\/jobs\/\d+/i,
  /breezy\.hr\/position\/[a-z0-9-]+/i,
  /remoteok\.com\/j\/\w+/i,
  /weworkremotely\.com\/remote-jobs\/\d+/i,
  /jobicy\.com\/job\//i,
  /ziprecruiter\.com\/[a-z]\/[^/]+\/Job-/i,
  /builtin\.com\/job\//i,
  /haystackapp\.io\/jobs\/[a-z0-9-]+/i,
  /(?:job_id|jobId|jobid)=\w{6,}/i
]

const LISTING_URL = [
  /\/q-|\/l-|\/d-|\/f-/i,
  /\/search\b|\?q=|\?query=|\?search|\?keywords?=|\?location=/i,
  /\/jobs?\?|\/jobs?\/?\?|\/jobs?\/?$|-jobs?\/?$|\/jobs?$/i,
  /\/(?:remote-?)?jobs?\/(?:[a-z][a-z0-9_-]*)(?:\/(?:all|latest|new|remote|[a-z][a-z0-9_-]*))?\/?$/i,
  /\/(?:jobs?|careers?|openings?|positions?|vacancies)(?:\/(?:[a-z][a-z-]+|all|latest|new|remote))\/?$/i,
  /\/job-?(?:search|listing|board|list|categories?|alert|alerts|directory|index)\b/i,
  /jobs?\s+(?:board|boards|directory|portal|alert|alerts|listing|search|usa|worldwide|near|nearby|openings)\b/i,
  /\/(?:salaries|salary)\b|\bsalaries\b|\bsalary\b/i,
  /\/page\/\d+|\?page=\d+|offset=\d+|\/p\/\d+/i,
  /\/companies?\/[a-z0-9-]+\/?$/i,
  /\.php\?|\/wp-json\//i,
  /\/trending|-jobs-in-|\/jobs-in-/i
]

const NOISE_TITLE =
  /(?:^\s*\d[\d,]*\+?\s+|\bjobs?\s*\(|\b\d[\d,]*\+?\s*(?:open\s*)?(?:jobs|openings|positions|roles|vacancies)\b|\b(?:now hiring|we'?re hiring|near me|search jobs|job search|browse jobs|view all|see all|all jobs|open roles|vacancies|with salaries|salaries)\b|\bjobs?\b[^|]{0,24}\b(?:in|near|hiring|vacancies|openings|salaries|board|directory|portal|alerts?)\b|^\s*(?:search|browse|view|see|load)\b)/i

const REMOTE_MARKERS = /\b(?:remote|anywhere|work from home|wfh|fully remote|us-based|u\.s\.-based)\b/i

const NON_US_GEO = [
  'india', 'uk', 'united kingdom', 'england', 'london', 'germany', 'berlin', 'munich', 'canada', 'ontario', 'toronto',
  'vancouver', 'australia', 'sydney', 'melbourne', 'china', 'beijing', 'shanghai', 'ireland', 'dublin', 'france',
  'paris', 'poland', 'warsaw', 'spain', 'madrid', 'barcelona', 'portugal', 'lisbon', 'brazil', 'sao paulo',
  'mexico city', 'japan', 'tokyo', 'korea', 'seoul', 'singapore', 'nigeria', 'lagos', 'philippines', 'manila',
  'pakistan', 'vietnam', 'hanoi', 'ukraine', 'kyiv', 'netherlands', 'amsterdam', 'italy', 'milan', 'rome', 'sweden',
  'stockholm', 'israel', 'tel aviv', 'uae', 'dubai', 'south africa', 'johannesburg', 'capetown', 'argentina',
  'buenos aires', 'colombia', 'bogota', 'turkey', 'istanbul', 'romania', 'bucharest', 'belgium', 'brussels',
  'switzerland', 'zurich', 'denmark', 'copenhagen', 'norway', 'oslo', 'finland', 'helsinki', 'czech', 'prague',
  'hungary', 'budapest', 'austria', 'vienna', 'new zealand', 'auckland', 'malaysia', 'kuala lumpur', 'indonesia',
  'jakarta', 'thailand', 'bangkok', 'bangladesh', 'dhaka', 'egypt', 'cairo', 'kenya', 'nairobi', 'morocco', 'latam',
  'latin america', 'emea', 'apac', 'europe only', 'eu only', 'emea only', 'non-us',
  'hyderabad', 'mumbai', 'bangalore', 'bengaluru', 'gurgaon', 'noida', 'pune', 'chennai', 'leipzig', 'delft',
  'utrecht', 'rotterdam', 'eindhoven', 'ghent', 'antwerp', 'lyon', 'marseille', 'grenoble', 'bologna', 'turin',
  'naples', 'seville', 'valencia', 'krakow', 'poznan', 'gdansk', 'wroclaw', 'gothenburg', 'malmo', 'aarhus',
  'bergen', 'tampere', 'turku', 'brno', 'bratislava', 'zagreb', 'belgrade', 'sofia', 'cluj', 'timbisoara',
  'vilnius', 'riga', 'tallinn'
]

const NON_US_PATTERNS = NON_US_GEO.map(
  (token) => [new RegExp(`(?<![a-z0-9])${escapeRegExp(token)}(?![a-z0-9])`), token] as const
)

const US_CITY_STATE = /\b([A-Z][a-z]{2,}(?: [A-Z][a-z]{2,})?),\s*([A-Z]{2})\b/
const LABELED_LOCATION = /(?:location|located in|city)\s*:?\s+([A-Z][A-Za-z.]+(?:,?\s+[A-Z]{2})?)/i

function textLocation(text: string): string {
  const cityState = text.match(US_CITY_STATE)
  if (cityState) return `${cityState[1]}, ${cityState[2]}`
  const labeled = text.match(LABELED_LOCATION)
  if (labeled) return labeled[1].trim()
  if (textHasUsGeo(text)) return 'United States'
  const foreign = NON_US_PATTERNS.find(([pattern]) => pattern.test(text))
  if (foreign) return foreign[1].charAt(0).toUpperCase() + foreign[1].slice(1)
  return ''
}

function titleCaseSlug(slug: string | undefined): string {
  if (!slug) return ''
  return titleCaseWords(slug.replace(/[-_+]+/g, ' '))
}

function titleCaseWords(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => (word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')
}

function parseUrl(url: string): URL | null {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

const GENERIC_SUBDOMAIN = /^(?:www|careers|jobs?|work|join|apply|boards?|recruit(?:ing|ment)|my|hr|talent|staffing)$/i

function domainCompany(host: string): string {
  const labels = host.toLowerCase().split('.')
  while (labels.length > 2 && GENERIC_SUBDOMAIN.test(labels[labels.length - 3])) labels.shift()
  return titleCaseSlug(labels.length >= 2 ? labels[labels.length - 2] : labels[0])
}

const GENERIC_ATS_LABEL = /^(?:www|careers?|jobs?|work|join|apply|boards?|recruit(?:ing|ment)|my|hr|talent|staffing|wd\d+|tac\d*|en|us|api|office\d*)$/i
const GENERIC_PATH_SEGMENT =
  /^(?:jobs?|postings?|positions?|openings?|vacanc(?:y|ies)|opportunit(?:y|ies)|career|careers|apply|view|detail|details|index|api|en|en-us|en_us|us|o|\d+)$/i

function atsSuffixForHost(host: string): string {
  return ATS_HOST_SUFFIXES.find((suffix) => host === suffix || host.endsWith(`.${suffix}`)) ?? ''
}

function atsCompanyFromHost(host: string, segments: string[]): string {
  const suffix = atsSuffixForHost(host)
  if (!suffix) return ''

  const labels = host.slice(0, -(suffix.length + 1)).split('.').filter(Boolean)
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const label = labels[i].replace(/^(?:careers?-|job-|jobs?-)/i, '')
    if (label && !GENERIC_ATS_LABEL.test(label)) return titleCaseSlug(label)
  }

  for (const segment of segments) {
    const clean = segment.replace(/^(?:careers?-|job-|jobs?-)/i, '')
    if (/^\d/.test(clean)) break
    if (clean && !GENERIC_ATS_LABEL.test(clean) && !GENERIC_PATH_SEGMENT.test(clean)) return titleCaseSlug(clean)
  }

  return ''
}

function sourceFromUrl(url: string): string {
  const host = parseUrl(url)?.hostname.toLowerCase() ?? ''
  if (!host) return 'Google'
  return boardLabelForHost(host) || domainCompany(host)
}

const TITLE_AT_COMPANY = /\bat\s+([A-Z][\w&.'+-]*(?:\s+[A-Z][\w&.'+-]*)?)\b/
const TITLE_COMPANY_SUFFIX = /\s[-–—|·]\s*([A-Z][\w&.'+-]*(?:\s+[A-Z][\w&.'+-]*)?)\s*$/
const COMPANY_SUFFIX_NOISE =
  /(?:^|\s)(?:united|states|remote|us|usa|job|jobs|career|careers|hiring|salary|salaries|framework|frameworks|team|department|division)(?:\s|$)/i

function isUsableCompanyName(name: string): boolean {
  const clean = name.trim()
  return clean.length > 1 && clean.length < 48 && !COMPANY_SUFFIX_NOISE.test(clean)
}

function companyFromListing(url: string, title: string): string {
  const urlObject = parseUrl(url)
  if (!urlObject) return ''
  const host = urlObject.hostname.toLowerCase()
  const segments = urlObject.pathname.split('/').filter(Boolean).map((segment) => decodeURIComponent(segment))

  const atsCompany = atsCompanyFromHost(host, segments)
  if (atsCompany) return atsCompany

  if (isBoardHost(host)) {
    if (/work at a startup/i.test(title)) return ''
    const atCompany = title.match(TITLE_AT_COMPANY)?.[1]?.trim()
    if (atCompany && isUsableCompanyName(atCompany)) return atCompany
    const pathAtCompany = urlObject.pathname.match(/(?:^|[-/])at-([a-z0-9][a-z0-9-]{2,})(?:[-/]|$)/i)?.[1]
    if (pathAtCompany) return titleCaseSlug(pathAtCompany)
    const suffixCompany = title.match(TITLE_COMPANY_SUFFIX)?.[1]?.trim() ?? ''
    return isUsableCompanyName(suffixCompany) ? suffixCompany : ''
  }

  const titleSuffixCompany = title.match(TITLE_COMPANY_SUFFIX)?.[1]?.trim()
  const domain = domainCompany(host)
  if (titleSuffixCompany && isUsableCompanyName(titleSuffixCompany) && titleSuffixCompany.toLowerCase() !== domain.toLowerCase()) {
    return titleSuffixCompany
  }
  return domain
}

function cleanTitle(title: string, source: string): string {
  const cleaned = title
    .replace(
      new RegExp(`\\s*[-–—|·]\\s*(?:${escapeRegExp(source)}|apply now|apply|job posting|careers?)\\s*$`, 'i'),
      ''
    )
    .trim()
  return cleaned.length > 2 ? cleaned : title
}

const SALARY_RANGE = /\$\s?(\d{2,3})\s?[kK]?\s*(?:-|–|to)\s*\$?\s?(\d{2,3})\s?[kK]/
const SALARY_SINGLE = /\$\s?(\d{2,3})\s?[kK]\b/

function extractSalary(text: string): string | undefined {
  const range = text.match(SALARY_RANGE)
  if (range) return `$${range[1]}k - $${range[2]}k`
  const single = text.match(SALARY_SINGLE)
  return single ? `$${single[1]}k` : undefined
}

const TAG_MARKERS: Array<[RegExp, string]> = [
  [/\bfull[- ]?time\b/i, 'Full-time'],
  [/\bpart[- ]?time\b/i, 'Part-time'],
  [/\bcontract(?:ual|or)?\b/i, 'Contract'],
  [/\bintern(?:ship)?\b/i, 'Internship'],
  [/\bprincipal\b/i, 'Principal'],
  [/\bsenior\b/i, 'Senior'],
  [/\blead\b/i, 'Lead'],
  [/\b(?:junior|entry[- ]level)\b/i, 'Entry level']
]

function jobTags(text: string): string[] {
  const tags: string[] = []
  if (REMOTE_MARKERS.test(text)) tags.push('Remote')
  for (const [pattern, label] of TAG_MARKERS) {
    if (tags.length >= 4) break
    if (pattern.test(text)) tags.push(label)
  }
  return tags
}

function isPostingUrl(url: string): boolean {
  if (LISTING_URL.some((pattern) => pattern.test(url))) return false
  if (POSTING_URL.some((pattern) => pattern.test(url))) return true

  const parsed = parseUrl(url)
  if (!parsed) return false

  const host = parsed.hostname.toLowerCase()
  const path = parsed.pathname.replace(/^\/+|\/+$/g, '')
  if (!path) return false

  if (isBoardHost(host)) return false

  const segments = path.split('/').filter(Boolean)
  const looksJobLike =
    /(?:job|jobs?|position|opening|posting|vacanc|career|apply|opportunit|detail)/i.test(path)
  const idLike = /(?:\d{5,}|[a-f0-9]{16,}|[?&](?:job|position|posting|req)[a-z]*id?=)/i.test(url)

  return segments.length >= 3 || looksJobLike || idLike
}

function serperToJob(item: SerperOrganic, criteria: JobSearchCriteria): JobResult | null {
  const url = (item.link ?? '').trim()
  const rawTitle = decodeEntities(item.title ?? '').trim()
  if (!url || !rawTitle || !isPostingUrl(url) || NOISE_TITLE.test(rawTitle)) return null

  const snippet = stripHtml(item.snippet ?? '', 500)
  const pathText = decodeURIComponent(parseUrl(url)?.pathname.replace(/[/_-]+/g, ' ') ?? '')
  const text = `${rawTitle} ${snippet} ${pathText}`
  if (criteria.remote && !REMOTE_MARKERS.test(text)) return null

  const source = sourceFromUrl(url)
  return {
    key: `serper:${normalizeKey(rawTitle, url)}`,
    title: cleanTitle(rawTitle, source),
    company: companyFromListing(url, rawTitle),
    location: textLocation(text),
    remote: REMOTE_MARKERS.test(text),
    salary: extractSalary(text),
    tags: jobTags(text),
    snippet,
    _match: `${rawTitle} ${item.snippet ?? ''}`.slice(0, 4000),
    url,
    source,
    postedAt: serperToIso(item.date),
    _dateScoped: true
  }
}

async function searchSerper(criteria: JobSearchCriteria): Promise<JobResult[]> {
  const responses = await Promise.all(
    Array.from({ length: SERPER_PAGES }, (_, index) =>
      postJson<{ organic?: SerperOrganic[] }>(
        'https://google.serper.dev/search',
        {
          q: serperQuery(criteria),
          gl: 'us',
          hl: 'en',
          num: 20,
          page: index + 1,
          tbs: serperDateScope(criteria.recency ?? DEFAULT_RECENCY)
        },
        { 'X-API-KEY': SERPER_API_KEY }
      )
    )
  )

  const seen = new Set<string>()
  const jobs: JobResult[] = []
  for (const payload of responses) {
    for (const item of payload.organic ?? []) {
      const url = (item.link ?? '').trim()
      if (!url || seen.has(url)) continue
      seen.add(url)
      const job = serperToJob(item, criteria)
      if (job) jobs.push(job)
    }
  }
  return jobs
}

interface RemoteOkJob {
  id: number
  position: string
  company: string
  location?: string
  url: string
  apply_url?: string
  date?: string
  tags?: string[]
  description?: string
  salary_min?: number
  salary_max?: number
}

async function searchRemoteOk(_criteria: JobSearchCriteria): Promise<JobResult[]> {
  const payload = await fetchJson<Array<RemoteOkJob | string>>('https://remoteok.com/api')
  return payload
    .filter((item): item is RemoteOkJob => typeof item === 'object' && item !== null && 'position' in item)
    .map((job) => {
      const salary =
        (job.salary_min ?? 0) >= 1000
          ? `$${Math.round((job.salary_min ?? 0) / 1000)}k${(job.salary_max ?? 0) >= 1000 ? ` - $${Math.round((job.salary_max ?? 0) / 1000)}k` : ''}`
          : undefined
      return {
        key: `remoteok:${job.id}`,
        title: decodeEntities(job.position),
        company: decodeEntities(job.company),
        location: decodeEntities(job.location?.trim() || 'Remote'),
        remote: true,
        salary,
        tags: (job.tags ?? []).slice(0, 5),
        snippet: stripHtml(job.description ?? '', 500),
        _match: stripHtml(job.description ?? '', 4000),
        url: job.apply_url || job.url,
        source: 'RemoteOK',
        postedAt: job.date
      }
    })
}

interface JobicyJob {
  id: number
  jobTitle: string
  companyName: string
  jobGeo?: string
  url: string
  jobDescription?: string
  jobIndustry?: string | string[]
  jobPostedDate?: number | string | null
  jobSalaryMin?: number | null
  jobSalaryMax?: number | null
  jobPrimaryTag?: string
}

function parseJobicyTags(raw: string | string[] | undefined): string[] {
  if (!raw) return []
  const list = Array.isArray(raw)
    ? raw
    : raw
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
  return list.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 5)
}

async function searchJobicy(_criteria: JobSearchCriteria): Promise<JobResult[]> {
  const payload = await fetchJson<{ jobs?: JobicyJob[] }>('https://jobicy.com/api/v2/remote-jobs?count=100')
  return (payload.jobs ?? []).map((job) => {
    const salary =
      (job.jobSalaryMin ?? 0) >= 1000
        ? `$${Math.round((job.jobSalaryMin ?? 0) / 1000)}k${(job.jobSalaryMax ?? 0) >= 1000 ? ` - $${Math.round((job.jobSalaryMax ?? 0) / 1000)}k` : ''}`
        : undefined
    const postedIso =
      typeof job.jobPostedDate === 'number'
        ? isoFromUnix(job.jobPostedDate)
        : typeof job.jobPostedDate === 'string' && !Number.isNaN(Date.parse(job.jobPostedDate))
          ? new Date(job.jobPostedDate).toISOString()
          : undefined
    return {
      key: `jobicy:${job.id}`,
      title: decodeEntities(job.jobTitle),
      company: decodeEntities(job.companyName),
      location: decodeEntities(job.jobGeo?.trim() || 'Remote'),
      remote: true,
      salary,
      tags: parseJobicyTags(job.jobIndustry),
      snippet: stripHtml(job.jobDescription ?? '', 500),
      _match: stripHtml(job.jobDescription ?? '', 4000),
      url: job.url,
      source: 'Jobicy',
      postedAt: postedIso
    }
  })
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? ''
const SERPER_API_KEY = process.env.SERPER_API_KEY ?? ''

export interface JobProvider {
  id: string
  label: string
  search: (criteria: JobSearchCriteria) => Promise<JobResult[]>
}

export interface JobSourceInfo {
  id: string
  label: string
  enabled: boolean
  keyName?: string
  note: string
}

export const JOB_PROVIDERS: JobProvider[] = [
  { id: 'arbeitnow', label: 'Arbeitnow', search: searchArbeitnow },
  { id: 'remotive', label: 'Remotive', search: searchRemotive },
  { id: 'wwr', label: 'We Work Remotely', search: searchWeWorkRemotely },
  { id: 'remoteok', label: 'RemoteOK', search: searchRemoteOk },
  { id: 'jobicy', label: 'Jobicy', search: searchJobicy }
]

if (RAPIDAPI_KEY) JOB_PROVIDERS.push({ id: 'jsearch', label: 'Google for Jobs', search: searchJSearch })
if (SERPER_API_KEY) {
  JOB_PROVIDERS.push({ id: 'serper', label: 'Indeed / LinkedIn / Glassdoor (Google)', search: searchSerper })
}
if (process.env.LINKEDIN_GUEST_ENABLED !== 'false') {
  JOB_PROVIDERS.push({
    id: 'linkedin-guest',
    label: 'LinkedIn (guest)',
    search: (criteria) => (linkedinGuestEnabled(criteria) ? searchLinkedInGuest(criteria) : Promise.resolve([]))
  })
}

export function getJobSources(): JobSourceInfo[] {
  return [
    { id: 'arbeitnow', label: 'Arbeitnow', enabled: true, note: 'free feed' },
    { id: 'remotive', label: 'Remotive', enabled: true, note: 'free feed' },
    { id: 'wwr', label: 'We Work Remotely', enabled: true, note: 'free feed' },
    { id: 'remoteok', label: 'RemoteOK', enabled: true, note: 'free feed' },
    { id: 'jobicy', label: 'Jobicy', enabled: true, note: 'free feed' },
    RAPIDAPI_KEY
      ? { id: 'jsearch', label: 'LinkedIn / Indeed / Glassdoor (JSearch)', enabled: true, note: 'active' }
      : {
          id: 'jsearch',
          label: 'LinkedIn / Indeed / Glassdoor (JSearch)',
          enabled: false,
          keyName: 'RAPIDAPI_KEY',
          note: 'free RapidAPI tier — rapidapi.com'
        },
    SERPER_API_KEY
      ? { id: 'serper', label: 'Indeed / LinkedIn / Glassdoor (Google)', enabled: true, note: 'active' }
      : {
          id: 'serper',
          label: 'Indeed / LinkedIn / Glassdoor (Google)',
          enabled: false,
          keyName: 'SERPER_API_KEY',
          note: 'serper.dev — free signup, generous credits'
        },
    process.env.LINKEDIN_GUEST_ENABLED !== 'false'
      ? { id: 'linkedin-guest', label: 'LinkedIn (guest)', enabled: true, note: 'public guest pages via Playwright' }
      : { id: 'linkedin-guest', label: 'LinkedIn (guest)', enabled: false, note: 'disabled' }
  ]
}

function publicJob(job: JobResult): JobResult {
  const clean: JobResult = { ...job }
  for (const key of Object.keys(clean) as Array<keyof JobResult>) {
    if (key.startsWith('_')) delete clean[key]
  }
  return clean
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((token) => token.length > 1 && !['and', 'the', 'with', 'for', 'job', 'jobs'].includes(token))
}

function relevanceScore(job: JobResult, tokens: string[]): number {
  const title = job.title.toLowerCase()
  const company = job.company.toLowerCase()
  const tags = job.tags.join(' ').toLowerCase()
  let score = 0
  for (const token of tokens) {
    if (title.includes(token)) score += 3
    if (tags.includes(token)) score += 2
    if (company.includes(token)) score += 2
  }
  return score
}

interface StateRequirement {
  abbrev: string
  name: string
}

type LocationRequirement =
  | { kind: 'state'; state: StateRequirement }
  | { kind: 'phrase'; phrase: string }

const US_STATES: Record<string, string> = {
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

const US_STATE_NAME_ENTRIES: Array<[string, string]> = Object.entries(US_STATES)
  .map(([abbrev, name]) => [name.toLowerCase(), abbrev] as [string, string])
  .sort((a, b) => b[0].length - a[0].length)

const LOCATION_MODIFIERS = new Set([
  'remote',
  'hybrid',
  'onsite',
  'work',
  'from',
  'home',
  'north',
  'northern',
  'south',
  'southern',
  'east',
  'eastern',
  'west',
  'western',
  'northeast',
  'northwest',
  'southeast',
  'southwest',
  'greater',
  'metro',
  'area',
  'region',
  'central',
  'downtown',
  'nearby',
  'around',
  'us',
  'usa',
  'united',
  'states',
  'city',
  'in',
  'of',
  'the',
  'and'
])

function normalizeLocationText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\bd\.?\s?c\.?\b/g, 'dc')
    .replace(/[^a-z0-9\s,#&.+-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function locationHaystack(job: JobResult): string {
  return normalizeLocationText(`${job.location} ${job.restriction ?? ''} ${job.title}`)
}

function findStateRequirement(text: string): StateRequirement | null {
  const normalized = normalizeLocationText(text)
  for (const [name, abbrev] of US_STATE_NAME_ENTRIES) {
    const regex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(name)}(?:$|[\\s,;])`)
    if (regex.test(normalized)) return { abbrev, name }
  }

  for (const token of tokenize(normalized)) {
    const name = US_STATES[token]
    if (name) return { abbrev: token, name: name.toLowerCase() }
  }

  return null
}

function locationRequirementGroups(location: string): LocationRequirement[] {
  const parts = location.split(/[,;]+/).map(normalizeLocationText).filter(Boolean)
  const groups: LocationRequirement[] = []

  for (const part of parts) {
    const state = findStateRequirement(part)
    if (state) {
      groups.push({ kind: 'state', state })

      const stateNameRegex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(state.name)}(?:$|[\\s,;])`)
      const stateAbbrevRegex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(state.abbrev)}(?:$|[\\s,;])`, 'i')
      const leftover = normalizeLocationText(part.replace(stateNameRegex, ' ').replace(stateAbbrevRegex, ' '))
      const cityTerms = tokenize(leftover).filter((term) => !LOCATION_MODIFIERS.has(term) && term !== state.abbrev)
      if (cityTerms.length > 0) groups.push({ kind: 'phrase', phrase: cityTerms.join(' ') })
      continue
    }

    const terms = tokenize(part).filter((term) => !LOCATION_MODIFIERS.has(term))
    const phrase = terms.join(' ')
    if (phrase) groups.push({ kind: 'phrase', phrase })
  }

  return groups
}

function phraseRequirementMatches(phrase: string, haystack: string): boolean {
  if (!phrase) return true
  if (/remote|anywhere|work from home|location independent/.test(phrase)) {
    if (/remote|anywhere|work from home|location independent/.test(haystack)) return true
  }

  const regex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(phrase)}(?:$|[\\s,;])`)
  if (regex.test(haystack)) return true

  const tokens = tokenize(haystack)
  return phrase.split(/\s+/).every((word) => tokens.includes(word))
}

function stateRequirementMatches(state: StateRequirement, haystack: string): boolean {
  if (tokenize(haystack).includes(state.abbrev)) return true

  const regex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(state.name)}(?:$|[\\s,;])`)
  if (!regex.test(haystack)) return false
  if (state.name === 'virginia' && /(?:^|[\s,;])west\s+virginia(?:$|[\s,;])/.test(haystack)) return false
  return true
}

function locationMatches(job: JobResult, groups: LocationRequirement[]): boolean {
  const haystack = locationHaystack(job)
  return groups.every((group) =>
    group.kind === 'state' ? stateRequirementMatches(group.state, haystack) : phraseRequirementMatches(group.phrase, haystack)
  )
}

function locationPriorityScore(job: JobResult, groups: LocationRequirement[]): number {
  const haystack = locationHaystack(job)
  const tokens = tokenize(haystack)
  let score = 0

  for (const group of groups) {
    if (group.kind === 'state') {
      if (tokens.includes(group.state.abbrev)) score += 3
      else if (stateRequirementMatches(group.state, haystack)) score += 2
    } else {
      const exact = new RegExp(`(?:^|[\\s,;])${escapeRegExp(group.phrase)}(?:$|[\\s,;])`).test(haystack)
      if (exact) score += 3
      else if (phraseRequirementMatches(group.phrase, haystack)) score += 2
    }
  }

  return score
}

export function expandStateAbbreviations(location: string): string {
  const parts = normalizeLocationText(location)
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const expanded = parts.map((part) => {
    const state = findStateRequirement(part)
    if (!state || part.includes(state.name)) return part

    const stateAbbrevRegex = new RegExp(`(?:^|[\\s,;])${escapeRegExp(state.abbrev)}(?:$|[\\s,;])`, 'i')
    const replaced = part.replace(stateAbbrevRegex, (match) => {
      const lead = /^[,;\s]/.test(match) ? match[0] : ''
      const tail = /[,;\s]$/.test(match) ? match.slice(-1) : ''
      return `${lead}${state.name}${tail}`
    })
    return normalizeLocationText(replaced) || part
  })

  return expanded.join(', ') || location
}

const US_GEO = [
  'united states', 'usa', 'u.s.', 'u.s.a', 'us only', 'us-based', 'us based', 'remote - us', 'remote us',
  'any state', 'us citizen', 'north america', 'americas', 'new york', 'nyc', 'san francisco', 'bay area', 'silicon valley',
  'los angeles', 'austin', 'seattle', 'boston', 'chicago', 'denver', 'atlanta', 'miami', 'dallas',
  'houston', 'phoenix', 'portland', 'minneapolis', 'detroit', 'philadelphia', 'washington dc', 'new jersey',
  'connecticut', 'massachusetts', 'california', 'texas', 'florida', 'illinois', 'colorado', 'georgia',
  'washington state', 'oregon', 'arizona', 'virginia', 'maryland', 'carolina', 'ohio', 'pennsylvania',
  'worldwide', 'world-wide', 'anywhere', 'global', 'remote worldwide', 'worldwide remote', 'remote anywhere',
  'anywhere remote', 'global remote', 'remote global', 'any location', 'location independent'
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const US_GEO_PATTERNS = US_GEO.map(
  (token) => new RegExp(`(?<![a-z0-9])${escapeRegExp(token)}(?![a-z0-9])`)
)

export function textHasUsGeo(text: string): boolean {
  const haystack = text.toLowerCase()
  return US_GEO_PATTERNS.some((pattern) => pattern.test(haystack))
}

function textHasNonUsGeo(text: string): boolean {
  const haystack = text.toLowerCase()
  return NON_US_PATTERNS.some(([pattern]) => pattern.test(haystack))
}

export function isUsEligible(job: JobResult): boolean {
  const text = `${job.location ?? ''} ${job.restriction ?? ''} ${job.url ?? ''} ${job.source ?? ''}`
  if (textHasNonUsGeo(text)) return false
  if (job.remote) return true
  if (job.location) return textHasUsGeo(job.location)
  return true
}

export async function aggregateJobSearch(criteria: JobSearchCriteria): Promise<{
  jobs: JobResult[]
  sources: Array<Omit<JobProviderResult, 'jobs'>>
  providers: JobSourceInfo[]
  tookMs: number
}> {
  const started = Date.now()
  const settled = await Promise.allSettled(
    JOB_PROVIDERS.map((provider) => provider.search(criteria))
  )

  const sources: Array<Omit<JobProviderResult, 'jobs'>> = []
  const merged = new Map<string, JobResult>()

  settled.forEach((outcome, index) => {
    const meta = JOB_PROVIDERS[index]
    if (outcome.status === 'fulfilled') {
      sources.push({ id: meta.id, label: meta.label, ok: true, count: outcome.value.length })
      for (const job of outcome.value) {
        const dedupeKey = normalizeKey(job.company, job.title, job.location)
        if (!merged.has(dedupeKey)) merged.set(dedupeKey, job)
      }
    } else {
      sources.push({
        id: meta.id,
        label: meta.label,
        ok: false,
        count: 0,
        error: outcome.reason instanceof Error ? outcome.reason.message : 'Search failed'
      })
    }
  })

  const tokens = tokenize(criteria.q)
  const locationRequirements = criteria.location ? locationRequirementGroups(criteria.location) : []
  const windowHours = RECENCY_WINDOWS[criteria.recency ?? DEFAULT_RECENCY].hours

  let jobs = [...merged.values()]
  if (criteria.usOnly) jobs = jobs.filter(isUsEligible)
  if (criteria.remote) jobs = jobs.filter((job) => job.remote)
  if (locationRequirements.length > 0) jobs = jobs.filter((job) => locationMatches(job, locationRequirements))
  jobs = jobs.filter((job) => job._dateScoped || dateWithinHours(job.postedAt, windowHours))

  if (tokens.length > 0) {
    const titleHaystacks = jobs.map((job) => `${job.title} ${job.company} ${job.tags.join(' ')}`.toLowerCase())
    const rarestToken = tokens
      .map((token) => ({
        token,
        titleHits: titleHaystacks.filter((hay) => hay.includes(token)).length
      }))
      .sort((a, b) => a.titleHits - b.titleHits)[0].token

    const withMeta = jobs.map((job, index) => {
      const titleHay = titleHaystacks[index]
      const fullHay = `${titleHay} ${job._match ?? job.snippet ?? ''}`.toLowerCase()
      const coverage = tokens.filter((token) => fullHay.includes(token)).length
      const identity = tokens.some((token) => titleHay.includes(token))
      const locationPriority =
        locationRequirements.length > 0 ? locationPriorityScore(job, locationRequirements) : 0
      return {
        job,
        coverage,
        identity,
        locationPriority,
        rareInFull: fullHay.includes(rarestToken),
        score: relevanceScore(job, tokens)
      }
    })
    const locationFirst = locationRequirements.length > 0
    const qualified = locationFirst
      ? withMeta.filter((entry) => entry.locationPriority > 0 && (entry.identity || entry.coverage > 0))
      : withMeta.filter((entry) => entry.identity && entry.rareInFull)
    const pool = locationFirst
      ? qualified.length > 0
        ? qualified
        : withMeta.filter((entry) => entry.locationPriority > 0)
      : qualified.length > 0
        ? qualified
        : withMeta.filter((entry) => entry.identity)
    jobs = pool
      .sort((a, b) => {
        if (b.locationPriority !== a.locationPriority) return b.locationPriority - a.locationPriority
        if (b.identity !== a.identity) return b.identity ? 1 : -1
        if (b.coverage !== a.coverage) return b.coverage - a.coverage
        if (b.score !== a.score) return b.score - a.score
        return (b.job.postedAt ?? '').localeCompare(a.job.postedAt ?? '')
      })
      .map((entry) => publicJob(entry.job))
  } else {
    jobs = jobs.map(publicJob)
    jobs.sort((a, b) => (b.postedAt ?? '').localeCompare(a.postedAt ?? ''))
  }

  return { jobs, sources, providers: getJobSources(), tookMs: Date.now() - started }
}
