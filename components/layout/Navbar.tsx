'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FileText, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      data-scrolled={scrolled}
      className={`site-navbar sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-default shadow-[0_1px_0_rgba(48,164,108,0.12),0_8px_32px_rgba(0,0,0,0.14)]' : 'border-b border-transparent'
      }`}
    >
      {/* Premium hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-500/50 to-transparent" />

      {/* Soft fade so content glides under the glass instead of hitting its edge */}
      <div
        aria-hidden
        className={`nav-veil pointer-events-none absolute inset-x-0 top-full h-7 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700 shadow-lg shadow-crimson-600/25 ring-1 ring-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-crimson-500/40">
              <FileText className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent opacity-70" />
            </div>
            <span className="font-display text-[18px] font-bold tracking-tight">
              <span className="text-primary">Resume</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Nav links (desktop) */}
          {!session && (
            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="#features"
                className="nav-underline rounded-full px-4 py-2 text-muted transition-colors hover:bg-crimson-500/[0.06] hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#templates"
                className="nav-underline rounded-full px-4 py-2 text-muted transition-colors hover:bg-crimson-500/[0.06] hover:text-primary"
              >
                Templates
              </Link>
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="hidden sm:block h-5 w-px bg-white/10" />

            {session ? (
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-default bg-crimson-500/[0.05] py-1.5 pl-1.5 pr-3.5 text-sm text-secondary">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-crimson-500 to-crimson-700 text-[10px] font-bold text-white ring-1 ring-white/15">
                    {(session.user?.name?.[0] || session.user?.email?.[0] || '?').toUpperCase()}
                  </div>
                  <span className="max-w-[140px] truncate font-medium">{session.user?.name?.split(' ')[0] || session.user?.email}</span>
                </div>
                <Link href="/dashboard">
                  <button className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  aria-label="Sign out"
                  className="inline-flex items-center gap-1.5 rounded-full border border-default px-3 py-2 text-sm font-medium text-muted transition-all hover:border-crimson-500/30 hover:text-primary"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <button className="rounded-full px-4 py-2 text-sm font-medium text-secondary transition-all hover:bg-crimson-500/[0.06] hover:text-primary">
                    Sign in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-gradient group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white">
                    Get started free
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
