'use client'
import { useState } from 'react'
import { ProjectEntry } from '@/types/resume'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'

function newEntry(): ProjectEntry {
  return { id: crypto.randomUUID(), name: '', description: '', technologies: [], url: '', github: '' }
}

interface Props {
  entries: ProjectEntry[]
  onChange: (entries: ProjectEntry[]) => void
}

export function ProjectsSection({ entries, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [techInput, setTechInput] = useState<Record<string, string>>({})

  const update = (id: string, field: keyof ProjectEntry, value: unknown) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  const addTech = (id: string) => {
    const tech = techInput[id]?.trim()
    if (!tech) return
    const entry = entries.find((e) => e.id === id)!
    update(id, 'technologies', [...entry.technologies, tech])
    setTechInput((prev) => ({ ...prev, [id]: '' }))
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <p className="font-medium text-gray-900 text-sm">{entry.name || 'New Project'}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); onChange(entries.filter(e => e.id !== entry.id)) }} className="p-1 text-red-400 hover:text-red-600 rounded">
                <Trash2 className="h-4 w-4" />
              </button>
              {expanded === entry.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>

          {expanded === entry.id && (
            <div className="px-4 py-4 space-y-3">
              <Input label="Project Name" value={entry.name} onChange={(e) => update(entry.id, 'name', e.target.value)} placeholder="My Awesome Project" />
              <Textarea label="Description" value={entry.description} onChange={(e) => update(entry.id, 'description', e.target.value)} placeholder="A brief description of what this project does..." rows={3} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Live URL (optional)" value={entry.url || ''} onChange={(e) => update(entry.id, 'url', e.target.value)} placeholder="https://..." />
                <Input label="GitHub URL (optional)" value={entry.github || ''} onChange={(e) => update(entry.id, 'github', e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Technologies Used</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {entry.technologies.map((tech, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2.5 py-1 rounded-full">
                      {tech}
                      <button type="button" onClick={() => update(entry.id, 'technologies', entry.technologies.filter((_, i) => i !== idx))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={techInput[entry.id] || ''} onChange={(e) => setTechInput((prev) => ({ ...prev, [entry.id]: e.target.value }))} placeholder="React, TypeScript..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(entry.id) } }} />
                  <Button variant="outline" size="sm" onClick={() => addTech(entry.id)}><Plus className="h-4 w-4" /></Button>
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
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  )
}
