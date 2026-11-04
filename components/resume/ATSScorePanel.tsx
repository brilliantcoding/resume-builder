'use client'
import { useMemo, useState } from 'react'
import { ResumeData } from '@/types/resume'
import { calculateATSScore, ATSResult, ScoreCategory } from '@/lib/ats-score'
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react'

interface Props {
  data: ResumeData
  onSectionClick?: (section: string) => void
}

// ── SVG circular gauge ────────────────────────────────────────────────────────

function CircularGauge({ score, grade }: { score: number; grade: ATSResult['grade'] }) {
  const r = 52
  const cx = 64
  const cy = 64
  const circumference = 2 * Math.PI * r
  // Arc spans 240° (leaving 120° gap at bottom)
  const arcLength = circumference * (240 / 360)
  const filled = arcLength * (score / 100)
  // Rotate so the arc starts at -210° (bottom-left) and fills clockwise
  const rotation = -210

  const trackColor = '#1E1E3A'
  const fillColor =
    grade === 'excellent' ? '#DC2626' :
    grade === 'good'      ? '#059669' :
    grade === 'fair'      ? '#D97706' :
                            '#DC2626'

  const gradeLabel = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  }[grade]

  const gradeColor = {
    excellent: 'text-crimson-400',
    good: 'text-emerald-400',
    fair: 'text-amber-400',
    poor: 'text-red-400',
  }[grade]

  return (
    <div className="relative flex flex-col items-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        {/* Track arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth="10"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`}
        />
        {/* Filled arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth="10"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)' }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="inherit">
          {score}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="inherit">
          out of 100
        </text>
      </svg>
      <span className={`-mt-1 text-xs font-bold uppercase tracking-wider ${gradeColor}`}>{gradeLabel}</span>
    </div>
  )
}

// ── Category row ──────────────────────────────────────────────────────────────

function CategoryRow({ cat, onSectionClick }: { cat: ScoreCategory; onSectionClick?: (section: string) => void }) {
  const [open, setOpen] = useState(false)
  const pct = cat.max > 0 ? (cat.score / cat.max) * 100 : 0

  const barColor =
    pct >= 80 ? 'from-crimson-500 to-amber-500' :
    pct >= 60 ? 'from-emerald-500 to-teal-500' :
    pct >= 40 ? 'from-amber-500 to-orange-500' :
                'from-red-500 to-rose-500'

  const sectionMap: Record<string, string> = {
    contact: 'personal',
    experience: 'experience',
    education: 'education',
    skills: 'skills',
    summary: 'summary',
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
      >
        {/* Progress bar + label */}
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">{cat.label}</span>
            <span className="text-xs text-slate-500">{cat.score}/{cat.max}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0 text-slate-600" /> : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-slate-600" />}
      </button>

      {open && (
        <div className="border-t border-white/[0.05] px-3.5 pb-3 pt-2.5 space-y-1.5">
          {cat.details.map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
              <span className="text-[11px] text-slate-400">{d}</span>
            </div>
          ))}
          {cat.missing.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
              <span className="text-[11px] text-slate-400">{m}</span>
            </div>
          ))}
          {onSectionClick && sectionMap[cat.id] && (
            <button
              type="button"
              onClick={() => onSectionClick(sectionMap[cat.id])}
              className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-crimson-400 hover:text-crimson-300 transition-colors"
            >
              Go to {cat.label} section
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function ATSScorePanel({ data, onSectionClick }: Props) {
  const result: ATSResult = useMemo(() => calculateATSScore(data), [data])
  const [showInfo, setShowInfo] = useState(false)

  const priorityBadge = {
    high:   'bg-red-500/15 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    low:    'bg-slate-500/10 text-slate-400 border-slate-500/15',
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-600/40 to-amber-600/30">
            <svg className="h-3.5 w-3.5 text-crimson-300" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z"/>
              <path d="M8 4a.75.75 0 01.75.75v3.5l2 1.15a.75.75 0 01-.75 1.3l-2.25-1.3A.75.75 0 017.25 8.75v-4A.75.75 0 018 4z"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-200">ATS Score</span>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-colors"
        >
          <Info className="h-3 w-3" />
          What is ATS?
        </button>
      </div>

      {/* Info accordion */}
      {showInfo && (
        <div className="border-b border-white/[0.06] bg-card px-5 py-3.5 text-[12px] leading-relaxed text-slate-400">
          <p className="mb-1.5 font-semibold text-slate-300">Applicant Tracking System (ATS)</p>
          <p>
            Most companies use software to automatically scan and rank resumes before a human ever reads them.
            The score here reflects how well your resume is optimized for these systems — checking for
            contact completeness, strong action verbs, quantified achievements, keyword density, and
            section structure.
          </p>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Scores are calculated locally from your resume data — no data is sent externally.
          </p>
        </div>
      )}

      <div className="px-5 py-5 space-y-5">
        {/* Gauge + grade */}
        <div className="flex items-center justify-between gap-4">
          <CircularGauge score={result.total} grade={result.grade} />

          {/* Quick stats */}
          <div className="flex-1 space-y-2">
            {result.categories.map((cat) => {
              const pct = cat.max > 0 ? Math.round((cat.score / cat.max) * 100) : 0
              const dotColor =
                pct >= 80 ? 'bg-crimson-400' :
                pct >= 60 ? 'bg-emerald-400' :
                pct >= 40 ? 'bg-amber-400' :
                            'bg-red-400'
              return (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotColor}`} />
                  <span className="flex-1 min-w-0 truncate text-[11px] text-slate-400">{cat.label}</span>
                  <span className="text-[11px] font-medium text-slate-300">{cat.score}<span className="text-slate-600">/{cat.max}</span></span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category breakdowns */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Breakdown</p>
          {result.categories.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} onSectionClick={onSectionClick} />
          ))}
        </div>

        {/* Suggestions */}
        {result.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Top Suggestions</p>
            <div className="space-y-2">
              {result.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                >
                  <span className={`mt-0.5 flex-shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${priorityBadge[s.priority]}`}>
                    {s.priority}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] leading-relaxed text-slate-300">{s.text}</p>
                    {onSectionClick && (
                      <button
                        type="button"
                        onClick={() => onSectionClick(s.section)}
                        className="mt-1 text-[10px] font-medium text-crimson-400 hover:text-crimson-300 transition-colors"
                      >
                        Fix in {s.section} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
