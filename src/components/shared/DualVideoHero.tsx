'use client'

import { useEffect, useRef } from 'react'

interface DualVideoHeroProps {
  leftVideo: string
  rightVideo: string
  overlay?: string
  children: React.ReactNode
  minHeight?: string
  contentClassName?: string
}

export default function DualVideoHero({
  leftVideo,
  rightVideo,
  overlay = 'rgba(15,52,96,0.72)',
  children,
  minHeight = '420px',
  contentClassName = 'py-14 px-4',
}: DualVideoHeroProps) {
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const play = (v: HTMLVideoElement | null) => {
      if (!v) return
      v.muted = true
      v.play().catch(() => {})
    }
    play(leftRef.current)
    play(rightRef.current)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight, overflow: 'hidden', color: 'white' }}>
      {/* Left video panel */}
      <video
        ref={leftRef}
        src={leftVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {/* Right video panel */}
      <video
        ref={rightRef}
        src={rightVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '50%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Unified dark overlay — ties both panels into one cohesive background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: overlay,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }} className={contentClassName}>
        {children}
      </div>
    </div>
  )
}
