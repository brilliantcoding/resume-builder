'use client'
import { ResumeData, TemplateId } from '@/types/resume'
import { ModernTemplate } from './templates/ModernTemplate'
import { ClassicTemplate } from './templates/ClassicTemplate'
import { MinimalTemplate } from './templates/MinimalTemplate'
import { CreativeTemplate } from './templates/CreativeTemplate'
import { ProfessionalTemplate } from './templates/ProfessionalTemplate'
import { ExecutiveTemplate } from './templates/ExecutiveTemplate'
import { TimelineTemplate } from './templates/TimelineTemplate'
import { ElegantTemplate } from './templates/ElegantTemplate'
import { CompactTemplate } from './templates/CompactTemplate'
import { AltaCVTemplate } from './templates/AltaCVTemplate'
import { JakesTemplate } from './templates/JakesTemplate'
import { SixtySecondsTemplate } from './templates/SixtySecondsTemplate'
import { BerlinTemplate } from './templates/BerlinTemplate'
import { TokyoTemplate } from './templates/TokyoTemplate'
import { ViennaTemplate } from './templates/ViennaTemplate'

interface Props {
  data: ResumeData
  template: TemplateId
}

const PREVIEW_WIDTH = 794  // A4 at 96dpi

const templateMap = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  professional: ProfessionalTemplate,
  executive: ExecutiveTemplate,
  timeline: TimelineTemplate,
  elegant: ElegantTemplate,
  compact: CompactTemplate,
  altacv: AltaCVTemplate,
  jakes: JakesTemplate,
  sixtyseconds: SixtySecondsTemplate,
  berlin: BerlinTemplate,
  tokyo: TokyoTemplate,
  vienna: ViennaTemplate,
} as const

export function ResumePreview({ data, template }: Props) {
  const Template = templateMap[template] || ModernTemplate

  return (
    <div className="w-full overflow-auto bg-gray-100 rounded-xl p-4">
      <div
        className="bg-white shadow-xl mx-auto"
        style={{
          width: PREVIEW_WIDTH,
          minHeight: 1122,  // A4 height at 96dpi
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Template data={data} />
      </div>
    </div>
  )
}

export function ResumePreviewScaled({ data, template }: Props) {
  const Template = templateMap[template] || ModernTemplate

  return (
    <div className="relative overflow-hidden bg-white rounded border" style={{ paddingBottom: '141.4%' }}>
      <div className="absolute inset-0" style={{ transformOrigin: 'top left' }}>
        <Template data={data} />
      </div>
    </div>
  )
}
