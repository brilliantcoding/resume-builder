'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ResumeData, TemplateId, defaultResumeData } from '@/types/resume'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { TemplatePicker } from './TemplatePicker'
import { ResumePreview } from './ResumePreview'
import { PersonalInfoSection } from './sections/PersonalInfoSection'
import { SummarySection } from './sections/SummarySection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { TailorModal } from './TailorModal'
import { ATSScorePanel } from './ATSScorePanel'
import { Save, Download, Eye, EyeOff, Sparkles, ChevronDown, ChevronRight, Check, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface Props {
  resumeId: string
  initialData: ResumeData
  initialTemplate: TemplateId
  initialTitle: string
}

const sections = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications / Accomplishments' },
]

export function ResumeBuilder({ resumeId, initialData, initialTemplate, initialTitle }: Props) {
  const [data, setData] = useState<ResumeData>(initialData || defaultResumeData)
  const [template, setTemplate] = useState<TemplateId>(initialTemplate || 'modern')
  const [title, setTitle] = useState(initialTitle)
  const [activeSection, setActiveSection] = useState('personal')
  const [showPreview, setShowPreview] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const [showTailor, setShowTailor] = useState(false)
  const [showATS, setShowATS] = useState(false)
  const [exporting, setExporting] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const save = useCallback(async (d: ResumeData, t: TemplateId, ti: string) => {
    setSaving(true)
    try {
      await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: d, template: t, title: ti }),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }, [resumeId])

  const triggerAutoSave = useCallback((d: ResumeData, t: TemplateId, ti: string) => {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(d, t, ti), 1500)
  }, [save])

  const updateData = (newData: ResumeData) => {
    setData(newData)
    triggerAutoSave(newData, template, title)
  }

  const updateTemplate = (t: TemplateId) => {
    setTemplate(t)
    triggerAutoSave(data, t, title)
  }

  const updateTitle = (t: string) => {
    setTitle(t)
    triggerAutoSave(data, template, t)
  }

  async function exportPDF() {
    setExporting(true)
    try {
      const res = await fetch(`/api/export/${resumeId}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('PDF export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Navbar />
      {showTailor && (
        <TailorModal
          currentSummary={data.summary}
          onClose={() => setShowTailor(false)}
          onApply={(summary) => {
            updateData({ ...data, summary })
            setShowTailor(false)
            setActiveSection('summary')
          }}
        />
      )}

      <div className="flex-1 bg-[#06060F]">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] bg-[#0D0D20] px-4 py-3">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Input
                value={title}
                onChange={(e) => updateTitle(e.target.value)}
                className="max-w-xs rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 font-semibold text-slate-100 focus:border-violet-500"
              />
              <span className="hidden text-xs text-slate-500 sm:block">
                {saving ? 'Saving...' : saved ? (
                  <span className="flex items-center gap-1 text-emerald-400"><Check className="h-3 w-3" /> Saved</span>
                ) : 'Unsaved changes'}
              </span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowTailor(true)}>
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="hidden sm:inline">Tailor to Job</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowATS(!showATS)}>
                <TrendingUp className={`h-4 w-4 ${showATS ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">ATS Score</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
              </Button>
              <Button size="sm" onClick={exportPDF} loading={exporting} variant="secondary">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
              <Button size="sm" onClick={() => save(data, template, title)} loading={saving}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 py-6">
          {/* Template Picker */}
          <div className="mb-6 rounded-xl border border-white/[0.07] bg-[#141432] p-4">
            <p className="mb-3 text-sm font-medium text-slate-400">Template</p>
            <TemplatePicker value={template} onChange={updateTemplate} />
          </div>

          {/* ATS Score Panel */}
          {showATS && (
            <div className="mb-6">
              <ATSScorePanel
                data={data}
                onSectionClick={(section) => {
                  setActiveSection(section)
                  setShowATS(false)
                }}
              />
            </div>
          )}

          <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
            {/* Form */}
            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#141432]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]"
                    onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                  >
                    <span className="font-semibold text-slate-200">{section.label}</span>
                    {activeSection === section.id
                      ? <ChevronDown className="h-4 w-4 text-slate-500" />
                      : <ChevronRight className="h-4 w-4 text-slate-500" />}
                  </button>

                  {activeSection === section.id && (
                    <div className="border-t border-white/[0.06] px-5 pb-5">
                      <div className="pt-4">
                        {section.id === 'personal' && (
                          <PersonalInfoSection data={data.personalInfo} onChange={(personalInfo) => updateData({ ...data, personalInfo })} />
                        )}
                        {section.id === 'summary' && (
                          <SummarySection summary={data.summary} jobTitle={data.personalInfo.jobTitle} onChange={(summary) => updateData({ ...data, summary })} />
                        )}
                        {section.id === 'experience' && (
                          <ExperienceSection entries={data.experience} onChange={(experience) => updateData({ ...data, experience })} />
                        )}
                        {section.id === 'education' && (
                          <EducationSection entries={data.education} onChange={(education) => updateData({ ...data, education })} />
                        )}
                        {section.id === 'skills' && (
                          <SkillsSection groups={data.skills} jobTitle={data.personalInfo.jobTitle} onChange={(skills) => updateData({ ...data, skills })} />
                        )}
                        {section.id === 'projects' && (
                          <ProjectsSection entries={data.projects} onChange={(projects) => updateData({ ...data, projects })} />
                        )}
                        {section.id === 'certifications' && (
                          <CertificationsSection entries={data.certifications} onChange={(certifications) => updateData({ ...data, certifications })} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="sticky top-20 self-start">
                <div className="rounded-xl border border-white/[0.07] bg-[#141432] p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Live Preview</p>
                  <div className="max-h-[calc(100vh-180px)] overflow-auto">
                    <ResumePreview data={data} template={template} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
