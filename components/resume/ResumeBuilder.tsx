'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ResumeData, TemplateId, defaultResumeData } from '@/types/resume'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { TemplatePicker, getTemplateName } from './TemplatePicker'
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
import { addAssistantEventListener, type AssistantEventDetail } from '@/components/ui/assistantEvents'

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
  const [switchedTo, setSwitchedTo] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const switchToastTimer = useRef<ReturnType<typeof setTimeout>>(null)

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

  const updateData = useCallback((newData: ResumeData) => {
    setData(newData)
    triggerAutoSave(newData, template, title)
  }, [template, title, triggerAutoSave])

  const updateTemplate = (t: TemplateId) => {
    setTemplate(t)
    triggerAutoSave(data, t, title)
    if (t !== template) {
      setSwitchedTo(getTemplateName(t))
      if (switchToastTimer.current) clearTimeout(switchToastTimer.current)
      switchToastTimer.current = setTimeout(() => setSwitchedTo(null), 2400)
    }
  }

  const updateTitle = (t: string) => {
    setTitle(t)
    triggerAutoSave(data, template, t)
  }

  useEffect(() => addAssistantEventListener((event) => {
    event.preventDefault()
    const detail: AssistantEventDetail = event.detail

    async function handleAction() {
      try {
        if (detail.type === 'apply') {
          const suggestion = detail.suggestion
          if (suggestion.type === 'summary') {
            updateData({ ...data, summary: suggestion.text })
            setActiveSection('summary')
          } else {
            const experience = data.experience.map((entry) =>
              entry.id === suggestion.experienceId
                ? {
                    ...entry,
                    bullets: entry.bullets.map((bullet, index) =>
                      index === suggestion.bulletIndex ? suggestion.text : bullet,
                    ),
                  }
                : entry,
            )
            updateData({ ...data, experience })
            setActiveSection('experience')
          }
          detail.respond({ message: 'Suggestion applied. Your resume will save automatically.' })
          return
        }

        if (detail.action === 'tailor-resume') {
          setShowTailor(true)
          detail.respond({ message: 'The job tailoring dialog is open. Paste a job description to get a tailored summary and keyword suggestions.' })
          return
        }

        if (detail.action === 'check-ats') {
          setShowATS(true)
          detail.respond({ message: 'ATS readiness is open above the editor. Review its suggestions to see which sections could use attention.' })
          return
        }

        if (detail.action === 'generate-summary') {
          const experience = data.experience
            .map((entry) => `${entry.position}${entry.company ? ` at ${entry.company}` : ''}: ${entry.bullets.filter(Boolean).join('; ')}`)
            .filter(Boolean)
            .join('\n')
          const skills = data.skills.flatMap((group) => group.skills).join(', ')
          const response = await fetch('/api/ai/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobTitle: data.personalInfo.jobTitle,
              experience: experience || 'Not provided',
              skills: skills || 'Not provided',
            }),
          })
          const result: { summary?: string; error?: string } = await response.json()
          if (!response.ok || !result.summary?.trim()) {
            throw new Error(result.error || 'Could not generate a summary. Please try again.')
          }
          detail.respond({
            message: 'Review this summary. Apply it only if it accurately reflects your experience.',
            suggestion: { type: 'summary', text: result.summary },
          })
          return
        }

        const experienceIndex = data.experience.findIndex((entry) => entry.bullets.some((bullet) => bullet.trim()))
        if (experienceIndex === -1) {
          detail.respond({ message: 'Add an experience entry with a bullet point first, then I can help improve it.' })
          return
        }

        const entry = data.experience[experienceIndex]
        const bulletIndex = entry.bullets.findIndex((bullet) => bullet.trim())
        const response = await fetch('/api/ai/improve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bullet: entry.bullets[bulletIndex],
            jobTitle: entry.position || data.personalInfo.jobTitle,
          }),
        })
        const result: { improved?: string; error?: string } = await response.json()
        if (!response.ok || !result.improved?.trim()) {
          throw new Error(result.error || 'Could not improve this bullet. Please try again.')
        }
        detail.respond({
          message: 'Review this rewrite before applying it. Confirm every claim and metric is accurate.',
          suggestion: {
            type: 'bullet',
            text: result.improved,
            experienceId: entry.id,
            bulletIndex,
          },
        })
      } catch (error) {
        console.error('Resume assistant action failed:', error)
        detail.respond({
          message: error instanceof Error ? error.message : 'The assistant action failed. Please try again.',
        })
      }
    }

    void handleAction()
  }), [data, updateData])

  async function exportPDF() {
    setExporting(true)
    try {
      const res = await fetch(`/api/export/${resumeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, template, title }),
      })
      if (!res.ok) {
        const error: { error?: string } = await res.json()
        throw new Error(error.error || 'Export failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_') || 'resume'}.pdf`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'PDF export failed. Please try again.')
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
          currentSkills={data.skills.flatMap((group) => group.skills).join(', ')}
          onClose={() => setShowTailor(false)}
          onApply={(summary) => {
            updateData({ ...data, summary })
            setShowTailor(false)
            setActiveSection('summary')
          }}
        />
      )}

      <div className="flex-1 bg-background">
        {/* Top bar */}
        <div className="sticky top-[68px] z-30 border-b border-default bg-card px-4 py-3">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Input
                value={title}
                onChange={(e) => updateTitle(e.target.value)}
                className="max-w-xs rounded-lg border-0 bg-transparent px-0 font-semibold text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-crimson-500"
              />
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg">
                {saving ? (
                  <span className="text-xs text-crimson-400 animate-pulse">Saving...</span>
                ) : saved ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>
                ) : (
                  <span className="text-xs text-amber-400">Unsaved changes</span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTailor(true)}>
                <Sparkles className="h-4 w-4 text-crimson-400" />
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
              <Button variant="secondary" size="sm" onClick={exportPDF} loading={exporting}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
              <Button variant="primary" size="sm" onClick={() => save(data, template, title)} loading={saving}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 py-6">
          <TemplatePicker value={template} onChange={updateTemplate} />

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
                <div key={section.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-card">
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
              <div className="sticky top-[124px] self-start">
                <div className="rounded-xl border border-white/[0.07] bg-card p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Live Preview</p>
                  <div className="max-h-[calc(100vh-208px)] overflow-auto">
                    <ResumePreview data={data} template={template} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {switchedTo && (
        <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2.5 rounded-full border border-crimson-500/30 bg-card px-4 py-2.5 shadow-2xl animate-slide-up" role="status">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-crimson-500 text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-slate-200">
            Switched to <span className="text-crimson-400">{switchedTo}</span>
          </span>
        </div>
      )}
    </>
  )
}
