'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileUp, X, CheckCircle, AlertCircle, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type Stage = 'idle' | 'dragging' | 'uploading' | 'parsing' | 'done' | 'error' | 'retrying'

// Total tries = initial + (MAX_ATTEMPTS - 1) automatic retries for retryable server errors
const MAX_ATTEMPTS = 3
const RETRY_WAITS_SEC = [3, 8]

// Steps shown in the progress view — each maps to a visual row
const STEPS = [
  { key: 'upload',  label: 'Uploading file',          detail: 'Sending to server' },
  { key: 'extract', label: 'Extracting text',          detail: 'Reading document content' },
  { key: 'parse',   label: 'Structuring resume',       detail: 'Organizing your resume details' },
  { key: 'save',    label: 'Saving to your workspace', detail: 'Almost done' },
] as const

type StepKey = typeof STEPS[number]['key']

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function UploadResumeButton({ asCard = false }: { asCard?: boolean }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [uploadPct, setUploadPct] = useState(0)        // 0-100, real XHR upload progress
  const [uploadedBytes, setUploadedBytes] = useState(0)
  const [activeStep, setActiveStep] = useState<StepKey>('upload')
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(new Set())
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Retry machinery for retryable AI/server failures
  const [file, setFile] = useState<File | null>(null)
  const [attempt, setAttempt] = useState(1)
  const [retryIn, setRetryIn] = useState(0)
  const attemptRef = useRef(1)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileRef = useRef<File | null>(null)

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [])

  function clearCountdown() {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null }
  }

  function openModal() {
    setShowModal(true)
    setStage('idle')
    setError('')
    setFileName('')
    setFileSize(0)
    setUploadPct(0)
    setUploadedBytes(0)
    setActiveStep('upload')
    setCompletedSteps(new Set())
    setFile(null)
    fileRef.current = null
    attemptRef.current = 1
    setAttempt(1)
    setRetryIn(0)
    clearCountdown()
  }
  function closeModal() { clearCountdown(); setShowModal(false) }

  function completeStep(key: StepKey) {
    setCompletedSteps(prev => new Set([...prev, key]))
  }

  function handleFile(file: File) {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
    const extOk = /\.(pdf|docx?|txt)$/i.test(file.name)
    if (!allowed.includes(file.type) && !extOk) {
      setStage('error')
      setError('Unsupported file. Please upload a PDF, DOCX, or TXT file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setStage('error')
      setError('File is too large. Maximum size is 5MB.')
      return
    }

    setFile(file)
    fileRef.current = file
    attemptRef.current = 1
    setAttempt(1)
    upload(file, 1)
  }

  function upload(f: File, tryNumber: number) {
    setFileName(f.name)
    setFileSize(f.size)
    setStage('uploading')
    setActiveStep('upload')
    setCompletedSteps(new Set())
    setUploadPct(0)
    setUploadedBytes(0)
    setRetryIn(0)
    clearCountdown()

    const formData = new FormData()
    formData.append('file', f)

    const xhr = new XMLHttpRequest()

    // Real upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100)
        setUploadPct(pct)
        setUploadedBytes(e.loaded)
      }
    })

    xhr.upload.addEventListener('load', () => {
      // Upload to server complete — now server is extracting text + calling AI
      setUploadPct(100)
      completeStep('upload')
      setActiveStep('extract')
      setStage('parsing')

      // Simulate the extract step briefly then move to AI parse step
      setTimeout(() => {
        completeStep('extract')
        setActiveStep('parse')
      }, 800)
    })

    xhr.addEventListener('load', () => {
      let body: { id?: string; title?: string; warning?: string; error?: string; code?: string; retryable?: boolean } = {}
      try { body = JSON.parse(xhr.responseText) } catch { /* ignore */ }

      if (xhr.status < 200 || xhr.status >= 300) {
        const msg = body.error || 'Upload failed'
        // Failed parse must NOT navigate — stay in modal, retry with backoff when safe
        if (body.retryable && tryNumber < MAX_ATTEMPTS) {
          setError(msg)
          scheduleRetry(tryNumber, msg)
        } else {
          setStage('error')
          setError(body.retryable
            ? `${msg} (still failing after ${MAX_ATTEMPTS} attempts)`
            : msg)
        }
        return
      }

      const data = body

      // Mark parse + save as complete
      completeStep('parse')
      setActiveStep('save')
      setTimeout(() => {
        completeStep('save')
        setStage('done')
        if (data.warning) setError(data.warning)
        setTimeout(() => {
          if (data.id) router.push(`/resume/${data.id}`)
        }, data.warning ? 2500 : 900)
      }, 400)
    })

    xhr.addEventListener('error', () => {
      const msg = 'Network error. Check your connection and the AI server.'
      if (tryNumber < MAX_ATTEMPTS) {
        setError(msg)
        scheduleRetry(tryNumber, msg)
      } else {
        setStage('error')
        setError(msg)
      }
    })

    xhr.open('POST', '/api/resume/upload')
    xhr.send(formData)
  }

  function scheduleRetry(failedAttempt: number, msg: string) {
    const wait = RETRY_WAITS_SEC[Math.min(failedAttempt - 1, RETRY_WAITS_SEC.length - 1)]
    attemptRef.current = failedAttempt + 1
    setAttempt(failedAttempt + 1)
    setStage('retrying')
    setError(msg)
    let remaining = wait
    setRetryIn(remaining)
    clearCountdown()
    countdownRef.current = setInterval(() => {
      remaining -= 1
      setRetryIn(remaining)
      if (remaining <= 0) {
        clearCountdown()
        const f = fileRef.current
        if (f) upload(f, attemptRef.current)
      }
    }, 1000)
  }

  function retryNow() {
    clearCountdown()
    setRetryIn(0)
    const f = fileRef.current
    if (f) upload(f, attemptRef.current)
  }

  function cancelRetry() {
    clearCountdown()
    setRetryIn(0)
    setStage('error')
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setStage('idle')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); setStage('dragging') }
  function onDragLeave() { if (stage === 'dragging') setStage('idle') }

  const trigger = asCard ? (
    <button
      onClick={openModal}
      className="group flex h-full min-h-[200px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] transition-all hover:border-crimson-500/30 hover:bg-crimson-500/[0.04]"
    >
      <Upload className="mb-2 h-10 w-10 text-slate-600 transition-colors group-hover:text-crimson-400" />
      <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-crimson-300">Upload Resume</span>
      <span className="mt-1 text-xs text-slate-600">PDF · DOCX · TXT</span>
    </button>
  ) : (
    <Button variant="outline" size="lg" onClick={openModal}>
      <Upload className="h-5 w-5" />
      Upload Resume
    </Button>
  )

  return (
    <>
      {trigger}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-100">Upload Existing Resume</h2>
                <p className="mt-0.5 text-sm text-slate-500">AI will extract and convert it to our format</p>
              </div>
              {(stage === 'idle' || stage === 'dragging' || stage === 'error' || stage === 'retrying') && (
                <button onClick={closeModal} className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="p-6">

              {/* ── Drop zone ── */}
              {(stage === 'idle' || stage === 'dragging') && (
                <>
                  <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
                      stage === 'dragging'
                        ? 'border-crimson-500/60 bg-crimson-500/[0.08]'
                        : 'border-white/[0.08] hover:border-crimson-500/30 hover:bg-crimson-500/[0.04]'
                    }`}
                  >
                    <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${stage === 'dragging' ? 'bg-crimson-500/20' : 'bg-white/[0.06]'}`}>
                      <FileUp className={`h-8 w-8 ${stage === 'dragging' ? 'text-crimson-400' : 'text-slate-500'}`} />
                    </div>
                    <p className="mb-1 text-base font-medium text-slate-200">
                      {stage === 'dragging' ? 'Drop it here!' : 'Drag & drop your resume'}
                    </p>
                    <p className="mb-4 text-sm text-slate-500">or click to browse files</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-slate-500">
                      PDF · DOCX · TXT &nbsp;·&nbsp; Max 5MB
                    </span>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                    />
                  </div>

                  <div className="mt-4 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
                    <span className="mt-0.5 text-sm text-amber-400">💡</span>
                    <p className="text-xs leading-relaxed text-slate-400">
                      <strong className="text-slate-300">Tip:</strong> For best results, use a text-based PDF (not a scanned image).
                      The AI will extract your work history, skills, and education automatically.
                    </p>
                  </div>
                </>
              )}

              {/* ── Progress view ── */}
              {(stage === 'uploading' || stage === 'parsing') && (
                <div className="space-y-5">
                  {/* File info pill */}
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-crimson-500/15">
                      <FileText className="h-4.5 w-4.5 text-crimson-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">{fileName}</p>
                      <p className="text-xs text-slate-500">{fmt(fileSize)}</p>
                    </div>
                  </div>

                  {/* Upload progress bar (only visible during actual upload) */}
                  {stage === 'uploading' && (
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300">Uploading…</span>
                        <span className="tabular-nums text-slate-500">
                          {fmt(uploadedBytes)} / {fmt(fileSize)} &nbsp;·&nbsp; {uploadPct}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-crimson-500 to-amber-500 transition-all duration-200"
                          style={{ width: `${uploadPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step list */}
                  <div className="space-y-2.5">
                    {STEPS.map((step, i) => {
                      const done = completedSteps.has(step.key)
                      const active = activeStep === step.key && !done

                      return (
                        <div
                          key={step.key}
                          className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all duration-300 ${
                            active  ? 'border border-crimson-500/25 bg-crimson-500/[0.08]' :
                            done    ? 'border border-emerald-500/15 bg-emerald-500/[0.05]' :
                                      'border border-white/[0.04] bg-white/[0.02] opacity-40'
                          }`}
                        >
                          {/* Status icon */}
                          <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                            done   ? 'bg-emerald-500/20' :
                            active ? 'bg-crimson-500/20' :
                                     'bg-white/[0.06]'
                          }`}>
                            {done ? (
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            ) : active ? (
                              /* Animated dots */
                              <span className="flex gap-0.5">
                                {[0, 1, 2].map(j => (
                                  <span
                                    key={j}
                                    className="h-1 w-1 rounded-full bg-crimson-400"
                                    style={{ animation: `bounce 1.2s ease-in-out ${j * 0.2}s infinite` }}
                                  />
                                ))}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-600">{i + 1}</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium leading-tight ${done ? 'text-emerald-300' : active ? 'text-slate-100' : 'text-slate-500'}`}>
                              {step.label}
                            </p>
                            {active && (
                              <p className="mt-0.5 text-[11px] text-slate-500">{step.detail}</p>
                            )}
                          </div>

                          {/* Active pulse indicator */}
                          {active && (
                            <span className="flex h-2 w-2 flex-shrink-0">
                              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-crimson-400 opacity-60" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson-500" />
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* AI badge shown during parse step */}
                  {activeStep === 'parse' && (
                    <div className="flex items-center gap-2 rounded-lg border border-crimson-500/20 bg-crimson-500/[0.06] px-3.5 py-2.5">
                      <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-crimson-400" />
                      <p className="text-xs text-crimson-300">
                        Structuring your resume data — this usually takes 5–15 seconds
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Done ── */}
              {stage === 'done' && (
                <div className="py-8 text-center">
                  <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${error ? 'bg-amber-500/15' : 'bg-emerald-500/15'}`}>
                    <CheckCircle className={`h-8 w-8 ${error ? 'text-amber-400' : 'text-emerald-400'}`} />
                  </div>
                  <p className="mb-1 text-base font-semibold text-slate-100">
                    {error ? 'Resume created with issues' : 'Resume imported!'}
                  </p>
                  {error && <p className="mb-2 text-sm text-amber-400/90">{error}</p>}
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500">
                    <span>Redirecting to editor</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              )}

              {/* ── Auto-retry with backoff ── */}
              {stage === 'retrying' && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15">
                    <AlertCircle className="h-8 w-8 text-amber-400" />
                  </div>
                  <p className="mb-1 text-base font-semibold text-slate-100">Import hit a problem</p>
                  <p className="mb-4 text-sm text-amber-400/90">{error}</p>
                  <p className="text-sm text-slate-400">
                    Retrying automatically in{' '}
                    <span className="font-semibold tabular-nums text-slate-100">{retryIn}s</span>
                    {' '}· attempt {attempt} of {MAX_ATTEMPTS}
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <Button variant="outline" onClick={retryNow}>Retry now</Button>
                    <Button variant="ghost" onClick={cancelRetry}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* ── Error ── */}
              {stage === 'error' && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <p className="mb-2 text-base font-semibold text-slate-100">Import failed</p>
                  <p className="mb-6 text-sm text-red-400">{error}</p>
                  <div className="flex items-center justify-center gap-3">
                    {file && (
                      <Button variant="outline" onClick={() => upload(file, 1)}>Try again</Button>
                    )}
                    <Button variant={file ? 'ghost' : 'outline'} onClick={() => setStage('idle')}>Choose another file</Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Bounce keyframe for the active step dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
