'use client'

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
  minHeight = '340px',
  contentClassName = 'py-14 px-4',
}: DualVideoHeroProps) {
  return (
    <div className="relative overflow-hidden text-white" style={{ minHeight }}>
      {/* Dual video background */}
      <div className="absolute inset-0 flex">
        <video
          className="w-1/2 h-full object-cover"
          src={leftVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
        <video
          className="w-1/2 h-full object-cover"
          src={rightVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Unified overlay — ties both panels together */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${overlay} 0%, ${overlay} 100%)` }}
      />
      {/* Subtle centre seam blur so split isn't noticeable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 30% 100% at 50% 50%, rgba(0,0,0,0.18) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  )
}
