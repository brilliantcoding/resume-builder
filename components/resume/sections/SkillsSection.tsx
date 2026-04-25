'use client'
import { useState } from 'react'
import { SkillGroup } from '@/types/resume'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AIButton } from '@/components/ui/AIButton'
import { Plus, Trash2, X } from 'lucide-react'

function newGroup(): SkillGroup {
  return { id: crypto.randomUUID(), category: '', skills: [] }
}

interface Props {
  groups: SkillGroup[]
  jobTitle?: string
  onChange: (groups: SkillGroup[]) => void
}

export function SkillsSection({ groups, jobTitle, onChange }: Props) {
  const [newSkill, setNewSkill] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const updateGroup = (id: string, field: keyof SkillGroup, value: unknown) =>
    onChange(groups.map((g) => (g.id === id ? { ...g, [field]: value } : g)))

  const addSkill = (groupId: string) => {
    const skill = newSkill[groupId]?.trim()
    if (!skill) return
    const group = groups.find((g) => g.id === groupId)!
    updateGroup(groupId, 'skills', [...group.skills, skill])
    setNewSkill((prev) => ({ ...prev, [groupId]: '' }))
  }

  const removeSkill = (groupId: string, idx: number) => {
    const group = groups.find((g) => g.id === groupId)!
    updateGroup(groupId, 'skills', group.skills.filter((_, i) => i !== idx))
  }

  async function suggestSkills() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle }),
      })
      const data = await res.json()
      if (data.skills) {
        const newGroups: SkillGroup[] = []
        if (data.skills.technical?.length) {
          newGroups.push({ id: crypto.randomUUID(), category: 'Technical Skills', skills: data.skills.technical })
        }
        if (data.skills.soft?.length) {
          newGroups.push({ id: crypto.randomUUID(), category: 'Soft Skills', skills: data.skills.soft })
        }
        onChange([...groups, ...newGroups])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AIButton loading={loading} onClick={suggestSkills} label="Suggest Skills with AI" />
      </div>

      {groups.map((group) => (
        <div key={group.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={group.category}
              onChange={(e) => updateGroup(group.id, 'category', e.target.value)}
              placeholder="e.g. Technical Skills, Languages..."
              className="flex-1"
            />
            <button type="button" onClick={() => onChange(groups.filter((g) => g.id !== group.id))} className="p-1.5 text-red-400 hover:text-red-600 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full">
                {skill}
                <button type="button" onClick={() => removeSkill(group.id, idx)} className="hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSkill[group.id] || ''}
              onChange={(e) => setNewSkill((prev) => ({ ...prev, [group.id]: e.target.value }))}
              placeholder="Add a skill..."
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(group.id) } }}
            />
            <Button variant="outline" size="sm" onClick={() => addSkill(group.id)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={() => onChange([...groups, newGroup()])}>
        <Plus className="h-4 w-4" /> Add Skill Group
      </Button>
    </div>
  )
}
