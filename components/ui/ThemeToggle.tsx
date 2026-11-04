'use client'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, type Theme } from './theme'

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme: Theme =
      document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    applyTheme(nextTheme, true)
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white/[0.08] hover:text-slate-200 active:scale-95"
      aria-label="Toggle color theme"
    >
      <Sun className="theme-toggle-sun h-4.5 w-4.5" aria-hidden="true" />
      <Moon className="theme-toggle-moon h-4.5 w-4.5" aria-hidden="true" />
    </button>
  )
}
