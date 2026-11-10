import type { Browser, BrowserContext, Page } from 'playwright'
import type { JobResult, JobSearchCriteria, RecencyWindow } from './search'
import { expandStateAbbreviations } from './search'

interface RawLinkedInCard {
  title: string
  company: string
  location: string
  salary: string
  url: string
  postedIso: string
  postedLabel: string
  jobId: string
  cardText: string
}

interface LinkedInDetail {
  title: string
  location: string
  salary: string
  postedIso?: string
  postedLabel?: string
}

function envNumber(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name])
  if (!Number.isFinite(value)) return fallback
  return Math.max(min, Math.min(Math.trunc(value), max))
}

const PAGE_TIMEOUT_MS = envNumber('LINKEDIN_PAGE_TIMEOUT_MS', 15000, 5000, 30000)
const LINKEDIN_MAX_PAGES = envNumber('LINKEDIN_PAGES', 2, 1, 4)
const LINKEDIN_VALIDATE_LIMIT = envNumber('LINKEDIN_VALIDATE_LIMIT', 0, 0, 10)
const LINKEDIN_VALIDATE_CONCURRENCY = envNumber('LINKEDIN_VALIDATE_CONCURRENCY', 1, 1, 5)

const LINKEDIN_BLOCK_COOLDOWN_MS = 600_000
const LINKEDIN_ERROR_COOLDOWN_MS = 60_000
const DEFAULT_RECENCY: RecencyWindow = '24h'

let linkedinCooldownUntil = 0

export function linkedinGuestEnabled(criteria: JobSearchCriteria): boolean {
  return (
    criteria.linkedinGuest !== false &&
    process.env.LINKEDIN_GUEST_ENABLED !== 'false' &&
    Date.now() >= linkedinCooldownUntil
  )
}

function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim()
}

