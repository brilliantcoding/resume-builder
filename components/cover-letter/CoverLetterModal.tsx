'use client'
import { useEffect, useRef, useState } from 'react'
import { X, Mail, Sparkles, Copy, Download, Trash2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ResumeData } from '@/types/resume'

type Letter = {
  id: string
  company: string
  role: string
  jobDescription: string
  tone: string
  content: string
  updatedAt: string
}

type Stage = 'form' | 'generating' | 'result'

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'concise', label: 'Concise' },
  { value: 'executive', label: 'Executive' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CoverLetterModal({ resumeId, resumeData, onClose }: {
  resumeId: string
  resumeData?: ResumeData
  onClose: () => void
}) {
  const [stage, setStage] = useState<Stage>('form')
  const [profile, setProfile] = useState<ResumeData | null>(resumeData ?? null)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [tone, setTone] = useState('professional')
  const [jobDescription, setJobDescription] = useState('')
  const [showJD, setShowJD] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [letters, setLetters] = useState<Letter[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    fetch(`/api/cover-letter?resumeId=${resumeId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => { if (b?.letters) setLetters(b.letters) })
      .catch(() => { /* list is auxiliary — ignore fetch failures */ })
  }, [resumeId])

  useEffect(() => {
    if (resumeData) return
    fetch(`/api/resume/${resumeId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => { if (b?.data) setProfile(b.data) })
      .catch(() => setError('Could not load your resume. Check the connection and reopen this dialog.'))
  }, [resumeId, resumeData])

  async function refreshLetters() {
    try {
      const res = await fetch(`/api/cover-letter?resumeId=${resumeId}`)
      if (res.ok) setLetters((await res.json()).letters ?? [])
    } catch { /* auxiliary */ }
  }

  useEffect(() => () => abortRef.current?.abort(), [])

  async function generate() {
    if (!profile) {
      setError('Your resume is still loading — give it a second.')
      return
    }
    if (!company.trim() || !role.trim()) {
      setError('Company and role are required.')
      return
    }
    setError('')
    setStage('generating')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({ resumeData: profile, company, role, jobDescription, tone }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body.error || 'Generation failed. Please try again.')
        setStage('form')
        return
      }
      setEditingId(null)
      setContent(body.content)
      setStage('result')
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError('Network error. Check your connection and the AI server.')
      setStage('form')
    }
  }

  async function saveLetter() {
    if (!content.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = editingId
        ? await fetch(`/api/cover-letter/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company, role, jobDescription, tone, content }),
          })
        : await fetch('/api/cover-letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeId, company, role, jobDescription, tone, content }),
          })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Could not save the letter.')
        return
      }
      const { letter } = await res.json()
      setEditingId(letter.id)
      await refreshLetters()
    } finally {
      setSaving(false)
    }
  }

  function openLetter(letter: Letter) {
    setCompany(letter.company)
    setRole(letter.role)
    setTone(letter.tone)
    setJobDescription(letter.jobDescription)
    setContent(letter.content)
    setEditingId(letter.id)
    setError('')
    setStage('result')
  }

  async function deleteLetter(id: string) {
    await fetch(`/api/cover-letter/${id}`, { method: 'DELETE' })
    if (editingId === id) { setEditingId(null); setContent(''); setStage('form') }
    await refreshLetters()
  }

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  function downloadLetter() {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cover-letter-${company.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'draft'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const inputCls = 'w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-crimson-500/40 focus:outline-none'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson-500/15">
              <Mail className="h-4.5 w-4.5 text-crimson-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-100">Cover Letter</h2>
              <p className="text-sm text-slate-500">Tailored to the job, ready to send</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3.5 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {(stage === 'form' || stage === 'generating') && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Company *</label>
                  <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" disabled={stage === 'generating'} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Role *</label>
                  <input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Software Engineer" disabled={stage === 'generating'} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      disabled={stage === 'generating'}
                      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                        tone === t.value
                          ? 'bg-crimson-500/20 text-crimson-300 ring-1 ring-crimson-500/40'
                          : 'bg-white/[0.05] text-slate-400 hover:bg-white/[0.09]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button onClick={() => setShowJD((v) => !v)} className="text-xs text-slate-400 hover:text-slate-200">
                  {showJD ? '▾' : '▸'} Paste the job posting (recommended — the letter mirrors its keywords)
                </button>
                {showJD && (
                  <textarea
                    className={`${inputCls} mt-2 h-28 resize-y`}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here…"
                    disabled={stage === 'generating'}
                  />
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={generate} loading={stage === 'generating'}>
                  {stage === 'generating' ? 'Writing…' : <><Sparkles className="h-4 w-4" /> Generate letter</>}
                </Button>
                {content && stage === 'form' && (
                  <Button variant="secondary" onClick={() => setStage('result')}>Back to draft</Button>
                )}
              </div>

              {stage === 'generating' && (
                <p className="text-xs text-slate-500">Usually takes 5–15 seconds. Facts come only from your resume — nothing is invented.</p>
              )}
            </>
          )}

          {stage === 'result' && (
            <>
              <textarea
                className="h-72 w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 font-mono text-[13px] leading-relaxed text-slate-200 focus:border-crimson-500/40 focus:outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" onClick={saveLetter} loading={saving}>
                  {editingId ? 'Save changes' : 'Save letter'}
                </Button>
                <Button variant="outline" onClick={copyLetter}>
                  {copied ? <><Check className="h-4 w-4 text-emerald-400" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                </Button>
                <Button variant="outline" onClick={downloadLetter}>
                  <Download className="h-4 w-4" /> .txt
                </Button>
                <Button variant="ghost" onClick={() => setStage('form')}>
                  <Sparkles className="h-4 w-4" /> New version
                </Button>
              </div>
            </>
          )}

          {letters.length > 0 && (
            <div className="border-t border-white/[0.06] pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Saved letters</p>
              <div className="space-y-1.5">
                {letters.map((l) => (
                  <div key={l.id} className={`group flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors ${editingId === l.id ? 'border-crimson-500/25 bg-crimson-500/[0.08]' : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                    <button onClick={() => openLetter(l)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm text-slate-200">{l.role} · {l.company}</p>
                      <p className="text-[11px] text-slate-500">{l.tone} · {fmtDate(l.updatedAt)}</p>
                    </button>
                    <button onClick={() => deleteLetter(l.id)} className="rounded p-1 text-slate-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100" aria-label="Delete letter">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CoverLetterButton({ resumeId, resumeData, label = true, variant = 'outline', size = 'sm', className = '', ariaLabel }: {
  resumeId: string
  resumeData?: ResumeData
  label?: boolean
  variant?: 'outline' | 'secondary' | 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)} className={className} aria-label={ariaLabel}>
        <Mail className="h-4 w-4" />
        {label && <span className="hidden sm:inline">Cover Letter</span>}
      </Button>
      {open && <CoverLetterModal resumeId={resumeId} resumeData={resumeData} onClose={() => setOpen(false)} />}
    </>
  )
}
