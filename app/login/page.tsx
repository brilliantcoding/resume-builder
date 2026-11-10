'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, Sparkles, TrendingUp, Download } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      {/* Left panel — branding */}
      <div className="relative hidden overflow-hidden p-12 lg:flex lg:w-5/12 xl:w-[45%] flex-col justify-between">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-950/70 via-card to-emerald-950/60" />
        <div className="absolute inset-0 bg-cross-pattern opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)]" />
        <div className="animate-orb-drift pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-crimson-500/15 blur-[130px]" />
        <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-emerald-600/12 blur-[110px]" />
        {/* Right edge separator */}
        <div className="absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-transparent via-crimson-500/20 to-transparent" />

        {/* Logo top */}
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-lg shadow-crimson-500/30">
              <FileText className="h-5 w-5 text-white" strokeWidth={2.2} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-60" />
            </div>
            <span className="font-display text-lg font-bold">
              <span className="text-primary">Resume</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative max-w-sm">
          <h2 className="font-display mb-4 text-3xl font-extrabold leading-tight text-primary">
            Build resumes that
            <span className="block gradient-text">get you hired</span>
          </h2>
          <p className="mb-8 text-secondary leading-relaxed">
            AI-powered content, 15 professional templates, and one-click PDF export — all in one place.
          </p>

          {/* Feature cards */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, label: 'AI generates your professional summary', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
              { icon: TrendingUp, label: 'Tailors resume to any job description', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
              { icon: Download, label: 'ATS-optimized — get past filters', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-default bg-card px-4 py-3">
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <span className="text-sm text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <blockquote className="border-l-2 border-crimson-500/40 pl-4">
            <p className="text-sm italic text-secondary">&ldquo;Got 3 interviews in the first week.&rdquo;</p>
            <footer className="mt-1 text-xs text-muted">— Product Designer, hired at a FAANG</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 bg-background">
        <div className="animate-scale-in w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700">
                <FileText className="h-5 w-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-primary">Resume</span>
                <span className="gradient-text">AI</span>
              </span>
            </Link>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="font-display mb-2 text-2xl font-extrabold text-primary">Welcome back</h1>
            <p className="text-secondary text-sm">Sign in to continue building your career</p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-default bg-card p-7 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-default bg-card px-4 py-2.5 text-sm text-primary placeholder-muted transition-all focus:border-crimson-500/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-crimson-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-default bg-card px-4 py-2.5 text-sm text-primary placeholder-muted transition-all focus:border-crimson-500/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-crimson-500/20"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-400">
                  <span className="flex-shrink-0 text-base">⚠</span>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-default pt-5 text-center text-sm text-muted">
              No account?{' '}
              <Link href="/register" className="font-semibold text-crimson-400 transition-colors hover:text-crimson-300">
                Create one free →
              </Link>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-muted transition-colors hover:text-secondary">
              ← Back to ResumeAI
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