function normalizeKeyLocal(...parts: Array<string | undefined>): string {
  return parts
    .filter(Boolean)
    .join('|')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function linkedinTimeParam(window: RecencyWindow): string {
  return window === '24h' ? 'r86400' : 'r604800'
}

function linkedinSearchUrl(criteria: JobSearchCriteria, window: RecencyWindow, pageIndex: number): string {
  const params = new URLSearchParams({
    keywords: criteria.q,
    position: '1',
    pageNum: String(pageIndex),
    f_TPR: linkedinTimeParam(window)
  })

  const location = criteria.location?.trim()
  if (location) params.set('location', expandStateAbbreviations(location))
  else if (criteria.usOnly !== false) params.set('location', 'United States')

  if (criteria.remote) params.set('f_WT', '2')

  const start = pageIndex * 25
  if (start > 0) params.set('start', String(start))

  return `https://www.linkedin.com/jobs/search?${params.toString()}`
}

function normalizeLinkedInUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://www.linkedin.com')
    const view = parsed.pathname.match(/\/jobs\/view\/([^/?#]+)/)
    if (view) parsed.pathname = `/jobs/view/${view[1]}/`
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return url
  }
}

function titleFromLinkedInUrl(url: string): string {
  const slug = url.match(/\/jobs\/view\/([^/?#]+)/)?.[1] ?? ''
  const readable = slug.replace(/-\d{4,}$/, '').replace(/[-_]+/g, ' ').trim()
  if (!readable) return ''
  return readable.replace(/\b([a-z])/g, (_, char: string) => char.toUpperCase())
}

function isGenericTitle(value: string): boolean {
  return !value || /^join linkedin(?: job)?$/i.test(value) || /^linkedin job$/i.test(value)
}

function isBlockedUrl(url: string): boolean {
  const haystack = url.toLowerCase()
  return ['/authwall', '/checkpoint', '/challenge', '/uas/login', '/session/join', '/login'].some((path) =>
    haystack.includes(path)
  )
}

function looksClosed(text: string): boolean {
  return /(?:this job (?:was )?(?:expired|closed|filled)|job (?:posting )?(?:is |was )?(?:closed|expired|no longer)|position (?:closed|filled)|no longer (?:available|posted|active)|apply online no longer)/i.test(
    text
  )
}

function parseLinkedInDate(iso: string | null | undefined, label: string | null | undefined): string | undefined {
  const rawIso = clean(iso)
  if (rawIso) {
    const value = /^\d{4}-\d{2}-\d{2}$/.test(rawIso) ? `${rawIso}T12:00:00Z` : rawIso
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }

  const text = clean(label).toLowerCase()
  if (!text) return undefined
  if (/just posted|today|now/.test(text)) return new Date().toISOString()

  const relative = text.match(/(\d+)\s*(minute|hour|day|week|month)s?/)
  if (!relative) return undefined

  const amount = Number(relative[1])
  const unitMs: Record<string, number> = {
    minute: 60_000,
    hour: 3_600_000,
    day: 86_400_000,
    week: 604_800_000,
    month: 2_592_000_000
  }
  const delta = amount * (unitMs[relative[2]] ?? 0)
  if (!Number.isFinite(delta) || delta < 0) return undefined
  return new Date(Date.now() - delta).toISOString()
}

function isRemoteText(location: string, cardText: string): boolean {
  return /remote|anywhere|worldwide|work from home|location independent/i.test(`${location} ${cardText}`)
}

function cardToJob(card: RawLinkedInCard, criteria: JobSearchCriteria, window: RecencyWindow): JobResult | null {
  const url = normalizeLinkedInUrl(card.url)
  if (!url.includes('/jobs/view/')) return null

  const rawTitle = clean(card.title)
  const title = isGenericTitle(rawTitle) ? titleFromLinkedInUrl(url) || rawTitle : rawTitle
  const company = clean(card.company)
  const location = clean(card.location)
  const cardText = clean(card.cardText)
  if (!title || isGenericTitle(title) || looksClosed(cardText)) return null

  const postedAt = parseLinkedInDate(card.postedIso, card.postedLabel)
  const remote = Boolean(criteria.remote || isRemoteText(location, cardText))
  const dateScoped = window !== '3d' && !postedAt
  const jobId = clean(card.jobId) || normalizeLinkedInUrl(url).match(/\/jobs\/view\/([^/?#]+)/)?.[1] || normalizeKeyLocal(company, title, location)

  return {
    key: `linkedin:${jobId}`,
    title: title.slice(0, 180),
    company: company.slice(0, 140),
    location: location.slice(0, 180),
    remote,
    salary: clean(card.salary).slice(0, 100) || undefined,
    tags: [],
    snippet: cardText.slice(0, 220) || undefined,
    _match: `${title} ${company} ${location} ${cardText}`.slice(0, 4000),
    url,
    source: 'LinkedIn',
    postedAt,
    restriction: remote ? 'Remote' : undefined,
    _dateScoped: dateScoped
  }
}

async function blockNoisyResources(context: BrowserContext): Promise<void> {
  await context.route('**/*', (route) => {
    const type = route.request().resourceType()
    if (['image', 'media', 'font', 'websocket', 'eventsource'].includes(type)) return route.abort()
    return route.continue()
  })
}

async function collectLinkedInCards(
  context: BrowserContext,
  criteria: JobSearchCriteria,
  window: RecencyWindow
): Promise<RawLinkedInCard[]> {
  const page = await context.newPage()
  const cards: RawLinkedInCard[] = []
  const seen = new Set<string>()

  try {
    for (let pageIndex = 0; pageIndex < LINKEDIN_MAX_PAGES; pageIndex += 1) {
      const url = linkedinSearchUrl(criteria, window, pageIndex)
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS })

      if (isBlockedUrl(page.url())) throw new Error('LinkedIn guest access was blocked')
      if (response && [401, 403, 429].includes(response.status())) throw new Error('LinkedIn guest access was blocked')

      await page
        .waitForSelector('.authwall, .jobs-search__results-list, li.base-card, li.job-card-container, a[href*="/jobs/view/"]', {
          timeout: Math.min(10_000, PAGE_TIMEOUT_MS)
        })
        .catch(() => null)

      if (isBlockedUrl(page.url())) throw new Error('LinkedIn guest access was blocked')

      const current = await page.evaluate<RawLinkedInCard[]>(() => {
        const text = (root: Element, selector: string) =>
          root.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim() ?? ''

        return Array.from(document.querySelectorAll('li.base-card, li.job-card-container, .jobs-search__results-list > li'))
          .map((el) => {
            const link = el.querySelector('a[href*="/jobs/view/"], a.base-card__full-link, a.job-card-container__link')
            const href = link?.getAttribute('href') ?? ''
            const time = el.querySelector('time[datetime]')
            const urn = el.getAttribute('data-entity-urn') ?? ''

            let jobId = ''
            const hrefJob = href.match(/\/jobs\/view\/([^/?#]+)/)
            if (hrefJob) jobId = hrefJob[1]
            const urnJob = urn.match(/(\d+)/)
            if (!jobId && urnJob) jobId = urnJob[1]

            const cardTitle =
              text(el, '.base-search-card__title') ||
              text(el, '.job-card-list__title') ||
              text(el, 'a strong') ||
              text(el, '.base-card__full-link')
            const ariaTitle = (link?.getAttribute('aria-label') ?? '').replace(
              /^Join\s+LinkedIn(?:\s*[-–—:]\s*)?/i,
              ''
            )

            return {
              title: cardTitle || ariaTitle,
              company:
                text(el, '.base-search-card__subtitle') ||
                text(el, '.job-card-container__primary-description') ||
                text(el, '.artdeco-entity-lockup__subtitle') ||
                text(el, '.job-card-container__company-name'),
              location:
                text(el, '.job-search-card__location') ||
                text(el, '.job-card-container__metadata-item') ||
                text(el, '.base-search-card__metadata'),
              salary: text(el, '.job-search-card__salary-info') || text(el, '.job-card-container__salary'),
              url: href,
              postedIso: time?.getAttribute('datetime') ?? '',
              postedLabel: time?.textContent?.trim() || text(el, '.job-search-card__listdate'),
              jobId,
              cardText: el.textContent?.replace(/\s+/g, ' ').trim() ?? ''
            }
          })
          .filter((card) => Boolean(card.url) && Boolean(card.title))
      })

      const body = await page.locator('body').innerText({ timeout: 2500 }).catch(() => '')
      if (current.length === 0 && /sign in to see|join now to see all|authentication|captcha|too many requests/i.test(body)) {
        throw new Error('LinkedIn guest access was blocked')
      }

      for (const card of current) {
        const key = card.jobId || normalizeLinkedInUrl(card.url)
        if (!key || seen.has(key)) continue
        seen.add(key)
        cards.push(card)
      }

      if (current.length < 10) break
      await page.waitForTimeout(900 + Math.floor(Math.random() * 700))
    }
  } finally {
    await page.close().catch(() => undefined)
  }

  return cards
}

async function getLinkedInJobDetail(page: Page): Promise<LinkedInDetail | null> {
  return page.evaluate<LinkedInDetail | null>(() => {
    const text = (selector: string) => document.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    const time = document.querySelector('.posted-time-ago__text time[datetime], time[datetime]')
    const bullet = text('.topcard__flavor--bullet')
    const location = bullet.split('·').pop()?.trim() ?? ''
    return {
      title: text('.top-card-layout__title') || text('.topcard__title') || text('h1'),
      location,
      salary: text('.compensation__salary') || text('.salary.compensation__salary'),
      postedIso: time?.getAttribute('datetime') ?? undefined,
      postedLabel: time?.textContent?.trim()
    }
  })
}

function enrichWithDetail(job: JobResult, detail: LinkedInDetail | null): JobResult {
  if (!detail) return job
  const detailTitle = clean(detail.title)
  const detailLocation = clean(detail.location)
  const detailSalary = clean(detail.salary)
  const detailPostedAt = parseLinkedInDate(detail.postedIso, detail.postedLabel)
  const location = detailLocation || job.location
  const remote = job.remote || isRemoteText(location, '')

  return {
    ...job,
    title: detailTitle.length > 5 ? detailTitle.slice(0, 180) : job.title,
    location: location.slice(0, 180),
    salary: detailSalary.slice(0, 100) || job.salary,
    postedAt: detailPostedAt || job.postedAt,
    remote,
    restriction: remote ? job.restriction ?? 'Remote' : job.restriction
  }
}

async function validateLinkedInCard(context: BrowserContext, job: JobResult): Promise<JobResult | null> {
  const page = await context.newPage()
  try {
    await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: Math.min(12_000, PAGE_TIMEOUT_MS) })
    const body = await page.locator('body').innerText({ timeout: 2500 }).catch(() => '')
    if (looksClosed(body)) return null

    const detail = await getLinkedInJobDetail(page).catch(() => null)
    if (!detail && isBlockedUrl(page.url())) return job
    return enrichWithDetail(job, detail)
  } catch {
    return job
  } finally {
    await page.close().catch(() => undefined)
  }
}

async function validateLinkedInCards(context: BrowserContext, jobs: JobResult[]): Promise<JobResult[]> {
  if (jobs.length === 0 || LINKEDIN_VALIDATE_LIMIT === 0) return jobs

  const next: Array<JobResult | null> = jobs.slice()
  const candidates = jobs.slice(0, LINKEDIN_VALIDATE_LIMIT).map((job, index) => ({ job, index }))

  for (let offset = 0; offset < candidates.length; offset += LINKEDIN_VALIDATE_CONCURRENCY) {
    const chunk = candidates.slice(offset, offset + LINKEDIN_VALIDATE_CONCURRENCY)
    const validated = await Promise.all(chunk.map((entry) => validateLinkedInCard(context, entry.job)))
    chunk.forEach((entry, index) => {
      next[entry.index] = validated[index]
    })
  }

  return next.filter((job): job is JobResult => Boolean(job))
}

function isBlockedMessage(message: string): boolean {
  return /blocked|challenge|checkpoint|captcha|authwall|too many requests|429|rate/i.test(message)
}

function setLinkedInCooldown(message: string): void {
  const cooldown = isBlockedMessage(message) ? LINKEDIN_BLOCK_COOLDOWN_MS : LINKEDIN_ERROR_COOLDOWN_MS
  linkedinCooldownUntil = Date.now() + cooldown
}

function linkedinError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  if (
    /cannot find module 'playwright'|playwright is not|executable doesn't exist|browsertype\.launch/i.test(message)
  ) {
    return 'Playwright Chromium is not available. Run npm install -D playwright && npx playwright install chromium.'
  }
  if (/net::|err_|timeout/i.test(message)) return 'LinkedIn guest search timed out before results were available.'
  if (/blocked|challenge|checkpoint|captcha|authwall|too many requests|429/i.test(message)) {
    return 'LinkedIn guest access was blocked or rate-limited.'
  }
  return message.slice(0, 180)
}

async function launchLinkedInBrowser(): Promise<Browser> {
  const { chromium } = await import('playwright')
  const headless = process.env.LINKEDIN_HEADLESS !== 'false'
  try {
    return await chromium.launch({ headless, channel: 'chrome' })
  } catch {
    return await chromium.launch({ headless })
  }
}

export async function searchLinkedInGuest(criteria: JobSearchCriteria): Promise<JobResult[]> {
  if (!linkedinGuestEnabled(criteria)) return []

  let browser: Browser | undefined
  try {
    browser = await launchLinkedInBrowser()
    const version = await browser.version()
    const context = await browser.newContext({
      locale: 'en-US',
      viewport: { width: 1366, height: 900 },
      userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
      extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
    })

    await blockNoisyResources(context)

    const window = criteria.recency ?? DEFAULT_RECENCY
    const rawCards = await collectLinkedInCards(context, criteria, window)
    const seen = new Set<string>()
    let jobs: JobResult[] = []

    for (const card of rawCards) {
      const job = cardToJob(card, criteria, window)
      if (!job || seen.has(job.key)) continue
      seen.add(job.key)
      jobs.push(job)
    }

    jobs = await validateLinkedInCards(context, jobs)
    return jobs
  } catch (err) {
    const message = linkedinError(err)
    setLinkedInCooldown(message)
    throw new Error(message)
  } finally {
    await browser?.close().catch(() => undefined)
  }
}
