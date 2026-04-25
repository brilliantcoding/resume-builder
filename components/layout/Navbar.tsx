'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FileText, LogOut, LayoutDashboard, Sparkles, ChevronDown } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.05]">
      {/* Thin accent line at top */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm shadow-violet-500/30 transition-all duration-300 group-hover:shadow-violet-500/50 group-hover:scale-105">
              <FileText className="h-4 w-4 text-white" strokeWidth={2.2} />
              {/* Shine */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-60" />
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight">
              <span className="text-slate-100">Resume</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Nav links (desktop) */}
          {!session && (
            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="#features"
                className="nav-underline rounded-lg px-3.5 py-2 text-slate-400 transition-colors hover:text-slate-100 hover:bg-white/[0.04]"
              >
                Features
              </Link>
              <Link
                href="#templates"
                className="nav-underline rounded-lg px-3.5 py-2 text-slate-400 transition-colors hover:text-slate-100 hover:bg-white/[0.04]"
              >
                Templates
              </Link>
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {(session.user?.name?.[0] || session.user?.email?.[0] || '?').toUpperCase()}
                  </div>
                  <span className="font-medium">{session.user?.name?.split(' ')[0] || session.user?.email}</span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </div>
                <Link href="/dashboard">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.08] hover:text-slate-100">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-white/[0.05] hover:text-slate-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/[0.05] hover:text-slate-100">
                    Sign in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-gradient inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    Get started free
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
