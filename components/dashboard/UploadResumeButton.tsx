'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileUp, X, CheckCircle, AlertCircle, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type Stage = 'idle' | 'dragging' | 'uploading' | 'parsing' | 'done' | 'error'

// Steps shown in the progress view — each maps to a visual row
const STEPS = [
  { key: 'upload',  label: 'Uploading file',          detail: 'Sending to server' },
  { key: 'extract', label: 'Extracting text',          detail: 'Reading document content' },
  { key: 'parse',   label: 'AI parsing resume',        detail: 'DeepSeek AI structuring your data' },
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
  }
  function closeModal() { setShowModal(false) }

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

    setFileName(file.name)
    setFileSize(file.size)
    setStage('uploading')
    setActiveStep('upload')

    const formData = new FormData()
    formData.append('file', file)

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
      if (xhr.status < 200 || xhr.status >= 300) {
        let msg = 'Upload failed'
        try { msg = JSON.parse(xhr.responseText)?.error || msg } catch { /* ignore */ }
        setStage('error')
        setError(msg)
        return
      }

      let data: { id?: string; title?: string; warning?: string } = {}
      try { data = JSON.parse(xhr.responseText) } catch { /* ignore */ }

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
      setStage('error')
      setError('Network error. Please check your connection and try again.')
    })

    xhr.open('POST', '/api/resume/upload')
    xhr.send(formData)
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
      className="group flex h-full min-h-[200px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
    >
      <Upload className="mb-2 h-10 w-10 text-slate-600 transition-colors group-hover:text-violet-400" />
      <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-violet-300">Upload Resume</span>
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
              {(stage === 'idle' || stage === 'dragging' || stage === 'error') && (
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
                        ? 'border-violet-500/60 bg-violet-500/[0.08]'
                        : 'border-white/[0.08] hover:border-violet-500/30 hover:bg-violet-500/[0.04]'
                    }`}
                  >
                    <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${stage === 'dragging' ? 'bg-violet-500/20' : 'bg-white/[0.06]'}`}>
                      <FileUp className={`h-8 w-8 ${stage === 'dragging' ? 'text-violet-400' : 'text-slate-500'}`} />
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
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                      <FileText className="h-4.5 w-4.5 text-violet-400" />
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
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-200"
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
                      const pending = !done && !active

                      return (
                        <div
                          key={step.key}
                          className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all duration-300 ${
                            active  ? 'border border-violet-500/25 bg-violet-500/[0.08]' :
                            done    ? 'border border-emerald-500/15 bg-emerald-500/[0.05]' :
                                      'border border-white/[0.04] bg-white/[0.02] opacity-40'
                          }`}
                        >
                          {/* Status icon */}
                          <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                            done   ? 'bg-emerald-500/20' :
                            active ? 'bg-violet-500/20' :
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
                                    className="h-1 w-1 rounded-full bg-violet-400"
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
                              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-60" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* AI badge shown during parse step */}
                  {activeStep === 'parse' && (
                    <div className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/[0.06] px-3.5 py-2.5">
                      <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
                      <p className="text-xs text-violet-300">
                        DeepSeek AI is structuring your resume data — this usually takes 5–15 seconds
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

              {/* ── Error ── */}
              {stage === 'error' && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <p className="mb-2 text-base font-semibold text-slate-100">Upload failed</p>
                  <p className="mb-6 text-sm text-red-400">{error}</p>
                  <Button variant="outline" onClick={() => setStage('idle')}>Try again</Button>
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
