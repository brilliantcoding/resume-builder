'use client'
import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle, Zap, Download, Star, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-32">
      {/* Animated gradient background with teal and blue accents */}
      <div className="hero-backdrop absolute inset-0 opacity-40 animate-gradient" />

      {/* Animated gradient orbs with teal and blue accents */}
      <div className="animate-orb-drift pointer-events-none absolute -top-64 right-[-10%] h-[900px] w-[900px] rounded-full bg-crimson-600/[0.18] blur-[140px] shadow-[0_0_100px_rgba(20,184,166,0.25)]" />
      <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-48 -left-48 h-[700px] w-[700px] rounded-full bg-sky-500/[0.12] blur-[120px] shadow-[0_0_80px_rgba(14,165,233,0.18)]" />
      <div className="animate-aurora pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-crimson-500 via-sky-500 to-emerald-500/[0.1] blur-[120px] shadow-[0_0_120px_rgba(56,189,248,0.16)]" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Animated Badge */}
            <div className="animate-slide-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-crimson-500/40 bg-crimson-500/[0.12] px-4 py-1.5 text-sm font-semibold text-crimson-300 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.2)]">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson-500" />
              </div>
              <span>AI-powered resume building</span>
              <span className="ml-0.5 rounded-full bg-gradient-to-r from-crimson-600 to-crimson-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg animate-badge-pulse shadow-[0_0_15px_rgba(20,184,166,0.45)]">
                NEW
              </span>
            </div>

            {/* Animated Heading */}
            <h1 className="animate-slide-up-d1 font-display mb-6 leading-[1.04] tracking-tight">
              <span className="block text-3xl sm:text-5xl lg:text-[4.75rem] font-extrabold text-primary">
                Your resume,
              </span>
              <span className="block text-3xl sm:text-5xl lg:text-[4.75rem] font-extrabold text-primary">
                supercharged
              </span>
              <span className="block text-3xl sm:text-5xl lg:text-[4.75rem] font-extrabold text-secondary">
                with AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="animate-slide-up-d2 mb-10 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed text-secondary">
              Build ATS-optimized resumes in minutes. AI writes your content, 9 professional templates make you stand out, one-click PDF export gets you to interviews.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up-d3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
              <Link href="/register">
                <button className="btn-gradient animate-pulse-glow group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_40px_rgba(20,184,166,0.5)] hover:shadow-[0_0_60px_rgba(20,184,166,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_80px_rgba(20,184,166,0.85)]">
                  Build your resume — free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:scale-110" />
                </button>
              </Link>
              <Link href="/login">
                <button className="group inline-flex items-center gap-2 rounded-xl border border-crimson-500/30 bg-crimson-500/[0.08] px-7 py-3.5 text-base font-semibold text-primary transition-all duration-200 hover:border-crimson-500/60 hover:bg-crimson-500/[0.15] hover:text-primary hover:shadow-[0_0_20px_rgba(20,184,166,0.35)] backdrop-blur-sm">
                  Sign in
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="animate-slide-up-d4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 text-sm text-muted">
              {[
                { label: 'No credit card required', icon: CheckCircle },
                { label: 'ATS-optimized templates', icon: CheckCircle },
                { label: 'PDF export included', icon: CheckCircle },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating visual mockup */}
          <div className="flex-1 relative hidden lg:flex items-center justify-center xl:justify-end min-h-[520px]">
            <div className="animate-float relative">
              {/* Main resume card with glass effect */}
              <div className="glow-crimson w-[360px] overflow-hidden rounded-2xl border border-crimson-500/30 bg-card backdrop-blur-xl shadow-[0_0_80px_rgba(20,184,166,0.35)] transition-all duration-500 hover:shadow-[0_0_120px_rgba(20,184,166,0.55)]">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 border-b border-default bg-card px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70 transition-all hover:bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-400/70 transition-all hover:bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70 transition-all hover:bg-emerald-400" />
                  <div className="mx-3 flex h-4 flex-1 items-center rounded-md bg-white/[0.08] px-2 shadow-inner">
                    <div className="h-1 w-24 rounded bg-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  </div>
                </div>

                {/* Paper resume preview */}
                <div className="bg-white/5 p-4 shadow-inner">
                  <div className="flex h-[220px] gap-3">
                    {/* Sidebar */}
                    <div className="flex w-[38%] flex-col rounded-lg bg-gradient-to-br from-crimson-600 to-crimson-800 p-3 shadow-lg shadow-crimson-500/25">
                      <div className="mb-3 h-11 w-11 rounded-full bg-white/40 border-2 border-white/50 shadow-inner shadow-crimson-500/40" />
                      <div className="mb-1 h-1.5 w-full rounded bg-white/90 shadow-sm" />
                      <div className="mb-0.5 h-1 w-4/5 rounded bg-white/70" />
                      <div className="mb-4 h-1 w-3/5 rounded bg-white/55" />
                      <div className="mb-1.5 h-px w-full bg-white/30" />
                      <div className="mb-1 h-1 w-1/2 rounded bg-white/50" />
                      <div className="mb-1 h-1 w-full rounded bg-white/35" />
                      <div className="mb-1 h-1 w-4/5 rounded bg-white/35" />
                      <div className="mb-3 h-1 w-3/5 rounded bg-white/35" />
                      <div className="mb-1.5 h-px w-full bg-white/30" />
                      <div className="mb-1 h-1 w-1/2 rounded bg-white/50" />
                      <div className="mb-1 h-1 w-full rounded bg-white/35" />
                      <div className="h-1 w-3/4 rounded bg-white/35" />
                    </div>
                    {/* Main content */}
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="h-2.5 w-3/4 rounded bg-gray-700/80" />
                      <div className="h-1 w-1/2 rounded bg-gray-500/60" />
                      <div className="mt-1.5 h-px w-full bg-gray-300/50" />
                      <div className="mt-0.5 h-1 w-1/3 rounded bg-crimson-500" />
                      <div className="h-1 w-full rounded bg-gray-400/60" />
                      <div className="h-1 w-full rounded bg-gray-400/60" />
                      <div className="h-1 w-4/5 rounded bg-gray-400/60" />
                      <div className="mt-1.5 h-px w-full bg-gray-300/50" />
                      <div className="h-1 w-1/3 rounded bg-crimson-400" />
                      <div className="h-1 w-full rounded bg-gray-400/60" />
                      <div className="h-1 w-5/6 rounded bg-gray-400/60" />
                      <div className="h-1 w-3/4 rounded bg-gray-400/60" />
                      <div className="mt-1 h-px w-full bg-gray-300/50" />
                      <div className="h-1 w-1/4 rounded bg-crimson-400" />
                      <div className="flex flex-wrap gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-3 w-10 rounded-full bg-crimson-500/30" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chip — AI writing */}
              <div className="animate-float-d4 glass-card absolute -left-14 -top-6 flex items-center gap-2.5 rounded-xl border border-crimson-500/30 px-4 py-2.5 shadow-[0_0_40px_rgba(20,184,166,0.45)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(20,184,166,0.65)]">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500/40 to-crimson-700/30 shadow-[0_0_20px_rgba(20,184,166,0.45)]">
                  <Sparkles className="h-4 w-4 text-crimson-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-primary">AI writing</p>
                  <p className="text-[11px] text-crimson-400">Summary generated ✓</p>
                </div>
              </div>

              {/* Floating chip — ATS Score */}
              <div className="animate-float-reverse glass-card absolute -bottom-6 -left-8 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 px-4 py-2.5 shadow-[0_0_40px_rgba(16,185,129,0.45)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(16,185,129,0.65)]">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/40 to-teal-500/30 shadow-[0_0_20px_rgba(16,185,129,0.45)]">
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-primary">ATS Score</p>
                  <p className="text-[11px] font-bold text-emerald-300">92 / 100</p>
                </div>
              </div>

              {/* Floating chip — Export */}
              <div className="animate-float-d2 btn-gradient absolute -bottom-6 right-2 flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-[0_0_40px_rgba(20,184,166,0.45)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(20,184,166,0.65)]">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.35)]">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-white">PDF Ready</p>
                  <p className="text-[11px] text-teal-100">Click to export</p>
                </div>
              </div>

              {/* Star rating chip */}
              <div className="glass-card absolute -right-10 top-1/3 flex items-center gap-1.5 rounded-xl border border-crimson-500/30 px-3.5 py-2.5 shadow-[0_0_40px_rgba(20,184,166,0.3)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(20,184,166,0.45)]">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3 w-3 fill-crimson-400 text-crimson-300" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-primary">5.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 border-t border-white/[0.08] pt-10">
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0">
            {[
              { value: '10k+', label: 'Resumes created', icon: Zap, color: 'text-crimson-300' },
              { value: '15', label: 'Pro templates', icon: Star, color: 'text-crimson-300' },
              { value: '5+', label: 'AI features', icon: Sparkles, color: 'text-crimson-200' },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="group text-center lg:text-left">
                <div className="mb-1.5 flex items-center justify-center lg:justify-start gap-2">
                  <Icon className={`h-4 w-4 ${color} transition-transform group-hover:scale-110 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(20,184,166,0.6)]`} />
                  <p className="stat-num text-3xl font-extrabold text-primary group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-crimson-300 group-hover:via-sky-300 group-hover:to-emerald-300 group-hover:bg-clip-text group-hover:animate-rich-glow">
                    {value}
                  </p>
                </div>
                <p className="text-sm text-muted group-hover:text-secondary transition-colors">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
