'use client'
import { useState, useRef, useEffect, ReactNode } from 'react'

interface SplitViewProps {
  left: ReactNode
  right: ReactNode
  initialLeftWidth?: string | number
  className?: string
}

export function SplitView({ left, right, initialLeftWidth = '40%', className = '' }: SplitViewProps) {
  const [leftWidth, setLeftWidth] = useState<string | number>(initialLeftWidth)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || !leftRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = e.clientX - containerRect.left

      const minWidth = 250
      const maxWidth = containerRect.width * 0.75
      const clampedWidth = Math.max(minWidth, Math.min(newLeftWidth, maxWidth))

      setLeftWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      window.addEventListener('mousemove', handleResize)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full overflow-hidden rounded-2xl border border-default bg-card ${className}`}
    >
      {/* Left Panel */}
      <div
        ref={leftRef}
        className={`flex flex-col transition-all duration-300 ease-in-out ${isResizing ? 'pointer-events-none' : ''}`}
        style={{ width: leftWidth }}
      >
        {left}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`group flex w-1 cursor-col-resize items-center justify-center bg-white/[0.03] transition-all hover:bg-crimson-500/40 active:bg-crimson-500/60 ${
          isResizing ? 'bg-crimson-500/60' : ''
        }`}
        title="Drag to resize"
      >
        <div className="flex h-16 flex-col items-center justify-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-crimson-400" />
          <div className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-crimson-400" />
          <div className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-crimson-400" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col overflow-hidden">{right}</div>
    </div>
  )
}
