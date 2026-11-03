'use client'
import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle, Zap, Download, Star, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#060611] pt-16 pb-32">
      {/* Background layers */}
      <div className="absolute inset-0 bg-cross-pattern opacity-40" />

      {/* Atmospheric glow orbs */}
      <div className="animate-orb-drift pointer-events-none absolute -top-64 right-[-10%] h-[900px] w-[900px] rounded-full bg-violet-600/[0.1] blur-[140px]" />
      <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-48 -left-48 h-[700px] w-[700px] rounded-full bg-indigo-700/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-violet-500/[0.04] blur-[90px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

          {/* Left content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

            {/* Badge */}
            <div className="animate-slide-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/[0.08] px-4 py-1.5 text-sm font-semibold text-violet-300">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </div>
              Powered by DeepSeek AI
              <span className="ml-0.5 rounded-full bg-violet-600/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">NEW</span>
            </div>

            {/* Heading */}
            <h1 className="animate-slide-up-d1 font-display mb-6 leading-[1.04] tracking-tight">
              <span className="block text-5xl sm:text-6xl lg:text-[4.75rem] font-extrabold text-slate-50">
                Your resume,
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-[4.75rem] font-extrabold gradient-text">
                supercharged
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-[4.75rem] font-extrabold text-slate-200">
                with AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="animate-slide-up-d2 mb-10 max-w-lg mx-auto lg:mx-0 text-lg text-slate-400 leading-relaxed">
              Build ATS-optimized resumes in minutes. AI writes your content, 9 professional templates make you stand out, one-click PDF export gets you to interviews.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up-d3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
              <Link href="/register">
                <button className="btn-gradient animate-pulse-glow group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-semibold text-white">
                  Build your resume — free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/login">
                <button className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-7 py-3.5 text-base font-semibold text-slate-300 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.07] hover:text-slate-100">
                  Sign in
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="animate-slide-up-d4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 text-sm text-slate-500">
              {[
                { label: 'No credit card required', icon: CheckCircle },
                { label: 'ATS-optimized templates', icon: CheckCircle },
                { label: 'PDF export included', icon: CheckCircle },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating visual mockup */}
          <div className="flex-1 relative hidden lg:flex items-center justify-center xl:justify-end min-h-[520px]">
            <div className="animate-float relative">

              {/* Main resume card */}
              <div className="glow-violet w-[360px] overflow-hidden rounded-2xl border border-violet-500/20 bg-[#101022] shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 border-b border-white/[0.05] bg-[#0B0B1A] px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  <div className="mx-3 flex h-4 flex-1 items-center rounded-md bg-white/[0.05] px-2">
                    <div className="h-1 w-24 rounded bg-white/[0.07]" />
                  </div>
                </div>

                {/* Paper resume preview */}
                <div className="bg-white p-4 shadow-inner">
                  <div className="flex h-[220px] gap-3">
                    {/* Sidebar */}
                    <div className="flex w-[38%] flex-col rounded-lg bg-indigo-600 p-3">
                      <div className="mb-3 h-11 w-11 rounded-full bg-white/30 border-2 border-white/40" />
                      <div className="mb-1 h-1.5 w-full rounded bg-white/80" />
                      <div className="mb-0.5 h-1 w-4/5 rounded bg-white/60" />
                      <div className="mb-4 h-1 w-3/5 rounded bg-white/45" />
                      <div className="mb-1.5 h-px w-full bg-white/20" />
                      <div className="mb-1 h-1 w-1/2 rounded bg-white/40" />
                      <div className="mb-1 h-1 w-full rounded bg-white/25" />
                      <div className="mb-1 h-1 w-4/5 rounded bg-white/25" />
                      <div className="mb-3 h-1 w-3/5 rounded bg-white/25" />
                      <div className="mb-1.5 h-px w-full bg-white/20" />
                      <div className="mb-1 h-1 w-1/2 rounded bg-white/40" />
                      <div className="mb-1 h-1 w-full rounded bg-white/25" />
                      <div className="h-1 w-3/4 rounded bg-white/25" />
                    </div>
                    {/* Main content */}
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="h-2.5 w-3/4 rounded bg-gray-800" />
                      <div className="h-1 w-1/2 rounded bg-gray-400" />
                      <div className="mt-1.5 h-px w-full bg-gray-100" />
                      <div className="mt-0.5 h-1 w-1/3 rounded bg-indigo-500" />
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-4/5 rounded bg-gray-200" />
                      <div className="mt-1.5 h-px w-full bg-gray-100" />
                      <div className="h-1 w-1/3 rounded bg-indigo-500" />
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-5/6 rounded bg-gray-200" />
                      <div className="h-1 w-3/4 rounded bg-gray-200" />
                      <div className="mt-1 h-px w-full bg-gray-100" />
                      <div className="h-1 w-1/4 rounded bg-indigo-500" />
                      <div className="flex flex-wrap gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-3 w-10 rounded-full bg-indigo-100" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chip — AI writing */}
              <div className="animate-float-d4 glass-card absolute -left-14 -top-6 flex items-center gap-2.5 rounded-xl border border-violet-500/25 px-4 py-2.5 shadow-xl">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/20">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-slate-100">AI writing</p>
                  <p className="text-[11px] text-slate-500">Summary generated ✓</p>
                </div>
              </div>

              {/* Floating chip — ATS Score */}
              <div className="animate-float-reverse glass-card absolute -bottom-6 -left-8 flex items-center gap-2.5 rounded-xl border border-emerald-500/25 px-4 py-2.5 shadow-xl">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-slate-100">ATS Score</p>
                  <p className="text-[11px] font-bold text-emerald-400">92 / 100</p>
                </div>
              </div>

              {/* Floating chip — Export */}
              <div className="animate-float-d2 btn-gradient absolute -bottom-6 right-2 flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-lg">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-white">PDF Ready</p>
                  <p className="text-[11px] text-indigo-200">Click to export</p>
                </div>
              </div>

              {/* Star rating chip */}
              <div className="glass-card absolute -right-10 top-1/3 flex items-center gap-1.5 rounded-xl border border-amber-500/20 px-3.5 py-2.5 shadow-lg">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-200">5.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 border-t border-white/[0.05] pt-10">
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0">
            {[
              { value: '10k+', label: 'Resumes created', icon: Zap, color: 'text-violet-400' },
              { value: '15', label: 'Pro templates', icon: Star, color: 'text-amber-400' },
              { value: '5+', label: 'AI features', icon: Sparkles, color: 'text-cyan-400' },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="text-center lg:text-left group">
                <div className="mb-1.5 flex items-center justify-center lg:justify-start gap-2">
                  <Icon className={`h-4 w-4 ${color} transition-transform group-hover:scale-110`} />
                  <p className="stat-num text-3xl font-extrabold text-slate-100">{value}</p>
                </div>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
