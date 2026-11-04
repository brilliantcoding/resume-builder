'use client'
import { useEffect } from 'react'
import { applyTheme, getInitialTheme } from './theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getInitialTheme())
  }, [])

  return children
}
