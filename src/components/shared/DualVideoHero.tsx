'use client'

import { useEffect, useRef, useState } from 'react'

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
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState<'a' | 'b'>('a')

  useEffect(() => {
    const a = aRef.current
    const b = bRef.current
    if (!a || !b) return

    a.muted = true
    b.muted = true

    function onAEnd() {
      b.currentTime = 0
      b.play().catch(() => {})
      setActive('b')
    }
    function onBEnd() {
      a.currentTime = 0
      a.play().catch(() => {})
      setActive('a')
    }

    a.addEventListener('ended', onAEnd)
    b.addEventListener('ended', onBEnd)
    a.play().catch(() => {})

    return () => {
      a.removeEventListener('ended', onAEnd)
      b.removeEventListener('ended', onBEnd)
    }
  }, [])

  return (
    <div style={{ position: 'relative', minHeight, overflow: 'hidden', color: 'white' }}>
      {/* Video A */}
      <video
        ref={aRef}
        src={leftVideo}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: active === 'a' ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />
      {/* Video B — hidden until A ends */}
      <video
        ref={bRef}
        src={rightVideo}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: active === 'b' ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />

      {/* Overlay */}
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
