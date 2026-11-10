'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, CheckCircle, Sparkles, Layout, Download, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/dashboard')
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      {/* Left panel — branding */}
      <div className="relative hidden overflow-hidden p-12 lg:flex lg:w-5/12 xl:w-[45%] flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-950/70 via-card to-emerald-950/60" />
        <div className="absolute inset-0 bg-cross-pattern opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)]" />
        <div className="animate-orb-drift pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-crimson-500/15 blur-[130px]" />
        <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-emerald-600/12 blur-[110px]" />
        <div className="absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-transparent via-crimson-500/20 to-transparent" />

        {/* Logo top */}
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-lg shadow-crimson-500/30">
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
            Your career
            <span className="block gradient-text">starts here</span>
          </h2>
          <p className="mb-8 text-slate-400 leading-relaxed">
            Join thousands of job seekers who&apos;ve landed interviews using ResumeAI.
          </p>

          {/* Perks grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CheckCircle, label: 'Free forever', sub: 'No credit card', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
              { icon: Layout, label: '15 templates', sub: 'All ATS-ready', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
              { icon: Sparkles, label: 'AI writes it', sub: 'Zero effort', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
              { icon: Download, label: 'PDF export', sub: 'One click', color: 'text-crimson-400', bg: 'bg-crimson-500/10' },
            ].map(({ icon: Icon, label, sub, color, bg }) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <p className="text-sm font-semibold text-slate-200">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stat */}
        <div className="relative flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-crimson-500/10">
            <Zap className="h-4 w-4 text-crimson-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">10,000+ resumes created</p>
            <p className="text-xs text-slate-500">Join a growing community of job seekers</p>
          </div>
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
            <h1 className="font-display mb-2 text-2xl font-extrabold text-primary">Create your account</h1>
            <p className="text-secondary text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-default bg-card p-7 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all focus:border-crimson-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-crimson-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all focus:border-crimson-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-crimson-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all focus:border-crimson-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-crimson-500/20"
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
                className="btn-gradient mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    Create free account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-crimson-400 transition-colors hover:text-crimson-300">
                Sign in →
              </Link>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300">
              <span className="inline-block rotate-180 transform">←</span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
