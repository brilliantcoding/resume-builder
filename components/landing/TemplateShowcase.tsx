'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Layout } from 'lucide-react'

const filters = ['All templates', 'ATS-friendly', 'Modern', 'Creative'] as const
type TemplateFilter = (typeof filters)[number]

const filterTemplateIds: Record<Exclude<TemplateFilter, 'All templates'>, Set<string>> = {
  'ATS-friendly': new Set(['classic', 'minimal', 'professional', 'executive', 'compact', 'jakes', 'berlin', 'tokyo', 'vienna']),
  Modern: new Set(['modern', 'creative', 'executive', 'timeline', 'compact', 'altacv', 'sixtyseconds', 'berlin', 'tokyo', 'vienna']),
  Creative: new Set(['creative', 'elegant', 'altacv', 'timeline', 'sixtyseconds']),
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean sidebar with accent colors',
    ring: 'ring-crimson-400/40',
    label: 'Most Popular',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="p-3.5 h-full">
        <div className="flex gap-2.5 h-full">
          <div className="w-[38%] bg-crimson-700 rounded-md p-2.5">
            <div className="w-7 h-7 bg-white/30 rounded-full mb-2" />
            <div className="h-1.5 bg-white/70 rounded mb-1 w-full" />
            <div className="h-1 bg-white/50 rounded mb-3 w-3/4" />
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-white/30 rounded mb-1.5" />)}
          </div>
          <div className="flex-1 pt-1">
            <div className="h-1.5 bg-gray-700 rounded mb-1 w-3/4" />
            <div className="h-1 bg-gray-300 rounded mb-3 w-1/2" />
            <div className="h-1 bg-crimson-300 rounded mb-2 w-1/3" />
            {[1,2,3,4,5].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'ATS-optimized single column',
    ring: 'ring-gray-400/40',
    label: 'ATS Safe',
    labelColor: 'bg-gray-500/20 text-gray-300',
    preview: (
      <div className="p-3.5">
        <div className="text-center mb-3">
          <div className="h-2 bg-gray-800 rounded mx-auto w-1/2 mb-1" />
          <div className="h-1 bg-gray-400 rounded mx-auto w-1/3 mb-2" />
          <div className="h-px bg-gray-300 w-full" />
        </div>
        <div className="mb-3">
          <div className="h-1.5 bg-gray-700 rounded w-1/4 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
        <div>
          <div className="h-1.5 bg-gray-700 rounded w-1/4 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Elegant whitespace design',
    ring: 'ring-emerald-400/40',
    label: 'Clean',
    labelColor: 'bg-emerald-500/20 text-emerald-300',
    preview: (
      <div className="p-3.5">
        <div className="mb-3">
          <div className="h-2 bg-emerald-700 rounded w-2/3 mb-1" />
          <div className="h-1 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-px bg-emerald-500 mb-3" />
        </div>
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className={`h-1 bg-gray-200 rounded mb-2 ${i % 3 === 0 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </div>
    ),
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold for creative industries',
    ring: 'ring-crimson-400/40',
    label: 'Bold',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="h-full">
        <div className="bg-crimson-500 p-3 rounded-t-md mb-2">
          <div className="h-2 bg-white/90 rounded w-1/2 mb-1" />
          <div className="h-1 bg-white/60 rounded w-1/3" />
        </div>
        <div className="px-3 flex gap-2">
          <div className="flex-1">
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
          <div className="w-1/3">
            <div className="h-1.5 bg-crimson-400 rounded mb-1.5 w-full" />
            {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Senior-level professional design',
    ring: 'ring-slate-400/40',
    label: 'Senior',
    labelColor: 'bg-slate-500/20 text-slate-300',
    preview: (
      <div className="h-full">
        <div className="bg-slate-800 p-3 rounded-t-md mb-2">
          <div className="h-2 bg-white/90 rounded w-3/4 mb-1" />
          <div className="h-1 bg-white/60 rounded w-1/2" />
        </div>
        <div className="px-3">
          <div className="h-px bg-slate-600 mb-3" />
          <div className="h-1.5 bg-slate-500 rounded w-1/2 mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'timeline',
    name: 'Timeline',
    desc: 'Chronological career layout',
    ring: 'ring-emerald-400/40',
    label: 'Chronological',
    labelColor: 'bg-emerald-500/20 text-emerald-300',
    preview: (
      <div className="h-full">
        <div className="bg-emerald-700 p-3 rounded-t-md mb-2">
          <div className="h-2 bg-white/90 rounded w-1/2 mb-1" />
          <div className="h-1 bg-white/60 rounded w-1/3" />
        </div>
        <div className="px-3">
          <div className="h-px bg-emerald-500 mb-3" />
          <div className="h-1.5 bg-emerald-400 rounded w-1/3 mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Sophisticated serif typography',
    ring: 'ring-crimson-400/40',
    label: 'Sophisticated',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="h-full flex flex-col">
        <div className="bg-crimson-800 p-2.5">
          <div className="h-2 bg-white/90 rounded w-2/3 mb-0.5" />
          <div className="h-1 bg-white/60 rounded w-1/2" />
        </div>
        <div className="flex-1 px-2.5 mt-1">
          <div className="h-px bg-crimson-500 mb-2" />
          <div className="h-1 bg-gray-200 rounded mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'compact',
    name: 'Compact',
    desc: 'Dense two-column layout',
    ring: 'ring-crimson-400/40',
    label: 'Info-Dense',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="h-full flex flex-col rounded-md overflow-hidden">
        <div className="bg-crimson-700 p-2.5">
          <div className="h-1.5 bg-white/80 rounded w-2/5 mb-1" />
          <div className="h-1 bg-white/50 rounded w-1/3" />
        </div>
        <div className="flex flex-1">
          <div className="w-[38%] bg-crimson-50 p-2 border-r border-crimson-100">
            <div className="bg-crimson-600 rounded px-1.5 py-0.5 mb-1.5">
              <div className="h-1 bg-white/80 rounded w-2/3" />
            </div>
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-300 rounded mb-1.5" />)}
            <div className="bg-crimson-600 rounded px-1.5 py-0.5 mb-1.5 mt-1.5">
              <div className="h-1 bg-white/80 rounded w-2/3" />
            </div>
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-300 rounded mb-1.5" />)}
          </div>
          <div className="flex-1 p-2">
            <div className="h-1.5 bg-crimson-600 rounded w-1/3 mb-2" />
            {[1,2,3,4,5].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Traditional serif ATS layout',
    ring: 'ring-crimson-400/40',
    label: 'Traditional',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="p-3.5">
        <div className="text-center mb-2.5">
          <div className="h-2 bg-crimson-900 rounded mx-auto w-2/3 mb-1" />
          <div className="h-1 bg-gray-400 rounded mx-auto w-1/3 mb-1" />
          <div className="h-1 bg-gray-300 rounded mx-auto w-1/2" />
        </div>
        <div className="border-t border-gray-700 pt-2 mb-2">
          <div className="h-1.5 bg-gray-800 rounded w-1/3 mb-1.5" />
          <div className="h-1 bg-gray-300 rounded mb-2" />
          <div className="h-1 bg-gray-300 rounded w-2/3" />
        </div>
        <div className="h-px bg-gray-700 mb-2" />
        <div className="h-1 bg-gray-200 rounded w-1/4 mb-1.5" />
        {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
      </div>
    ),
  },
  {
    id: 'altacv',
    name: 'AltaCV',
    desc: 'Modern two-column design',
    ring: 'ring-crimson-400/40',
    label: 'Modern',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="h-full">
        <div className="bg-crimson-700 p-3 rounded-t-md mb-2">
          <div className="h-2 bg-white/90 rounded w-1/2 mb-1" />
          <div className="h-1 bg-white/60 rounded w-1/3" />
        </div>
        <div className="px-3 flex gap-2">
          <div className="w-[40%]">
            <div className="h-1.5 bg-crimson-500 rounded mb-1.5 w-full" />
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
          <div className="flex-1">
            <div className="h-1.5 bg-gray-700 rounded mb-1 w-3/4" />
            <div className="h-1 bg-gray-300 rounded mb-1.5 w-1/2" />
            <div className="h-1 bg-crimson-300 rounded mb-1.5 w-1/3" />
            {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'jakes',
    name: "Jake's",
    desc: 'Clean minimal layout',
    ring: 'ring-gray-400/40',
    label: 'Minimal',
    labelColor: 'bg-gray-500/20 text-gray-300',
    preview: (
      <div className="p-3.5">
        <div className="mb-3">
          <div className="h-2 bg-gray-800 rounded w-1/2 mb-1" />
          <div className="h-1 bg-gray-400 rounded w-1/3 mb-2" />
          <div className="h-px bg-gray-300 w-full" />
        </div>
        <div className="mb-3">
          <div className="h-1.5 bg-gray-700 rounded w-1/4 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
        <div>
          <div className="h-1.5 bg-gray-700 rounded w-1/4 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'sixtyseconds',
    name: 'SixtySeconds',
    desc: 'Fast, clean layout',
    ring: 'ring-emerald-400/40',
    label: 'Fast',
    labelColor: 'bg-emerald-500/20 text-emerald-300',
    preview: (
      <div className="h-full flex flex-col">
        <div className="bg-emerald-700 p-2.5">
          <div className="h-2 bg-white/90 rounded w-1/2 mb-0.5" />
          <div className="h-1 bg-white/60 rounded w-1/3" />
        </div>
        <div className="flex-1 px-2.5 mt-1">
          <div className="h-px bg-emerald-500 mb-2" />
          <div className="h-1 bg-emerald-400 rounded w-1/3 mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'berlin',
    name: 'Berlin',
    desc: 'Urban style layout',
    ring: 'ring-slate-400/40',
    label: 'Urban',
    labelColor: 'bg-slate-500/20 text-slate-300',
    preview: (
      <div className="h-full flex flex-col">
        <div className="bg-slate-700 p-3">
          <div className="h-2 bg-white/90 rounded w-2/3 mb-1" />
          <div className="h-1 bg-white/60 rounded w-1/2" />
        </div>
        <div className="flex-1 px-3 mt-1">
          <div className="h-px bg-slate-500 mb-2" />
          <div className="h-1 bg-gray-200 rounded mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    desc: 'Clean city-inspired layout',
    ring: 'ring-slate-400/40',
    label: 'City',
    labelColor: 'bg-slate-500/20 text-slate-300',
    preview: (
      <div className="h-full flex flex-col">
        <div className="bg-slate-600 p-2.5">
          <div className="h-2 bg-white/90 rounded w-2/3 mb-0.5" />
          <div className="h-1 bg-white/60 rounded w-1/2" />
        </div>
        <div className="flex-1 px-2.5 mt-1">
          <div className="h-px bg-slate-400 mb-2" />
          <div className="h-1 bg-gray-200 rounded mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'vienna',
    name: 'Vienna',
    desc: 'Classic European style',
    ring: 'ring-crimson-400/40',
    label: 'Classic',
    labelColor: 'bg-crimson-500/20 text-crimson-300',
    preview: (
      <div className="h-full flex flex-col">
        <div className="bg-crimson-700 p-2.5">
          <div className="h-2 bg-white/90 rounded w-1/2 mb-0.5" />
          <div className="h-1 bg-white/60 rounded w-1/2" />
        </div>
        <div className="flex-1 px-2.5 mt-1">
          <div className="h-px bg-crimson-500 mb-2" />
          <div className="h-1 bg-crimson-400 rounded w-1/3 mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
]

export function TemplateShowcase() {
  const [activeFilter, setActiveFilter] = useState<TemplateFilter>('All templates')
  const visibleTemplates = templates.filter((template) =>
    activeFilter === 'All templates' || filterTemplateIds[activeFilter].has(template.id),
  )

  return (
    <section id="templates" className="relative overflow-hidden bg-background py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-crimson-500/20 bg-crimson-500/[0.07] px-3 py-1 text-xs font-semibold text-crimson-300">
              <Layout className="h-3.5 w-3.5 text-crimson-500" />
              {templates.length} polished, ATS-friendly designs
            </div>
            <h2 className="font-display mb-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              A resume that looks like you
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-secondary sm:text-lg">
              Explore clean, recruiter-friendly layouts for every career stage. Pick a style and make it your own.
            </p>
          </div>

          <div aria-label="Filter templates" className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'border-crimson-600 bg-crimson-600 text-white shadow-sm shadow-crimson-600/20'
                    : 'border-default bg-card text-secondary hover:border-crimson-500/40 hover:text-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="mb-4 text-xs font-medium text-muted">
          Showing {visibleTemplates.length} of {templates.length} templates
        </div>
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTemplates.map((t) => (
            <Link
              href="/register"
              key={t.id}
              className="group rounded-2xl border border-default bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-crimson-500/30 hover:shadow-xl hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="h-full overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/[0.04]">
                {t.preview}
                </div>

                <div className="absolute right-2 top-2">
                  <span className="rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                    {t.label}
                  </span>
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-3">
                <div>
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{t.desc}</p>
                </div>
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-default text-secondary transition-all group-hover:border-crimson-600 group-hover:bg-crimson-600 group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/register">
            <button className="btn-gradient group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
              Build your resume with a template
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
