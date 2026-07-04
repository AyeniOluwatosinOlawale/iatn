'use client'

import { useRef, useState, useCallback } from 'react'

export default function DualVideoHero({ src1, src2 }: { src1: string; src2: string }) {
  const [active, setActive] = useState(0)
  const ref0 = useRef<HTMLVideoElement>(null)
  const ref1 = useRef<HTMLVideoElement>(null)

  const handleEnded0 = useCallback(() => {
    ref1.current?.play()
    setActive(1)
  }, [])

  const handleEnded1 = useCallback(() => {
    ref0.current?.play()
    setActive(0)
  }, [])

  return (
    <>
      <video
        ref={ref0}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${active === 0 ? 'opacity-100' : 'opacity-0'}`}
        muted playsInline autoPlay preload="auto" aria-hidden="true"
        onEnded={handleEnded0}
      >
        <source src={src1} type="video/mp4" />
      </video>
      <video
        ref={ref1}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${active === 1 ? 'opacity-100' : 'opacity-0'}`}
        muted playsInline preload="auto" aria-hidden="true"
        onEnded={handleEnded1}
      >
        <source src={src2} type="video/mp4" />
      </video>
    </>
  )
}
