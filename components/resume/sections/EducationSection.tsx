'use client'
import { useState } from 'react'
import { EducationEntry } from '@/types/resume'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

function newEntry(): EducationEntry {
  return { id: crypto.randomUUID(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', honors: '' }
}

interface Props {
  entries: EducationEntry[]
  onChange: (entries: EducationEntry[]) => void
}

export function EducationSection({ entries, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(entries[0]?.id || null)

  const update = (id: string, field: keyof EducationEntry, value: string) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">{entry.institution || 'New School'}</p>
              <p className="text-xs text-gray-500">{entry.degree} {entry.field ? `in ${entry.field}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); onChange(entries.filter(e => e.id !== entry.id)) }} className="p-1 text-red-400 hover:text-red-600 rounded">
                <Trash2 className="h-4 w-4" />
              </button>
              {expanded === entry.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>

          {expanded === entry.id && (
            <div className="px-4 py-4 space-y-4">
              <Input label="Institution" value={entry.institution} onChange={(e) => update(entry.id, 'institution', e.target.value)} placeholder="MIT" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Degree" value={entry.degree} onChange={(e) => update(entry.id, 'degree', e.target.value)} placeholder="Bachelor of Science" />
                <Input label="Field of Study" value={entry.field} onChange={(e) => update(entry.id, 'field', e.target.value)} placeholder="Computer Science" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date" value={entry.startDate} onChange={(e) => update(entry.id, 'startDate', e.target.value)} placeholder="Sep 2018" />
                <Input label="End Date" value={entry.endDate} onChange={(e) => update(entry.id, 'endDate', e.target.value)} placeholder="May 2022" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="GPA (optional)" value={entry.gpa || ''} onChange={(e) => update(entry.id, 'gpa', e.target.value)} placeholder="3.9/4.0" />
                <Input label="Honors (optional)" value={entry.honors || ''} onChange={(e) => update(entry.id, 'honors', e.target.value)} placeholder="Magna Cum Laude" />
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
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  )
}
