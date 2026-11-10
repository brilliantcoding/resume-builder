'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import {
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Globe2,
  MapPin,
  Search,
  WifiOff,
  X,
  Zap
} from 'lucide-react'

interface JobResult {
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
}

interface SourceStatus {
  id: string
  label: string
  ok: boolean
  count: number
  error?: string
}

interface ResumeProfile {
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

const EXAMPLES = ['React Engineer', 'Product Designer', 'Data Scientist', 'DevOps', 'Technical Writer']

const RECENCY_OPTIONS = [
  { id: '24h', label: '24 hours' },
  { id: '3d', label: '3 days' },
  { id: '7d', label: '7 days' }
] as const

type RecencyId = (typeof RECENCY_OPTIONS)[number]['id']

const RECENCY_SUMMARY: Record<RecencyId, string> = {
  '24h': 'last 24 hours',
  '3d': 'last 3 days',
  '7d': 'last 7 days'
}

function relativeTime(iso?: string): string | null {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return null
  const minutes = Math.floor((Date.now() - then) / 60_000)
  if (minutes < 60) return minutes <= 1 ? 'just posted' : `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function skillTermPattern(skill: string, flags = 'i'): RegExp {
  return new RegExp(`(^|\\s)${escapeRegExp(skill)}(?=\\s|$)`, flags)
}

function containsSkillTerm(query: string, skill: string): boolean {
  const term = skill.trim()
  return term.length > 0 && skillTermPattern(term).test(query)
}

function removeSkillTerm(query: string, skill: string): string {
  return query
    .replace(skillTermPattern(skill, 'gi'), ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function addSkillTerm(query: string, skill: string): string {
  const term = skill.trim()
  return query.trim() ? `${query.trim()} ${term}` : term
}

function toggleSkillInFields(jobTitle: string, keywords: string, skill: string) {
  const term = skill.trim()
  if (!term) return { jobTitle, keywords }
  if (containsSkillTerm(keywords, term)) {
    return { jobTitle, keywords: removeSkillTerm(keywords, term) }
  }
  if (containsSkillTerm(jobTitle, term)) {
    return { jobTitle: removeSkillTerm(jobTitle, term), keywords }
  }
  return { jobTitle, keywords: addSkillTerm(keywords, term) }
}

function combineSearchTerms(...terms: Array<string | undefined | null>): string {
  return terms.map((term) => term?.trim() ?? '').filter(Boolean).join(' ').trim()
}

function profileSkillQuery(profile: ResumeProfile): string {
  if (profile.searchSkills?.length) return profile.searchSkills.join(' ')
  const role = profile.targetRole.trim()
  if (role && profile.q.trim().toLowerCase().startsWith(role.toLowerCase())) {
    return profile.q.trim().slice(role.length).trim()
  }
  return profile.q.trim()
}

function profileCombinedQuery(profile: ResumeProfile): string {
  return combineSearchTerms(profile.targetRole, profileSkillQuery(profile))
}

function JobCard({ job }: { job: JobResult }) {
  const posted = relativeTime(job.postedAt)
  const restriction = job.restriction && !/^remote$/i.test(job.restriction) ? job.restriction : null
  const locationLabel = job.remote
    ? restriction ?? 'Remote'
    : job.location || '—'
  return (
    <article className="group flex flex-col rounded-xl border border-default bg-surface transition-all duration-200 hover:border-crimson-500/40 hover:shadow-[0_8px_28px_rgba(48,164,108,0.10)]">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <span className="inline-flex items-center gap-1 rounded-full border border-crimson-500/25 bg-crimson-500/[0.07] px-2 py-0.5 text-[11px] font-semibold text-crimson-500">
          <Globe2 className="h-3 w-3" />
          {job.source}
        </span>
        {posted && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted">
            <Clock className="h-3 w-3" />
            {posted}
          </span>
        )}
      </div>
      <div className="px-5 pt-2.5">
        <h3 className="font-display text-[15px] font-semibold leading-snug">
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-crimson-500">
            {job.title}
          </a>
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          {job.company && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {job.company}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 ${job.remote ? 'text-crimson-500' : ''}`}>
            <MapPin className="h-3.5 w-3.5" />
            {locationLabel}
          </span>
          {job.salary && <span className="font-medium text-secondary">{job.salary}</span>}
        </div>
      </div>
      {job.snippet && (
        <p className="mt-2.5 line-clamp-2 px-5 text-[13px] leading-relaxed text-muted">{job.snippet}</p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-4 pt-3">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {job.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="max-w-[130px] truncate rounded-md bg-card px-2 py-0.5 text-[11px] text-muted">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-default px-3 py-1.5 text-xs font-semibold text-secondary transition-all hover:border-crimson-500/40 hover:bg-crimson-500/[0.07] hover:text-crimson-500"
        >
          Open job
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  )
}

export default function JobsPage() {
  const [initialQuery] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('q') ?? ''
  )
  const [jobTitle, setJobTitle] = useState(initialQuery)
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')
  const [remote, setRemote] = useState(true)
  const [usOnly, setUsOnly] = useState(true)
  const [recency, setRecency] = useState<RecencyId>('24h')
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [sources, setSources] = useState<SourceStatus[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(() =>
    initialQuery ? 'loading' : 'idle'
  )
  const [message, setMessage] = useState<string | null>(null)
  const [tookMs, setTookMs] = useState<number | null>(null)
  const [resumeSearch, setResumeSearch] = useState(false)
  const [resumeProfile, setResumeProfile] = useState<ResumeProfile | null>(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const qInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const manualFieldsRef = useRef<{
    jobTitle: string
    q: string
    location: string
    remote: boolean
    usOnly: boolean
  } | null>(null)
  const { data: session, status: sessionStatus } = useSession()

  const searchQuery = combineSearchTerms(jobTitle, q)

  const clearKeywords = () => {
    setQ('')
    qInputRef.current?.focus()
  }

  const runSearch = useCallback(
    async (options: {
      query: string
      loc: string
      onlyRemote: boolean
      onlyUs: boolean
      window: RecencyId
      useResume?: boolean
      resumeId?: string
    }) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setStatus('loading')
      setMessage(null)
      try {
        const params = new URLSearchParams({ q: options.query, recency: options.window })
        if (options.loc.trim()) params.set('location', options.loc.trim())
        if (options.onlyRemote) params.set('remote', '1')
        if (!options.onlyUs) params.set('us', '0')
        if (options.useResume) params.set('resume', '1')
        if (options.resumeId) params.set('resumeId', options.resumeId)
        const res = await fetch(`/api/jobs/search?${params}`, { signal: controller.signal })
        const payload = await res.json()
        if (!res.ok) {
          setStatus('error')
          setMessage(payload?.error ?? 'Job search failed. Please try again.')
          return
        }
        setJobs(payload.jobs)
        setSources(payload.sources)
        setTookMs(payload.tookMs)
        if (payload.resume) setResumeProfile(payload.resume)
        setStatus('done')
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setStatus('error')
        setMessage('Could not reach the job sources. Check your connection and retry.')
      }
    },
    []
  )

  const applyResumeProfileToForm = useCallback((profile: ResumeProfile) => {
    setJobTitle(profile.targetRole.trim())
    setQ(profileSkillQuery(profile))
    setLocation(profile.location ?? '')
    setRemote(profile.location ? /remote|wfh/i.test(profile.location) : true)
  }, [])

  const loadResumeProfile = useCallback(async () => {
    setResumeLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/jobs/resume-profile', { cache: 'no-store' })
      const payload = await res.json()
      if (!res.ok) {
        setResumeSearch(false)
        setMessage(payload?.error ?? 'Could not load resume search profile.')
        return null
      }
      const profile: ResumeProfile = payload.resume
      setResumeProfile(profile)
      applyResumeProfileToForm(profile)
      return profile
    } catch {
      setResumeSearch(false)
      setMessage('Could not load resume search profile. Check your connection and retry.')
      return null
    } finally {
      setResumeLoading(false)
    }
  }, [applyResumeProfileToForm])

