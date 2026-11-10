'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Plus, FileText, Trash2, Pencil, Clock, Sparkles, TrendingUp, LayoutGrid } from 'lucide-react'
import { UploadResumeButton } from '@/components/dashboard/UploadResumeButton'
import { CoverLetterButton } from '@/components/cover-letter/CoverLetterModal'

interface ResumeCard {
  id: string
  title: string
  template: string
  updatedAt: string
  createdAt: string
}

const templateMeta: Record<string, { gradient: string; dot: string; label: string; bar: string }> = {
  modern:        { gradient: 'from-crimson-600 to-crimson-700', dot: 'bg-crimson-400', label: 'Modern',       bar: 'from-crimson-500 to-crimson-600' },
  classic:       { gradient: 'from-slate-600 to-slate-700',  dot: 'bg-slate-400',   label: 'Classic',      bar: 'from-slate-500 to-slate-600' },
  minimal:       { gradient: 'from-emerald-600 to-emerald-700', dot: 'bg-emerald-400', label: 'Minimal',    bar: 'from-emerald-500 to-emerald-600' },
  creative:      { gradient: 'from-crimson-500 to-crimson-600', dot: 'bg-crimson-400', label: 'Creative',   bar: 'from-crimson-400 to-crimson-500' },
  executive:     { gradient: 'from-slate-800 to-slate-900',  dot: 'bg-slate-400',   label: 'Executive',    bar: 'from-slate-600 to-slate-700' },
  timeline:      { gradient: 'from-emerald-500 to-emerald-600', dot: 'bg-emerald-400', label: 'Timeline',   bar: 'from-emerald-400 to-emerald-500' },
  elegant:       { gradient: 'from-zinc-600 to-zinc-800',   dot: 'bg-zinc-400',    label: 'Elegant',      bar: 'from-zinc-500 to-zinc-700' },
  compact:       { gradient: 'from-crimson-700 to-crimson-800', dot: 'bg-crimson-400', label: 'Compact',    bar: 'from-crimson-500 to-crimson-600' },
  professional:  { gradient: 'from-teal-700 to-teal-900',  dot: 'bg-teal-400',    label: 'Professional', bar: 'from-teal-600 to-teal-800' },
  altacv:        { gradient: 'from-emerald-700 to-emerald-900', dot: 'bg-emerald-300', label: 'AltaCV',    bar: 'from-emerald-600 to-emerald-800' },
  jakes:         { gradient: 'from-gray-700 to-gray-900',    dot: 'bg-gray-400',    label: "Jake's",       bar: 'from-gray-600 to-gray-800' },
  sixtyseconds:  { gradient: 'from-emerald-600 to-emerald-700', dot: 'bg-emerald-400', label: 'SixtySeconds', bar: 'from-emerald-500 to-emerald-600' },
  berlin:        { gradient: 'from-slate-600 to-slate-800',  dot: 'bg-slate-400',   label: 'Berlin',       bar: 'from-slate-500 to-slate-700' },
  tokyo:         { gradient: 'from-slate-500 to-slate-600',  dot: 'bg-slate-300',   label: 'Tokyo',        bar: 'from-slate-400 to-slate-500' },
  vienna:        { gradient: 'from-crimson-800 to-crimson-900', dot: 'bg-crimson-400', label: 'Vienna',     bar: 'from-crimson-700 to-crimson-800' },
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function DashboardPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/resume')
      .then((r) => r.json())
      .then(setResumes)
      .finally(() => setLoading(false))
  }, [])

  async function createResume() {
    setCreating(true)
    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Resume' }),
    })
    const data = await res.json()
    router.push(`/resume/${data.id}`)
  }

  async function deleteResume(id: string) {
    setDeletingId(id)
    await fetch(`/api/resume/${id}`, { method: 'DELETE' })
    setResumes((prev) => prev.filter((r) => r.id !== id))
    setDeletingId(null)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Page header */}
        <div className="relative overflow-hidden border-b border-default bg-card">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-cross-pattern opacity-20" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-crimson-600/[0.06] blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-1 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-sm shadow-crimson-500/30">
                    <LayoutGrid className="h-4 w-4 text-white" />
                  </div>
                  <h1 className="font-display text-2xl font-extrabold text-primary">My Resumes</h1>
                </div>
                <p className="mt-0.5 text-sm text-secondary pl-[42px]">
                  {loading ? 'Loading...' : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} in your workspace`}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <UploadResumeButton />
                <button
                  onClick={createResume}
                  disabled={creating}
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 transition-all"
                >
                  {creating ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  New Resume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            /* Skeleton loading */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-default bg-surface">
                  <div className="h-1 shimmer" />
                  <div className="space-y-3 p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl shimmer" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-2/3 rounded shimmer" />
                        <div className="h-2.5 w-1/3 rounded shimmer" />
                      </div>
                    </div>
                    <div className="h-2.5 w-1/3 rounded shimmer" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 flex-1 rounded-lg shimmer" />
                      <div className="h-8 w-8 rounded-lg shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse-glow rounded-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-crimson-500/20 bg-crimson-500/[0.07]">
                  <FileText className="h-9 w-9 text-primary" />
                </div>
              </div>
              <h3 className="font-display mb-2 text-xl font-bold text-primary">No resumes yet</h3>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-secondary">
                Create from scratch or upload an existing resume — AI will format and enhance it for you.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button
                  onClick={createResume}
                  disabled={creating}
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Create from scratch
                </button>
                <UploadResumeButton />
              </div>
            </div>
          ) : (
            /* Resume grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Create new card */}
              <button
                onClick={createResume}
                disabled={creating}
                className="group relative flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07] transition-all duration-300 hover:border-crimson-500/25 hover:bg-crimson-500/[0.03]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-default bg-card transition-all duration-300 group-hover:border-crimson-500/25 group-hover:bg-crimson-500/[0.1]">
                  <Plus className="h-5 w-5 text-muted transition-colors group-hover:text-crimson-400" />
                </div>
                <span className="text-sm font-semibold text-muted transition-colors group-hover:text-crimson-300">
                  New Resume
                </span>
                <span className="mt-1 text-xs text-muted transition-colors group-hover:text-secondary">
                  Start from scratch
                </span>
              </button>

              {/* Upload card */}
              <UploadResumeButton asCard />

              {/* Resume cards */}
              {resumes.map((resume) => {
                const meta = templateMeta[resume.template] ?? templateMeta.modern
                return (
                  <div
                    key={resume.id}
                    className="group card-lift overflow-hidden rounded-2xl border border-default bg-surface shadow-sm"
                  >
                    {/* Template color bar */}
                    <div className={`h-[3px] bg-gradient-to-r ${meta.bar}`} />

                    <div className="p-5">
                      {/* Header row */}
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} shadow-sm`}>
                            <FileText className="h-5 w-5 text-white" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold leading-tight text-primary">{resume.title}</h3>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className={`inline-block h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                              <span className="text-xs text-secondary">{meta.label}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-default bg-card px-2 py-1 text-xs text-muted">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{timeAgo(resume.updatedAt)}</span>
                        </div>
                      </div>

                      {/* AI indicator */}
                      <div className="mb-4 flex w-fit items-center gap-1.5 rounded-lg border border-crimson-500/15 bg-crimson-500/[0.06] px-2.5 py-1.5 text-xs font-medium text-crimson-400">
                        <Sparkles className="h-3 w-3" />
                        AI-enhanced
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/resume/${resume.id}`} className="flex-1">
                          <button className="btn-gradient inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Resume
                          </button>
                        </Link>
                        <CoverLetterButton
                          resumeId={resume.id}
                          label={false}
                          size="sm"
                          className="!px-2.5"
                          ariaLabel="Generate cover letter"
                        />
                        <button
                          onClick={() => deleteResume(resume.id)}
                          disabled={deletingId === resume.id}
                          className="inline-flex items-center justify-center rounded-lg border border-red-500/15 bg-red-500/[0.06] px-2.5 py-2 text-red-400 transition-all hover:border-red-500/25 hover:bg-red-500/[0.12] disabled:opacity-50"
                          aria-label="Delete resume"
                        >
                          {deletingId === resume.id ? (
                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Bottom tip */}
          {!loading && resumes.length > 0 && (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-crimson-500/12 bg-crimson-500/[0.04] p-5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-crimson-500/15 bg-crimson-500/10">
                <TrendingUp className="h-4 w-4 text-crimson-400" />
              </div>
              <div>
                <p className="mb-0.5 text-sm font-semibold text-primary">Pro tip: Tailor for each job</p>
                <p className="text-sm text-secondary">
                  Open any resume, paste a job description, and AI rewrites your summary to highlight matching skills — increasing your callback rate significantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
