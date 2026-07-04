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
  minHeight = '380px',
  contentClassName = 'py-14 px-4',
}: DualVideoHeroProps) {
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    [leftRef.current, rightRef.current].forEach((v) => {
      if (!v) return
      v.muted = true
      v.play().catch(() => {})
    })
  }, [])

  return (
    <div className="relative overflow-hidden text-white" style={{ minHeight }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        <video
          ref={leftRef}
          src={leftVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: '50%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <video
          ref={rightRef}
          src={rightVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: '50%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: overlay,
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }} className={contentClassName}>
        {children}
      </div>
    </div>
  )
}