  const toggleResumeSearch = async () => {
    if (resumeSearch) {
      const manual = manualFieldsRef.current
      if (manual) {
        setJobTitle(manual.jobTitle)
        setQ(manual.q)
        setLocation(manual.location)
        setRemote(manual.remote)
        setUsOnly(manual.usOnly)
        manualFieldsRef.current = null
      }
      setResumeProfile(null)
      setResumeSearch(false)
      setMessage(null)
      return
    }

    manualFieldsRef.current = { jobTitle, q, location, remote, usOnly }
    setResumeSearch(true)

    if (!session?.user?.id) {
      setMessage('Sign in to load your resume profile.')
      return
    }

    await loadResumeProfile()
  }

  useEffect(() => {
    if (
      !resumeSearch ||
      sessionStatus !== 'authenticated' ||
      !session?.user?.id ||
      resumeLoading ||
      resumeProfile
    ) {
      return
    }

    let cancelled = false
    void Promise.resolve().then(() => {
      if (!cancelled) void loadResumeProfile()
    })
    return () => {
      cancelled = true
    }
  }, [loadResumeProfile, resumeLoading, resumeProfile, resumeSearch, session?.user?.id, sessionStatus])

  useEffect(() => {
    if (!initialQuery) return
    void Promise.resolve().then(() =>
      runSearch({ query: initialQuery, loc: '', onlyRemote: false, onlyUs: true, window: '24h' })
    )
    return () => abortRef.current?.abort()
  }, [initialQuery, runSearch])

