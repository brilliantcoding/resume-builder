import { FileText, GitBranch, MessageSquare, Share2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const columns = [
  {
    heading: 'Product',
    items: [
      { label: 'Features', href: '#features' },
      { label: 'Templates', href: '#templates' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Sign in', href: '/login' },
      { label: 'Create free resume', href: '/register' },
      { label: 'Home', href: '/' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'Privacy policy', href: '#' },
      { label: 'Terms of service', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

const socials = [
  { label: 'GitHub', href: '#', icon: GitBranch },
  { label: 'Twitter', href: '#', icon: MessageSquare },
  { label: 'LinkedIn', href: '#', icon: Share2 },
]

export function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Premium CTA band */}
        <div className="relative overflow-hidden rounded-3xl border border-crimson-500/20 bg-card px-6 py-12 sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.15] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)]" />
          <div className="animate-orb-drift pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-crimson-500/[0.1] blur-[100px]" />
          <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-28 -left-20 h-[280px] w-[280px] rounded-full bg-emerald-600/[0.08] blur-[90px]" />

          <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-crimson-500/25 bg-crimson-500/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-crimson-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson-400" />
                </span>
                Trusted by 10,000+ job seekers
              </div>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
                Your next job starts with a
                <span className="gradient-text"> better resume</span>
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Free forever. No credit card. AI writes the content — you land the interviews.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/register">
                <button className="btn-gradient group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white">
                  Build your resume — free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center gap-2 rounded-full border border-default bg-white/[0.03] px-6 py-3.5 text-[15px] font-semibold text-secondary transition-all hover:border-crimson-500/35 hover:text-primary">
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="mb-5 inline-flex items-center gap-3 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-lg shadow-crimson-600/20 ring-1 ring-white/15 transition-transform group-hover:scale-105">
                <FileText className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent opacity-70" />
              </div>
              <span className="font-display text-[18px] font-bold tracking-tight">
                <span className="text-primary">Resume</span>
                <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted">
              Build professional, ATS-optimized resumes in minutes with AI-powered content generation and 15 recruiter-approved templates.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-default text-muted transition-all hover:-translate-y-0.5 hover:border-crimson-500/35 hover:bg-crimson-500/[0.08] hover:text-crimson-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.heading}>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.14em] text-crimson-400/80">{column.heading}</p>
              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-crimson-300"
                    >
                      <span className="h-px w-0 bg-crimson-400 transition-all duration-200 group-hover:w-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-default py-7 sm:flex-row">
          <div className="flex items-center gap-4 text-xs text-muted">
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-muted">All systems operational</span>
            <span className="mx-1 text-crimson-400">·</span>
            <span className="text-muted">Built with Next.js</span>
            <span className="text-crimson-400">·</span>
            <span className="text-muted">Powered by local AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
