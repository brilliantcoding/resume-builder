'use client'
import { ButtonHTMLAttributes } from 'react'
import { Sparkles } from 'lucide-react'

interface AIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  label?: string
  size?: 'sm' | 'md'
}

export function AIButton({ loading, label = 'AI', size = 'sm', className = '', ...props }: AIButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}
        bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm
        ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <Sparkles className="h-3 w-3" />
      )}
      {label}
    </button>
  )
}