  const usesResumeValues =
    !!resumeProfile &&
    searchQuery === profileCombinedQuery(resumeProfile) &&
    location.trim() === (resumeProfile.location ?? '')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (resumeSearch && !resumeProfile && resumeLoading) return

    if (resumeSearch && !resumeProfile && !searchQuery) {
      setMessage(session?.user?.id ? 'Resume search profile is not available yet.' : 'Sign in to load your resume profile.')
      return
    }

    if (searchQuery.length < 2) {
      setMessage('Enter a job title or search terms.')
      return
    }

    void runSearch({ query: searchQuery, loc: location, onlyRemote: remote, onlyUs: usOnly, window: recency })
  }

  const allSourcesDown = status === 'done' && sources.length > 0 && sources.every((s) => !s.ok)

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-lg shadow-crimson-600/25 ring-1 ring-white/15">
            <Briefcase className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-[28px]">Job Search</h1>
            <p className="text-sm text-muted">
              Fresh US-focused roles from Google (Indeed, LinkedIn, Glassdoor) and open job boards.
            </p>
          </div>
        </div>

        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-default bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-secondary">Search from my resume</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Turn this on to fill the search fields from your latest resume. Everything stays editable.
            </p>
            {sessionStatus === 'unauthenticated' && (
              <p className="mt-1 text-[11px] text-muted">
                <Link href="/login" className="text-crimson-500 hover:underline">
                  Sign in
                </Link>{' '}
                to load your resume profile.
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-semibold text-muted">{resumeLoading ? 'Loading' : resumeSearch ? 'On' : 'Off'}</span>
            <button
              type="button"
              role="switch"
              aria-checked={resumeSearch}
              aria-label="Search from my resume"
              onClick={toggleResumeSearch}
              disabled={resumeLoading}
              className={`relative h-7 w-12 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                resumeSearch ? 'bg-crimson-600' : 'bg-white/10 hover:bg-white/[0.16]'
              }`}
            >
              <span
                className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  resumeSearch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        <form onSubmit={onSubmit} className="mt-3 rounded-2xl border border-default bg-surface p-4">
          {resumeSearch && (
            <div className="mb-3 rounded-xl border border-crimson-500/25 bg-crimson-500/[0.05] px-3.5 py-3 text-sm">
              {resumeLoading && <p className="text-muted">Loading your resume profile…</p>}
              {!resumeLoading && resumeProfile && (
                <>
                  <p className="font-semibold text-secondary">{resumeProfile.resumeTitle}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    Resume default: {resumeProfile.targetRole || 'Resume skills'}
                    {resumeProfile.seniority ? ` · ${resumeProfile.seniority}` : ''}
                    {resumeProfile.location ? ` · near ${resumeProfile.location}` : ' · no resume location'}
                  </p>
                  {resumeProfile.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {resumeProfile.skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          aria-pressed={containsSkillTerm(searchQuery, skill)}
                          onClick={() => {
                            const next = toggleSkillInFields(jobTitle, q, skill)
                            setJobTitle(next.jobTitle)
                            setQ(next.keywords)
                          }}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            containsSkillTerm(searchQuery, skill)
                              ? 'border-crimson-500/50 bg-crimson-500/[0.12] text-crimson-500'
                              : 'border-default text-muted hover:border-crimson-500/30 hover:text-secondary'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              {!resumeLoading && !resumeProfile && (
                <p className="text-muted">
                  {sessionStatus === 'unauthenticated'
                    ? 'Sign in to load your resume profile.'
                    : 'Your latest resume could not be loaded for search.'}
                </p>
              )}
            </div>
          )}

          <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_minmax(12rem,0.7fr)_9rem_auto]">
            <label className="text-sm font-medium text-secondary">
              Job title
              <div className="relative mt-1">
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="React Engineer, Product Designer…"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors hover:border-white/[0.16] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-crimson-500"
                />
              </div>
            </label>
            <label className="text-sm font-medium text-secondary">
              Skills & keywords
              <div className="relative mt-1">
                <input
                  ref={qInputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="React, TypeScript, AWS…"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-600 transition-colors hover:border-white/[0.16] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-crimson-500"
                />
                {q && (
                  <button
                    type="button"
                    onClick={clearKeywords}
                    aria-label="Clear keywords"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-white/[0.07] hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </label>
            <label className="text-sm font-medium text-secondary">
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Any (remote included)"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors hover:border-white/[0.16] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-crimson-500"
              />
            </label>
            <label className="text-sm font-medium text-secondary">
              Posted within
              <select
                value={recency}
                onChange={(e) => setRecency(e.target.value as RecencyId)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-100 transition-colors hover:border-white/[0.16] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-crimson-500"
              >
                {RECENCY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" disabled={status === 'loading' || resumeLoading} className="h-[42px] sm:w-auto">
              <Search className="mr-1.5 h-4 w-4" />
              {status === 'loading' ? 'Searching…' : usesResumeValues ? 'Search from resume' : 'Search jobs'}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Only</span>
            <button
              type="button"
              onClick={() => setUsOnly((u) => !u)}
              aria-pressed={usOnly}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ${
                usOnly
                  ? 'border-crimson-500/50 bg-crimson-500/[0.12] text-crimson-500'
                  : 'border-default text-muted hover:border-crimson-500/30 hover:text-secondary'
              }`}
            >
              US-eligible
            </button>
            <button
              type="button"
              onClick={() => setRemote((r) => !r)}
              aria-pressed={remote}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ${
                remote
                  ? 'border-crimson-500/50 bg-crimson-500/[0.12] text-crimson-500'
                  : 'border-default text-muted hover:border-crimson-500/30 hover:text-secondary'
              }`}
            >
              Remote
            </button>
          </div>
        </form>

        {status === 'idle' && !resumeSearch && (
          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted">
            Try:
            {EXAMPLES.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setJobTitle(example)
                  setQ('')
                  void runSearch({ query: example, loc: '', onlyRemote: remote, onlyUs: usOnly, window: recency })
                }}
                className="rounded-full border border-default px-3 py-1 text-[13px] text-secondary transition-all hover:border-crimson-500/40 hover:text-crimson-500"
              >
                {example}
              </button>
            ))}
          </div>
        )}

        {(status === 'loading' || status === 'done') && sources.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px]">
            {sources.map((s) => (
              <span
                key={s.id}
                title={s.error}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium ${
                  s.ok
                    ? 'border-crimson-500/30 bg-crimson-500/[0.07] text-crimson-500'
                    : 'border-amber-500/30 bg-amber-500/[0.07] text-amber-500'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? 'bg-crimson-500' : 'bg-amber-500'}`} />
                {s.label}
                {s.ok ? ` · ${s.count}` : ' · unavailable'}
              </span>
            ))}
            {tookMs !== null && status === 'done' && (
              <span className="inline-flex items-center gap-1 text-muted">
                <Zap className="h-3 w-3" />
                {tookMs} ms
              </span>
            )}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/[0.07] px-4 py-2.5 text-sm text-red-400">
            {message}
          </div>
        )}

        {status === 'loading' && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl border border-default bg-surface" />
            ))}
          </div>
        )}

        {status === 'done' && allSourcesDown && (
          <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] px-6 py-10 text-center">
            <WifiOff className="h-6 w-6 text-amber-500" />
            <p className="font-medium">All job sources are unreachable right now.</p>
            <p className="text-sm text-muted">They rate-limit aggressively — wait a minute and search again.</p>
          </div>
        )}

        {status === 'done' && !allSourcesDown && jobs.length === 0 && (
          <div className="mt-8 rounded-xl border border-default bg-surface px-6 py-12 text-center">
            <p className="font-medium">No jobs matched “{searchQuery}”.</p>
            <p className="mt-1 text-sm text-muted">
              Try a broader keyword, widen “Posted within”, clear the location, or drop the remote filter.
            </p>
          </div>
        )}

        {status === 'done' && jobs.length > 0 && (
          <>
            <p className="mt-6 text-sm text-muted">
              <span className="font-semibold text-secondary">{jobs.length}</span> open role
              {jobs.length === 1 ? '' : 's'}
              {` · ${RECENCY_SUMMARY[recency]}`}
              {usOnly ? ' · US only' : ' · worldwide'}
              {location ? ` · near ${location}` : ''}
              {remote ? ' · remote only' : ''}
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.key} job={job} />
              ))}
            </div>
          </>
        )}

        <p className="mt-10 text-center text-xs text-muted">
          Results open on the source job board.{' '}
          <Link href="/dashboard" className="text-crimson-500 hover:underline">
            Build a resume
          </Link>{' '}
          while you browse.
        </p>
      </main>
    </>
  )
}
