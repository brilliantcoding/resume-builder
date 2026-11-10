'use client'
import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { TemplateId } from '@/types/resume'
import { sampleResume } from '@/lib/sample-resume'
import { templateRegistry, PAGE_WIDTH, PAGE_HEIGHT } from './templates/registry'
import { Button } from '@/components/ui/Button'
import { Check, X, LayoutGrid, Maximize2, ChevronLeft, ChevronRight, ShieldCheck, Flame, Sparkles } from 'lucide-react'

type TemplateLayout = 'single' | 'split'

export interface TemplateMeta {
  id: TemplateId
  name: string
  tagline: string
  layout: TemplateLayout
  ats: boolean
  popular?: boolean
  isNew?: boolean
}

export const TEMPLATE_CATALOG: TemplateMeta[] = [
  { id: 'modern',        name: 'Modern',        tagline: 'Balanced two-column with a soft accent band', layout: 'split',  ats: false, popular: true },
  { id: 'classic',       name: 'Classic',       tagline: 'Timeless single column with strong rules',    layout: 'single', ats: true,  popular: true },
  { id: 'minimal',       name: 'Minimal',       tagline: 'Airy single column with a slim skills rail',  layout: 'split',  ats: false },
  { id: 'creative',      name: 'Creative',      tagline: 'Bold header with a slim right sidebar',       layout: 'split',  ats: false },
  { id: 'professional',  name: 'Professional',  tagline: 'Corporate single column, crisp section rules', layout: 'single', ats: true,  popular: true },
  { id: 'executive',     name: 'Executive',     tagline: 'Navy sidebar built for senior leadership',    layout: 'split',  ats: false },
  { id: 'timeline',      name: 'Timeline',      tagline: 'Visual career timeline on a teal rail',       layout: 'single', ats: false },
  { id: 'elegant',       name: 'Elegant',       tagline: 'Refined typography with understated gold',    layout: 'single', ats: true },
  { id: 'compact',       name: 'Compact',       tagline: 'Dense two-column that fits it all on a page', layout: 'split',  ats: false },
  { id: 'altacv',        name: 'AltaCV',        tagline: 'Academic 60/40 split with dot skill ratings', layout: 'split',  ats: false, isNew: true },
  { id: 'jakes',         name: "Jake's",         tagline: 'The Overleaf favorite — ATS-tuned single column', layout: 'single', ats: true, popular: true, isNew: true },
  { id: 'sixtyseconds',  name: 'SixtySeconds',  tagline: 'Dark sidebar with skill meters',              layout: 'split',  ats: false, isNew: true },
  { id: 'berlin',        name: 'Berlin',        tagline: 'Charcoal sidebar, resume.io classic',         layout: 'split',  ats: false, isNew: true },
  { id: 'tokyo',         name: 'Tokyo',         tagline: 'Minimal tech layout with skill points',       layout: 'split',  ats: false, isNew: true },
  { id: 'vienna',        name: 'Vienna',        tagline: 'Statement header with a wine accent',         layout: 'split',  ats: false, isNew: true },
]

export function getTemplateName(id: TemplateId): string {
  return TEMPLATE_CATALOG.find((t) => t.id === id)?.name ?? id
}

