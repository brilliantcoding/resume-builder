'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, Sparkles, TrendingUp, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
    <div className="flex min-h-screen bg-[#060611]">
      {/* Left panel — branding */}
      <div className="relative hidden overflow-hidden p-12 lg:flex lg:w-5/12 xl:w-[45%] flex-col justify-between">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/70 via-[#0B0B1A] to-indigo-950/60" />
        <div className="absolute inset-0 bg-cross-pattern opacity-30" />
        <div className="animate-orb-drift pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        {/* Right edge separator */}
        <div className="absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />

        {/* Logo top */}
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <FileText className="h-5 w-5 text-white" strokeWidth={2.2} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-60" />
            </div>
            <span className="font-display text-lg font-bold">
              <span className="text-slate-100">Resume</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative max-w-sm">
          <h2 className="font-display mb-4 text-3xl font-extrabold leading-tight text-slate-50">
            Build resumes that
            <span className="block gradient-text">get you hired</span>
          </h2>
          <p className="mb-8 text-slate-400 leading-relaxed">
            AI-powered content, 9 professional templates, and one-click PDF export — all in one place.
          </p>

          {/* Feature cards */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, label: 'AI generates your professional summary', color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { icon: TrendingUp, label: 'Tailors resume to any job description', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Download, label: 'ATS-optimized — get past filters', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <blockquote className="border-l-2 border-violet-500/40 pl-4">
            <p className="text-sm italic text-slate-400">&ldquo;Got 3 interviews in the first week.&rdquo;</p>
            <footer className="mt-1 text-xs text-slate-600">— Product Designer, hired at a FAANG</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 bg-[#060611]">
        <div className="animate-scale-in w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                <FileText className="h-5 w-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-slate-100">Resume</span>
                <span className="gradient-text">AI</span>
              </span>
            </Link>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="font-display mb-2 text-2xl font-extrabold text-slate-50">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to continue building your career</p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E24] p-7 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all focus:border-violet-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all focus:border-violet-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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

            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center text-sm text-slate-500">
              No account?{' '}
              <Link href="/register" className="font-semibold text-violet-400 transition-colors hover:text-violet-300">
                Create one free →
              </Link>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-600 transition-colors hover:text-slate-400">
              ← Back to ResumeAI
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
