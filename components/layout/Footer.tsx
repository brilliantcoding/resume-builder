import { FileText, Zap, GitBranch, MessageSquare, Share2 } from 'lucide-react'
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
  { label: 'GitHub', href: '#', icon: GitBranch },
  { label: 'Twitter', href: '#', icon: MessageSquare },
  { label: 'LinkedIn', href: '#', icon: Share2 },
]

export function Footer() {
  return (
    <footer className="relative border-t border-default bg-card">
      {/* Top divider glow with crimson theme */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-3xl bg-gradient-to-r from-transparent via-crimson-500/40 to-transparent shadow-[0_0_30px_rgba(20,184,166,0.2)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all group-hover:shadow-[0_0_40px_rgba(20,184,166,0.6)] group-hover:scale-110">
                <FileText className="h-4 w-4 text-white" strokeWidth={2.2} />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-70" />
              </div>
              <span className="font-display text-[17px] font-bold tracking-tight">
                <span className="text-slate-100">Resume</span>
                <span className="text-crimson-500">AI</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
              Build professional, ATS-optimized resumes in minutes with AI-powered content generation and 9 stunning templates.
            </p>

            {/* Powered by badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-crimson-500/25 bg-crimson-500/[0.12] px-3 py-1.5 text-xs font-medium text-crimson-300 backdrop-blur-sm shadow-[0_0_20px_rgba(20,184,166,0.2)]">
              <Zap className="h-3 w-3 text-crimson-300" />
              <span>AI-powered resume tools</span>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 items-center justify-center rounded-lg border border-crimson-500/25 bg-crimson-500/[0.08] px-2.5 text-xs font-medium text-crimson-300 transition-all hover:border-crimson-500/40 hover:bg-crimson-500/[0.12] hover:text-crimson-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{heading}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block text-sm text-slate-500 transition-all hover:text-crimson-300 hover:translate-x-1 hover:drop-shadow-[0_0_5px_rgba(20,184,166,0.3)]"
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
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-crimson-300">Built with Next.js</span>
            <span className="text-amber-500">·</span>
            <span className="text-orange-300">AI-assisted tools</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
