import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getResumeJobSearchProfile, type ResumeJobSearchProfile } from '@/lib/jobs/resume-search'
import { aggregateJobSearch, parseRecency, RECENCY_WINDOWS } from '@/lib/jobs/search'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const resumeSearch = params.get('resume') === '1' || params.get('resume') === 'true'
  const resumeId = params.get('resumeId')?.trim() || undefined
  let q = (params.get('q') ?? '').trim()
  let location = (params.get('location') ?? '').trim() || undefined
  let resume: ResumeJobSearchProfile | undefined

  if (resumeSearch) {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sign in to use resume-based job search.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const result = await getResumeJobSearchProfile(session.user.id, resumeId)
    if (!result.ok) {
      return NextResponse.json({ error: result.error, code: result.code }, { status: result.status })
    }

    resume = result.profile
    q = resume.q
    location = location ?? resume.location
  }

  if (q.length < 2) {
    return NextResponse.json(
      { error: 'Enter at least 2 characters to search jobs.', code: 'MISSING_QUERY' },
      { status: 400 }
    )
  }

  const remote = params.get('remote') === '1'
  const usOnly = params.get('us') !== '0'
  const recency = parseRecency(params.get('recency'))
  const linkedinGuest = params.get('linkedin') !== '0'
  const limitRaw = Number(params.get('limit') ?? 60)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.trunc(limitRaw), 1), 150) : 60

  const { jobs, sources, providers, tookMs } = await aggregateJobSearch({
    q,
    location,
    remote,
    usOnly,
    recency,
    linkedinGuest
  })

  return NextResponse.json({
    query: { q, location, remote, usOnly, recency, recencyLabel: RECENCY_WINDOWS[recency].label },
    resume,
    count: Math.min(jobs.length, limit),
    tookMs,
    sources,
    providers,
    jobs: jobs.slice(0, limit)
  })
}
