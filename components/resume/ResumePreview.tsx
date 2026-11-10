'use client'
import { ResumeData, TemplateId } from '@/types/resume'
import { templateRegistry, PAGE_WIDTH, PAGE_HEIGHT } from './templates/registry'

interface Props {
  data: ResumeData
  template: TemplateId
}

export function ResumePreview({ data, template }: Props) {
  const Template = templateRegistry[template] || templateRegistry.modern

  return (
    <div className="w-full overflow-auto bg-gray-100 rounded-xl p-4">
      <div
        key={template}
        className="template-swap bg-white shadow-xl mx-auto"
        style={{
          width: PAGE_WIDTH,
          minHeight: PAGE_HEIGHT,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Template data={data} />
      </div>
    </div>
  )
}
