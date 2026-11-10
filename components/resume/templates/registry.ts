import type { ReactElement } from 'react'
import { ResumeData, TemplateId } from '@/types/resume'
import { ModernTemplate } from './ModernTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { TimelineTemplate } from './TimelineTemplate'
import { ElegantTemplate } from './ElegantTemplate'
import { CompactTemplate } from './CompactTemplate'
import { AltaCVTemplate } from './AltaCVTemplate'
import { JakesTemplate } from './JakesTemplate'
import { SixtySecondsTemplate } from './SixtySecondsTemplate'
import { BerlinTemplate } from './BerlinTemplate'
import { TokyoTemplate } from './TokyoTemplate'
import { ViennaTemplate } from './ViennaTemplate'

export type TemplateComponent = (props: { data: ResumeData; scale?: number }) => ReactElement

export const templateRegistry = {
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
} as const satisfies Record<TemplateId, TemplateComponent>

export const PAGE_WIDTH = 794
export const PAGE_HEIGHT = 1122
