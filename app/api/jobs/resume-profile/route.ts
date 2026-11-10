import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getResumeJobSearchProfile } from '@/lib/jobs/resume-search'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to use resume-based job search.', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const resumeId = request.nextUrl.searchParams.get('resumeId')?.trim() || undefined
  const result = await getResumeJobSearchProfile(session.user.id, resumeId)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, code: result.code }, { status: result.status })
  }

  return NextResponse.json({ resume: result.profile })
}
