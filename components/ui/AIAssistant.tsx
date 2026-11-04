'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, FileText, PenLine, Sparkles, Target, X } from 'lucide-react'
import { dispatchAssistantEvent, type AssistantAction, type AssistantResult, type AssistantSuggestion } from './assistantEvents'

const actions: { id: AssistantAction; label: string; description: string; icon: typeof Sparkles }[] = [
  { id: 'generate-summary', label: 'Draft a summary', description: 'Use your resume details', icon: FileText },
  { id: 'improve-bullet', label: 'Improve a bullet', description: 'Strengthen your first experience bullet', icon: PenLine },
  { id: 'tailor-resume', label: 'Tailor to a job', description: 'Match your summary to a job post', icon: Target },
  { id: 'check-ats', label: 'Check ATS readiness', description: 'Review formatting and content gaps', icon: BarChart3 },
]

export function FloatingAIAssistant() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<AssistantAction | 'apply' | null>(null)
  const [result, setResult] = useState<AssistantResult | null>(null)
  const isResumeEditor = Boolean(pathname?.startsWith('/resume/') && pathname !== '/resume/new')

  function runAction(action: AssistantAction) {
    setPendingAction(action)
    setResult(null)
    const handled = dispatchAssistantEvent({
      type: 'action',
      action,
      respond: (response) => {
        setPendingAction(null)
        setResult(response)
      },
    })
    if (handled) {
      setPendingAction(null)
      setResult({ message: 'Open a resume in the editor to use this action.' })
    }
  }

  function applySuggestion(suggestion: AssistantSuggestion) {
    setPendingAction('apply')
    dispatchAssistantEvent({
      type: 'apply',
      suggestion,
      respond: (response) => {
        setPendingAction(null)
        setResult(response)
      },
    })
  }

  if (isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] animate-fade-in sm:bottom-6 sm:right-6">
        <div className="resume-assistant-panel max-h-[min(82vh,42rem)] overflow-y-auto rounded-2xl border border-default shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-default bg-card px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-lg shadow-crimson-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-primary">Resume assistant</h3>
                <p className="text-[10px] text-muted">{isResumeEditor ? 'Actions for this resume' : 'Practical help for your resume'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            {isResumeEditor ? (
              <>
                <p className="text-sm leading-relaxed text-secondary">
                  Choose an action. AI drafts are shown for review and won&apos;t change your resume until you apply them.
                </p>
                <div className="grid gap-2">
                  {actions.map(({ id, label, description, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      disabled={pendingAction !== null}
                      onClick={() => runAction(id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-default bg-card p-3 text-left transition-all hover:border-crimson-500/35 hover:bg-crimson-500/[0.04] disabled:cursor-wait disabled:opacity-60"
                    >
                      <div className="rounded-lg bg-crimson-500/10 p-2 text-crimson-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-primary">{label}</p>
                        <p className="mt-0.5 text-xs text-muted">{description}</p>
                      </div>
                      {pendingAction === id && <span className="text-xs text-muted">Working…</span>}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-secondary">
                  The assistant works with the resume you&apos;re editing. Open your workspace to generate and review content, tailor it to a job, or check ATS readiness.
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="btn-gradient flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Open my resumes <FileText className="h-4 w-4" />
                </Link>
              </div>
            )}

            {result && (
              <div className="space-y-3 rounded-xl border border-crimson-500/20 bg-crimson-500/[0.04] p-3.5" role="status" aria-live="polite">
                <p className="text-sm leading-relaxed text-primary">{result.message}</p>
                {result.suggestion && (
                  <>
                    <div className="rounded-lg border border-default bg-card p-3 text-sm leading-relaxed text-secondary">
                      {result.suggestion.text}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={pendingAction !== null}
                        onClick={() => {
                          if (result.suggestion) applySuggestion(result.suggestion)
                        }}
                        className="btn-gradient flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {pendingAction === 'apply' ? 'Applying…' : 'Apply suggestion'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setResult(null)}
                        className="rounded-lg border border-default px-3 py-2 text-sm font-medium text-secondary hover:bg-surface"
                      >
                        Discard
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-50 group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-crimson-500 to-crimson-700 text-white shadow-2xl shadow-crimson-500/30 transition-all hover:scale-110 hover:shadow-crimson-500/50 active:scale-95"
      aria-label="Open AI Assistant"
    >
      <Sparkles className="h-6 w-6 transition-transform group-hover:animate-bounce" />
    </button>
  )
}
