'use client'
import { useState } from 'react'
import { Textarea } from '@/components/ui/Input'
import { AIButton } from '@/components/ui/AIButton'

interface Props {
  summary: string
  jobTitle?: string
  onChange: (summary: string) => void
}

export function SummarySection({ summary, jobTitle, onChange }: Props) {
  const [loading, setLoading] = useState(false)

  async function generateSummary() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, experience: '5 years', skills: '' }),
      })
      const data = await res.json()
      if (data.summary) onChange(data.summary)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Write a compelling 2-3 sentence professional summary.</span>
        <AIButton loading={loading} onClick={generateSummary} label="Generate with AI" />
      </div>
      <Textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Experienced software engineer with 5+ years building scalable web applications..."
        rows={4}
      />
    </div>
  )
}
