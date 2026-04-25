'use client'
import { useState } from 'react'
import { ExperienceEntry } from '@/types/resume'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AIButton } from '@/components/ui/AIButton'
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

function newEntry(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    bullets: [''],
  }
}

interface Props {
  entries: ExperienceEntry[]
  onChange: (entries: ExperienceEntry[]) => void
}

export function ExperienceSection({ entries, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(entries[0]?.id || null)
  const [improvingBullet, setImprovingBullet] = useState<string | null>(null)

  const update = (id: string, field: keyof ExperienceEntry, value: unknown) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  const addBullet = (id: string) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e)))

  const updateBullet = (id: string, idx: number, val: string) =>
    onChange(entries.map((e) => e.id === id ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) } : e))

  const removeBullet = (id: string, idx: number) =>
    onChange(entries.map((e) => e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e))

  const removEntry = (id: string) => onChange(entries.filter((e) => e.id !== id))

  async function improveBullet(entryId: string, idx: number, bullet: string) {
    const key = `${entryId}-${idx}`
    setImprovingBullet(key)
    const entry = entries.find(e => e.id === entryId)
    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, jobTitle: entry?.position }),
      })
      const data = await res.json()
      if (data.improved) updateBullet(entryId, idx, data.improved)
    } finally {
      setImprovingBullet(null)
    }
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="overflow-hidden rounded-xl border border-white/[0.07]">
          <button
            type="button"
            className="flex w-full items-center justify-between bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.05]"
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <div className="text-left">
              <p className="text-sm font-medium text-slate-200">
                {entry.position || 'New Position'} {entry.company ? `@ ${entry.company}` : ''}
              </p>
              <p className="text-xs text-slate-500">{entry.startDate} {entry.startDate && '—'} {entry.current ? 'Present' : entry.endDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removEntry(entry.id) }}
                className="rounded p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expanded === entry.id ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </div>
          </button>

          {expanded === entry.id && (
            <div className="space-y-4 border-t border-white/[0.06] px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Position / Title" value={entry.position} onChange={(e) => update(entry.id, 'position', e.target.value)} placeholder="Software Engineer" />
                <Input label="Company" value={entry.company} onChange={(e) => update(entry.id, 'company', e.target.value)} placeholder="Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date" value={entry.startDate} onChange={(e) => update(entry.id, 'startDate', e.target.value)} placeholder="Jan 2021" />
                <div>
                  <Input label="End Date" value={entry.endDate} onChange={(e) => update(entry.id, 'endDate', e.target.value)} placeholder="Dec 2023" disabled={entry.current} />
                  <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                    <input type="checkbox" checked={entry.current} onChange={(e) => update(entry.id, 'current', e.target.checked)} className="rounded" />
                    Currently working here
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Bullet Points</label>
                  <button type="button" onClick={() => addBullet(entry.id)} className="flex items-center gap-1 text-xs text-violet-400 hover:underline">
                    <Plus className="h-3 w-3" /> Add bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {entry.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="mt-2 text-lg leading-none text-slate-600">•</span>
                      <textarea
                        value={bullet}
                        onChange={(e) => updateBullet(entry.id, idx, e.target.value)}
                        placeholder="Developed a feature that increased performance by 40%..."
                        rows={2}
                        className="flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="flex flex-col gap-1 mt-1">
                        <button
                          type="button"
                          title="Improve with AI"
                          onClick={() => improveBullet(entry.id, idx, bullet)}
                          disabled={!bullet || improvingBullet === `${entry.id}-${idx}`}
                          className="p-1 rounded text-violet-500 hover:text-violet-700 disabled:opacity-40"
                        >
                          {improvingBullet === `${entry.id}-${idx}` ? (
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          ) : <Sparkles className="h-3.5 w-3.5" />}
                        </button>
                        <button type="button" onClick={() => removeBullet(entry.id, idx)} className="p-1 rounded text-red-400 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={() => {
        const entry = newEntry()
        onChange([...entries, entry])
        setExpanded(entry.id)
      }}>
        <Plus className="h-4 w-4" /> Add Experience
      </Button>
    </div>
  )
}
