'use client'
import { CertificationEntry } from '@/types/resume'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'

function newEntry(): CertificationEntry {
  return { id: crypto.randomUUID(), name: '', issuer: '', date: '', url: '' }
}

interface Props {
  entries: CertificationEntry[]
  onChange: (entries: CertificationEntry[]) => void
}

export function CertificationsSection({ entries, onChange }: Props) {
  const update = (id: string, field: keyof CertificationEntry, value: string) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900 text-sm">{entry.name || 'New Certification'}</p>
            <button
              type="button"
              onClick={() => onChange(entries.filter((e) => e.id !== entry.id))}
              className="p-1 text-red-400 hover:text-red-600 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Input
            label="Certification / Accomplishment"
            value={entry.name}
            onChange={(e) => update(entry.id, 'name', e.target.value)}
            placeholder="AWS Certified Solutions Architect"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Issuer (optional)"
              value={entry.issuer}
              onChange={(e) => update(entry.id, 'issuer', e.target.value)}
              placeholder="Amazon Web Services"
            />
            <Input
              label="Date (optional)"
              value={entry.date}
              onChange={(e) => update(entry.id, 'date', e.target.value)}
              placeholder="2023"
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...entries, newEntry()])}
      >
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  )
}
