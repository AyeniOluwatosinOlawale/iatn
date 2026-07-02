import { Shield, Star, Award, CheckCircle2, BadgeCheck } from 'lucide-react'
import type { BadgeType } from '@/types'
import { cn } from '@/lib/utils'

const badgeConfig: Record<BadgeType, { label: string; icon: React.ElementType; className: string }> = {
  verified_tutor:       { label: 'Verified',           icon: BadgeCheck,    className: 'badge-verified' },
  identity_verified:    { label: 'ID Verified',        icon: CheckCircle2,  className: 'badge-verified' },
  qualification_verified: { label: 'Qual. Verified',   icon: CheckCircle2,  className: 'badge-cambridge' },
  background_verified:  { label: 'BG Checked',         icon: Shield,        className: 'badge-cambridge' },
  cambridge_expert:     { label: 'Cambridge Expert',   icon: Award,         className: 'badge-cambridge' },
  top_tutor:            { label: 'Top Tutor',          icon: Star,          className: 'badge-top' },
}

interface BadgeChipProps {
  badge: BadgeType
  className?: string
}

export default function BadgeChip({ badge, className }: BadgeChipProps) {
  const config = badgeConfig[badge]
  if (!config) return null
  const Icon = config.icon

  return (
    <span className={cn(config.className, className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
