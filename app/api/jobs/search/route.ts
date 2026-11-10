import { NextRequest, NextResponse } from 'next/server'
import { aggregateJobSearch, parseRecency, RECENCY_WINDOWS } from '@/lib/jobs/search'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const q = (params.get('q') ?? '').trim()
  if (q.length < 2) {
    return NextResponse.json(
      { error: 'Enter at least 2 characters to search jobs.', code: 'MISSING_QUERY' },
      { status: 400 }
    )
  }
  const location = (params.get('location') ?? '').trim() || undefined
  const remote = params.get('remote') === '1'
  const usOnly = params.get('us') !== '0'
  const recency = parseRecency(params.get('recency'))
  const limitRaw = Number(params.get('limit') ?? 60)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.trunc(limitRaw), 1), 150) : 60

  const { jobs, sources, providers, tookMs } = await aggregateJobSearch({ q, location, remote, usOnly, recency })

  return NextResponse.json({
    query: { q, location, remote, usOnly, recency, recencyLabel: RECENCY_WINDOWS[recency].label },
    count: Math.min(jobs.length, limit),
    tookMs,
    sources,
    providers,
    jobs: jobs.slice(0, limit)
  })
}
