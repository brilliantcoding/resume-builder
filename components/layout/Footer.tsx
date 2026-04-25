import { FileText, Zap } from 'lucide-react'
import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Account: [
    { label: 'Sign in', href: '/login' },
    { label: 'Get started', href: '/register' },
    { label: 'Home', href: '/' },
  ],
}

const socials = [
  { label: 'GitHub', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] bg-[#0B0B1A]">
      {/* Top divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-3xl bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm shadow-violet-500/30 transition-all group-hover:shadow-violet-500/50">
                <FileText className="h-4 w-4 text-white" strokeWidth={2.2} />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-60" />
              </div>
              <span className="font-display text-[17px] font-bold tracking-tight">
                <span className="text-slate-100">Resume</span>
                <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-500">
              Build professional, ATS-optimized resumes in minutes with AI-powered content generation and 9 stunning templates.
            </p>

            {/* NVIDIA badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-500">
              <Zap className="h-3 w-3 text-emerald-500" />
              Powered by NVIDIA NIM
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 text-xs font-medium text-slate-500 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.08] hover:text-violet-400"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">{heading}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] py-6 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js · AI by NVIDIA NIM
          </p>
        </div>
      </div>
    </footer>
  )
}
