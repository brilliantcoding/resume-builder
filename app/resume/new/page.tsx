import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { defaultResumeData } from '@/types/resume'

export default async function NewResumePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: 'Untitled Resume',
      template: 'modern',
      data: JSON.stringify(defaultResumeData),
    },
  })

  redirect(`/resume/${resume.id}`)
}
