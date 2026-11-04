import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { FloatingAIAssistant } from '@/components/ui/AIAssistant'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ResumeAI — Build Professional Resumes with AI',
  description: 'Create ATS-friendly resumes in minutes with AI-powered content generation, professional templates, and PDF export.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-primary">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
          <FloatingAIAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
