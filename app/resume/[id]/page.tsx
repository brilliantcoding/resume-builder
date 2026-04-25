import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ResumeBuilder } from '@/components/resume/ResumeBuilder'
import { ResumeData, TemplateId } from '@/types/resume'

export default async function ResumePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const resume = await prisma.resume.findFirst({ where: { id, userId: session.user.id } })
  if (!resume) notFound()

  const data: ResumeData = JSON.parse(resume.data)

  return (
    <ResumeBuilder
      resumeId={resume.id}
      initialData={data}
      initialTemplate={resume.template as TemplateId}
      initialTitle={resume.title}
    />
  )
}