interface Props {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

const PAGE_RATIO = PAGE_HEIGHT / PAGE_WIDTH

const TemplateThumb = memo(function TemplateThumb({ id, width, className = '' }: { id: TemplateId; width: number; className?: string }) {
  const Template = templateRegistry[id]
  const scale = width / PAGE_WIDTH
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-white ${className}`}
      style={{ width, height: Math.round(width * PAGE_RATIO) }}
      aria-hidden
    >
      <div style={{ width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <Template data={sampleResume} />
      </div>
    </div>
  )
})

function ThumbSkeleton({ width }: { width: number }) {
  return (
    <div
      className="shrink-0 animate-pulse rounded-lg bg-white/[0.06]"
      style={{ width, height: Math.round(width * PAGE_RATIO) }}
    />
  )
}

function MetaChip({ tone, icon, children }: { tone: 'green' | 'amber' | 'blue' | 'slate'; icon?: ReactNode; children: ReactNode }) {
  const tones = {
    green: 'border-crimson-500/30 bg-crimson-500/10 text-crimson-400',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    blue: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    slate: 'border-white/10 bg-white/[0.05] text-slate-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {icon}
      {children}
    </span>
  )
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'popular', label: 'Popular' },
  { id: 'new', label: 'New' },
  { id: 'ats', label: 'ATS-friendly' },
  { id: 'single', label: 'Single column' },
  { id: 'split', label: 'Two column' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

function applyFilter(list: TemplateMeta[], filter: FilterId): TemplateMeta[] {
  switch (filter) {
    case 'popular': return list.filter((t) => t.popular)
    case 'new': return list.filter((t) => t.isNew)
    case 'ats': return list.filter((t) => t.ats)
    case 'single': return list.filter((t) => t.layout === 'single')
    case 'split': return list.filter((t) => t.layout === 'split')
    default: return list
  }
}

function TemplateLightbox({
  templates,
  index,
  onNavigate,
  onUse,
  onClose,
}: {
  templates: TemplateMeta[]
  index: number
  onNavigate: (next: number) => void
  onUse: (id: TemplateId) => void
  onClose: () => void
}) {
  const current = templates[index]
  const [pageWidth, setPageWidth] = useState(560)

  useEffect(() => {
    function fit() {
      setPageWidth(Math.max(280, Math.min(620, window.innerWidth - 140, (window.innerHeight - 210) / PAGE_RATIO)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % templates.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + templates.length) % templates.length)
      if (e.key === 'Enter') onUse(current.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, templates, current, onClose, onNavigate, onUse])

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in" onClick={(e) => { e.stopPropagation(); onClose() }} role="dialog" aria-modal="true" aria-label={`${current.name} template preview`}>
      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Previous template"
          onClick={() => onNavigate((index - 1 + templates.length) % templates.length)}
          className="rounded-full border border-white/10 bg-white/[0.06] p-2.5 text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <TemplateThumb
            key={current.id}
            id={current.id}
            width={pageWidth}
            className="rounded-lg shadow-2xl ring-1 ring-white/15 template-swap"
          />
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-display text-lg font-bold text-white">{current.name}</p>
            <p className="text-sm text-slate-400">{current.tagline}</p>
            <div className="mt-1 flex items-center gap-1.5">
              {current.ats && <MetaChip tone="green" icon={<ShieldCheck className="h-3 w-3" />}>ATS-friendly</MetaChip>}
              {current.popular && <MetaChip tone="amber" icon={<Flame className="h-3 w-3" />}>Popular</MetaChip>}
              {current.isNew && <MetaChip tone="blue" icon={<Sparkles className="h-3 w-3" />}>New</MetaChip>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
            <Button variant="primary" size="sm" onClick={() => onUse(current.id)}>
              <Check className="h-4 w-4" />
              Use {current.name}
            </Button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Next template"
          onClick={() => onNavigate((index + 1) % templates.length)}
          className="rounded-full border border-white/10 bg-white/[0.06] p-2.5 text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function GalleryModal({ value, onPick, onClose }: { value: TemplateId; onPick: (id: TemplateId) => void; onClose: () => void }) {
  const [filter, setFilter] = useState<FilterId>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [thumbsReady, setThumbsReady] = useState(false)
  const visible = useMemo(() => applyFilter(TEMPLATE_CATALOG, filter), [filter])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setThumbsReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && lightbox === null) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-label="Choose a resume template">
      <div
        className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-card shadow-2xl sm:h-auto sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson-500/15">
              <LayoutGrid className="h-5 w-5 text-crimson-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100">Choose a template</h2>
              <p className="text-xs text-slate-500">Live previews — click any design to apply it instantly</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close template gallery" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-5 py-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-crimson-500 text-white shadow-[0_2px_10px_rgba(48,164,108,0.35)]'
                  : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto hidden text-xs text-slate-500 sm:block">{visible.length} of {TEMPLATE_CATALOG.length} templates</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((t) => {
              const selected = t.id === value
              return (
                <div key={t.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onPick(t.id)}
                    className={`block w-full rounded-xl border p-2.5 text-left transition-all duration-300 ${
                      selected
                        ? 'border-crimson-500/60 bg-crimson-500/[0.08] shadow-[0_0_0_1px_rgba(48,164,108,0.4)]'
                        : 'border-white/[0.07] bg-white/[0.02] hover:-translate-y-1 hover:border-white/20 hover:shadow-xl'
                    }`}
                    aria-pressed={selected}
                  >
                    <div className="flex justify-center">
                      {thumbsReady
                        ? <TemplateThumb id={t.id} width={148} className="rounded-md shadow-md ring-1 ring-black/10" />
                        : <ThumbSkeleton width={148} />}
                    </div>
                    <div className="mt-2.5 min-w-0">
                      <p className={`truncate text-sm font-semibold ${selected ? 'text-crimson-400' : 'text-slate-200'}`}>{t.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">{t.tagline}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {selected
                          ? <MetaChip tone="green" icon={<Check className="h-3 w-3" />}>In use</MetaChip>
                          : <>
                            {t.popular && <MetaChip tone="amber" icon={<Flame className="h-3 w-3" />}>Popular</MetaChip>}
                            {t.isNew && <MetaChip tone="blue" icon={<Sparkles className="h-3 w-3" />}>New</MetaChip>}
                            {t.ats && <MetaChip tone="green" icon={<ShieldCheck className="h-3 w-3" />}>ATS</MetaChip>}
                          </>}
                      </div>
                    </div>
                  </button>
                  {!selected && (
                    <button
                      type="button"
                      aria-label={`Preview ${t.name}`}
                      onClick={() => setLightbox(Math.max(0, visible.findIndex((c) => c.id === t.id)))}
                      className="absolute right-4 top-4 rounded-lg bg-black/55 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/75 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {visible.length === 0 && (
            <p className="py-16 text-center text-sm text-slate-500">No templates match this filter.</p>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <TemplateLightbox
          templates={visible}
          index={lightbox}
          onNavigate={setLightbox}
          onUse={(id) => { onPick(id) }}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}

export function TemplatePicker({ value, onChange }: Props) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [thumbsReady, setThumbsReady] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setThumbsReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>('[data-selected="true"]')
    el?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [thumbsReady])

  return (
    <>
      <section className="mb-6 rounded-xl border border-white/[0.07] bg-card p-4" aria-label="Resume template">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-medium text-slate-400">Template</p>
            <span className="rounded-full border border-crimson-500/30 bg-crimson-500/10 px-2.5 py-0.5 text-xs font-semibold text-crimson-400">
              {getTemplateName(value)}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setGalleryOpen(true)}>
            <LayoutGrid className="h-4 w-4 text-crimson-400" />
            Browse all {TEMPLATE_CATALOG.length}
          </Button>
        </div>

        <div ref={scrollRef} className="mt-3 flex gap-3 overflow-x-auto pb-1.5 pt-0.5">
          {TEMPLATE_CATALOG.map((t) => {
            const selected = t.id === value
            return (
              <button
                key={t.id}
                type="button"
                data-selected={selected}
                onClick={() => { if (!selected) onChange(t.id) }}
                title={selected ? `${t.name} (current template)` : `Switch to ${t.name}`}
                aria-label={selected ? `${t.name}, current template` : `Switch to ${t.name} — ${t.tagline}`}
                className="group w-[72px] shrink-0 text-left focus:outline-none"
              >
                <div className={`relative rounded-lg transition-all duration-300 ${selected ? 'ring-2 ring-crimson-500' : 'ring-1 ring-white/10 group-hover:-translate-y-1 group-hover:ring-crimson-500/50'}`}>
                  {thumbsReady
                    ? <TemplateThumb id={t.id} width={72} className="rounded-[6px]" />
                    : <ThumbSkeleton width={72} />}
                  {selected && (
                    <span className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-crimson-500 text-white shadow-md">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                  {!selected && t.isNew && (
                    <span className="absolute right-1 top-1 rounded bg-sky-500 px-1 py-px text-[8px] font-bold leading-tight text-white shadow">
                      New
                    </span>
                  )}
                </div>
                <p className={`mt-1.5 truncate text-[10px] font-medium ${selected ? 'text-crimson-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{t.name}</p>
              </button>
            )
          })}
        </div>
      </section>

      {galleryOpen && (
        <GalleryModal
          value={value}
          onPick={(id) => {
            if (id !== value) onChange(id)
            setGalleryOpen(false)
          }}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  )
}
