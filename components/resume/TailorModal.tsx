'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { X, Sparkles } from 'lucide-react'

interface Props {
  onClose: () => void
  onApply: (summary: string, keywords: string[]) => void
  currentSummary: string
  currentSkills: string
}

export function TailorModal({ onClose, onApply, currentSummary, currentSkills }: Props) {
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ summary: string; keywords: string[] } | null>(null)
  const [error, setError] = useState('')

  async function analyze() {
    if (!jobDescription.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, currentSummary, currentSkills }),
      })
      const data: { summary?: string; keywords?: string[]; error?: string } = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not tailor this resume. Please try again.')
      if (!data.summary?.trim()) throw new Error('The AI did not return a tailored summary. Please try again.')
      setResult({ summary: data.summary, keywords: data.keywords || [] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not tailor this resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-2xl overflow-auto rounded-2xl border border-white/[0.08] shadow-2xl max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-crimson-400" />
            <h2 className="font-display text-xl font-bold text-slate-100">Tailor Resume to Job</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Paste the Job Description</label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
            />
          </div>

          <Button onClick={analyze} loading={loading} disabled={!jobDescription.trim()} className="w-full">
            <Sparkles className="h-4 w-4" />
            Analyze & Generate
          </Button>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {result && (
            <div className="space-y-4 border-t border-white/[0.06] pt-5">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-200">Tailored Summary</h3>
                <div className="rounded-lg border border-crimson-500/20 bg-crimson-500/[0.08] p-4 text-sm text-slate-300">
                  {result.summary}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-200">Keywords to Include</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((kw, i) => (
                    <span key={i} className="rounded-full border border-emerald-500/25 bg-emerald-500/[0.1] px-3 py-1 text-xs font-medium text-emerald-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => onApply(result.summary, result.keywords)} className="flex-1">
                  Apply Tailored Summary
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
