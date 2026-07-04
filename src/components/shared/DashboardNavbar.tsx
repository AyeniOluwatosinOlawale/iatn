'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, Menu, X, ChevronDown, Sparkles, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type NavItem = { label: string; href: string; icon?: string }

const SITE_LINKS = [
  { label: 'Find Tutors',   href: '/tutors' },
  { label: 'Schools',       href: '/schools' },
  { label: 'Universities',  href: '/universities' },
  { label: 'Exams',         href: '/exams' },
  { label: 'Resources',     href: '/resources' },
  { label: 'Community',     href: '/community?from=dashboard' },
]

const DASHBOARD_LINKS: Record<string, NavItem[]> = {
  tutor: [
    { label: 'Dashboard',     href: '/tutor-dashboard/dashboard',          icon: '🏠' },
    { label: 'Bookings',      href: '/tutor-dashboard/bookings',           icon: '📅' },
    { label: 'Analytics',     href: '/tutor-dashboard/analytics',          icon: '📊' },
    { label: 'Sell Resources',href: '/tutor-dashboard/resources/sell',     icon: '📚' },
  ],
  student: [
    { label: 'Dashboard',     href: '/student-dashboard/dashboard',        icon: '🏠' },
    { label: 'My Bookings',   href: '/student-dashboard/bookings',         icon: '📅' },
    { label: 'Mock Exams',    href: '/student-dashboard/mock-exams',       icon: '📝' },
    { label: 'Study Plan',    href: '/student-dashboard/study-plan',       icon: '📖' },
  ],
  parent: [
    { label: 'Dashboard',     href: '/parent-dashboard/dashboard',         icon: '🏠' },
    { label: 'My Children',   href: '/parent-dashboard/children',          icon: '👧' },
    { label: 'Payments',      href: '/parent-dashboard/payments',          icon: '💳' },
  ],
  school: [
    { label: 'Dashboard',     href: '/school-dashboard/dashboard',         icon: '🏠' },
    { label: 'Edit Profile',  href: '/school-dashboard/profile/edit',      icon: '✏️' },
    { label: 'Recruitment',   href: '/school-dashboard/recruitment',       icon: '📋' },
    { label: 'Admissions',    href: '/school-dashboard/admissions',        icon: '🎓' },
    { label: 'Analytics',     href: '/school-dashboard/analytics',         icon: '📊' },
  ],
}

export default function DashboardNavbar({
  role,
  userName,
}: {
  role: 'tutor' | 'student' | 'parent' | 'school'
  userName: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [siteOpen, setSiteOpen] = useState(false)
  const dashLinks = DASHBOARD_LINKS[role] ?? []

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const roleLabel = role === 'tutor' ? 'Tutor' : role === 'student' ? 'Student' : role === 'parent' ? 'Parent' : 'School'
  const roleColor = role === 'tutor' ? 'bg-purple-100 text-purple-700' : role === 'student' ? 'bg-blue-100 text-blue-700' : role === 'parent' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 nexora-gradient rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 text-base tracking-tight hidden sm:block">Nexora Academic</span>
          </Link>

          {/* Desktop: Dashboard links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {dashLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-slate-100 text-[#0f3460] font-semibold'
                    : 'text-slate-600 hover:text-[#0f3460] hover:bg-slate-50'
                )}
              >
                <span className="text-base leading-none">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Site features dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setSiteOpen(v => !v)}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors border border-slate-200',
                  siteOpen ? 'bg-slate-50 text-[#0f3460]' : 'text-slate-600 hover:text-[#0f3460] hover:bg-slate-50'
                )}
              >
                Explore Site
                <ChevronDown className={cn('w-3.5 h-3.5 opacity-60 transition-transform', siteOpen && 'rotate-180')} />
              </button>
              {siteOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                  {SITE_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSiteOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0f3460] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      href="/ai-tutor?from=dashboard"
                      onClick={() => setSiteOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Tutor
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleColor}`}>{roleLabel}</span>
            <div className="w-8 h-8 nexora-gradient rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {userName[0]?.toUpperCase() ?? '?'}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-1">
            <div className="px-3 pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 nexora-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {userName[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{userName}</div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${roleColor}`}>{roleLabel}</span>
                </div>
              </div>
            </div>

            <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">My Dashboard</p>
            {dashLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-lg mx-1',
                  pathname === link.href
                    ? 'bg-slate-100 text-[#0f3460] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#0f3460]'
                )}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 my-2 pt-2">
              <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Explore</p>
              {SITE_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-600 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg mx-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/ai-tutor?from=dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 rounded-lg mx-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Tutor
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-3 px-4">
              <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg w-full">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
