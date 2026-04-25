'use client'
import { PersonalInfo } from '@/types/resume'
import { Input } from '@/components/ui/Input'

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalInfoSection({ data, onChange }: Props) {
  const set = (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={data.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
        <Input label="Job Title" value={data.jobTitle || ''} onChange={set('jobTitle')} placeholder="Software Engineer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Email" type="email" value={data.email} onChange={set('email')} placeholder="jane@example.com" />
        <Input label="Phone" type="tel" value={data.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
      </div>
      <Input label="Location" value={data.location} onChange={set('location')} placeholder="San Francisco, CA" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Website" value={data.website || ''} onChange={set('website')} placeholder="yoursite.com" />
        <Input label="LinkedIn" value={data.linkedin || ''} onChange={set('linkedin')} placeholder="linkedin.com/in/jane" />
        <Input label="GitHub" value={data.github || ''} onChange={set('github')} placeholder="github.com/jane" />
      </div>
    </div>
  )
}
