'use client'
import { TemplateId } from '@/types/resume'
import { Check } from 'lucide-react'

const templates: { id: TemplateId; name: string; color: string; badge?: string }[] = [
  { id: 'modern',        name: 'Modern',        color: 'bg-amber-500' },
  { id: 'classic',       name: 'Classic',       color: 'bg-slate-500' },
  { id: 'minimal',       name: 'Minimal',       color: 'bg-emerald-500' },
  { id: 'creative',      name: 'Creative',      color: 'bg-crimson-500' },
  { id: 'professional',  name: 'Professional',  color: 'bg-amber-600' },
  { id: 'executive',     name: 'Executive',     color: 'bg-slate-700' },
  { id: 'timeline',      name: 'Timeline',      color: 'bg-emerald-400' },
  { id: 'elegant',       name: 'Elegant',       color: 'bg-amber-600' },
  { id: 'compact',       name: 'Compact',       color: 'bg-crimson-500' },
  { id: 'altacv',        name: 'AltaCV',        color: 'bg-red-700',   badge: 'New' },
  { id: 'jakes',         name: "Jake's",         color: 'bg-gray-800',  badge: 'New' },
  { id: 'sixtyseconds',  name: 'SixtySeconds',  color: 'bg-emerald-600',  badge: 'New' },
  { id: 'berlin',        name: 'Berlin',         color: 'bg-slate-700', badge: 'New' },
  { id: 'tokyo',         name: 'Tokyo',          color: 'bg-slate-500',   badge: 'New' },
  { id: 'vienna',        name: 'Vienna',         color: 'bg-crimson-800',  badge: 'New' },
]

interface Props {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplatePicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`relative flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all ${
            value === t.id
              ? 'border-crimson-500/50 bg-crimson-500/15 text-crimson-300'
              : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${t.color}`} />
          {t.name}
          {t.badge && value !== t.id && (
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
              {t.badge}
            </span>
          )}
          {value === t.id && <Check className="h-3.5 w-3.5 text-crimson-400" />}
        </button>
      ))}
    </div>
  )
}
