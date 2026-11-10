'use client'
import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle, Zap, Download, Star, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28">
      {/* Soft gradient backdrop */}
      <div className="hero-backdrop absolute inset-0" />

      {/* Subtle green light fields */}
      <div className="animate-orb-drift pointer-events-none absolute -top-72 right-[-15%] h-[700px] w-[700px] rounded-full bg-crimson-500/10 blur-[160px]" />
      <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-56 -left-40 h-[560px] w-[560px] rounded-full bg-emerald-600/[0.08] blur-[140px]" />

      {/* Faint grid fading out toward the edges */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-20">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="animate-slide-up mb-7 inline-flex items-center gap-2.5 rounded-full border border-crimson-500/25 bg-crimson-500/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-crimson-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-powered resume building</span>
            </div>

            {/* Heading */}
            <h1 className="animate-slide-up-d1 font-display mb-6 text-[2.6rem] leading-[1.06] font-bold tracking-tight sm:text-6xl lg:text-[4.25rem]">
              <span className="block text-primary">Your resume,</span>
              <span className="block gradient-text">supercharged with AI</span>
            </h1>

            {/* Subheading */}
            <p className="animate-slide-up-d2 mb-9 max-w-lg mx-auto lg:mx-0 text-[17px] leading-relaxed text-secondary">
              Build ATS-optimized resumes in minutes. AI writes your content, 15 professional templates make you stand out, one-click PDF export gets you to interviews.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up-d3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
              <Link href="/register">
                <button className="btn-gradient group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white">
                  Build your resume — free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-[15px] font-semibold text-secondary transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-primary">
                  Sign in
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="animate-slide-up-d4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 text-[13px] text-muted">
              {['No credit card required', 'ATS-optimized templates', 'PDF export included'].map(label => (
                <div key={label} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-crimson-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating visual mockup */}
          <div className="flex-1 relative hidden lg:flex items-center justify-center xl:justify-end min-h-[500px]">
            <div className="animate-float relative">
              {/* Resume card */}
              <div className="glow-crimson w-[360px] overflow-hidden rounded-2xl border border-white/[0.08] bg-card">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 border-b border-default bg-white/[0.02] px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-crimson-400/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-crimson-400/35" />
                  <div className="h-2.5 w-2.5 rounded-full bg-crimson-400/70" />
                  <div className="mx-3 flex h-4 flex-1 items-center rounded-md bg-white/[0.05] px-2">
                    <div className="h-1 w-24 rounded bg-white/[0.08]" />
                  </div>
                </div>

                {/* Paper resume preview */}
                <div className="p-4">
                  <div className="flex h-[220px] gap-3 rounded-lg bg-white shadow-inner">
                    {/* Sidebar */}
                    <div className="flex w-[38%] flex-col rounded-l-lg bg-gradient-to-b from-crimson-600 to-crimson-800 p-3">
                      <div className="mb-3 h-11 w-11 rounded-full bg-white/40 ring-2 ring-white/50" />
                      <div className="mb-1 h-1.5 w-full rounded bg-white/90" />
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
                    <div className="flex flex-1 flex-col gap-1.5 pt-1 pr-2">
                      <div className="h-2.5 w-3/4 rounded bg-gray-800/85" />
                      <div className="h-1 w-1/2 rounded bg-gray-500/60" />
                      <div className="mt-1.5 h-px w-full bg-gray-200" />
                      <div className="mt-0.5 h-1 w-1/3 rounded bg-crimson-500" />
                      <div className="h-1 w-full rounded bg-gray-300" />
                      <div className="h-1 w-full rounded bg-gray-300" />
                      <div className="h-1 w-4/5 rounded bg-gray-300" />
                      <div className="mt-1.5 h-px w-full bg-gray-200" />
                      <div className="h-1 w-1/3 rounded bg-crimson-500" />
                      <div className="h-1 w-full rounded bg-gray-300" />
                      <div className="h-1 w-5/6 rounded bg-gray-300" />
                      <div className="h-1 w-3/4 rounded bg-gray-300" />
                      <div className="mt-1 h-px w-full bg-gray-200" />
                      <div className="h-1 w-1/4 rounded bg-crimson-500" />
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-3 w-10 rounded-full bg-crimson-500/20" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chip — AI writing */}
              <div className="animate-float-d4 glass-card absolute -left-14 -top-6 flex items-center gap-2.5 rounded-xl px-4 py-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-crimson-500/15">
                  <Sparkles className="h-4 w-4 text-crimson-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-primary">AI writing</p>
                  <p className="text-[11px] text-crimson-400">Summary generated ✓</p>
                </div>
              </div>

              {/* Floating chip — ATS Score */}
              <div className="animate-float-reverse glass-card absolute -bottom-6 -left-8 flex items-center gap-2.5 rounded-xl px-4 py-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-crimson-500/15">
                  <TrendingUp className="h-4 w-4 text-crimson-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-primary">ATS Score</p>
                  <p className="text-[11px] font-bold text-crimson-400">92 / 100</p>
                </div>
              </div>

              {/* Floating chip — Export */}
              <div className="animate-float-d2 btn-gradient absolute -bottom-8 right-4 flex items-center gap-2.5 rounded-xl px-4 py-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-white">PDF Ready</p>
                  <p className="text-[11px] text-white/70">Click to export</p>
                </div>
              </div>

              {/* Star rating chip */}
              <div className="glass-card absolute -right-12 top-1/3 flex items-center gap-1.5 rounded-xl px-3.5 py-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-primary">4.9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24 rounded-2xl border border-default bg-card/60 px-8 py-8">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: '10k+', label: 'Resumes created', icon: Zap },
              { value: '15', label: 'Pro templates', icon: Star },
              { value: '5+', label: 'AI features', icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-crimson-500/10">
                  <Icon className="h-[18px] w-[18px] text-crimson-400" />
                </div>
                <div>
                  <p className="stat-num text-2xl text-primary">{value}</p>
                  <p className="text-[13px] text-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
