import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { FloatingAIAssistant } from '@/components/ui/AIAssistant'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ResumeAI — Build Professional Resumes with AI',
  description: 'Create ATS-friendly resumes in minutes with AI-powered content generation, professional templates, and PDF export.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-primary">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
          <FloatingAIAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
