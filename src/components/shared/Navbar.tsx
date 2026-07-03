'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, BookOpen, ChevronDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  {
    label: 'Find Tutors',
    href: '/tutors',
    children: [
      { label: 'Search Tutors', href: '/tutors' },
      { label: 'IGCSE Tutors', href: '/tutors?curriculum=igcse' },
      { label: 'A-Level Tutors', href: '/tutors?curriculum=a_level' },
      { label: 'SAT Tutors', href: '/tutors?curriculum=sat' },
      { label: 'IB Tutors', href: '/tutors?curriculum=ib' },
      { label: 'WAEC Tutors', href: '/tutors?curriculum=waec' },
      { label: 'NECO Tutors', href: '/tutors?curriculum=neco' },
      { label: 'JAMB Tutors', href: '/tutors?curriculum=jamb' },
    ],
  },
  {
    label: 'Schools',
    href: '/schools',
    children: [
      { label: 'Find Schools', href: '/schools' },
    ],
  },
  { label: 'Universities', href: '/universities' },
  { label: 'Exams', href: '/exams' },
  { label: 'Resources', href: '/resources' },
  { label: 'Community', href: '/community' },
  { label: 'AI Tutor', href: '/ai-tutor', highlight: true },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleDropdown(label: string) {
    setActiveDropdown(prev => (prev === label ? null : label))
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setActiveDropdown(null)}>
            <div className="w-8 h-8 nexora-gradient rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <div className="font-black text-slate-900 text-lg tracking-tight">Nexora Academic</div>
              <div className="text-[9px] text-slate-500 font-medium tracking-widest uppercase hidden sm:block">Connecting Knowledge, Unlocking Futures</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative">
                {link.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        activeDropdown === link.label
                          ? 'text-[#0f3460] bg-slate-50'
                          : 'text-slate-700 hover:text-[#0f3460] hover:bg-slate-50'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('w-3 h-3 opacity-60 transition-transform', activeDropdown === link.label && 'rotate-180')} />
                    </button>
                    {activeDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0f3460] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (link as { highlight?: boolean }).highlight ? (
                  <Link
                    href={link.href}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-[#0f3460] rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-[#0f3460] transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white nexora-gradient px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(prev => prev === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg"
                    >
                      {link.label}
                      <ChevronDown className={cn('w-4 h-4 opacity-60 transition-transform', mobileExpanded === link.label && 'rotate-180')} />
                    </button>
                    {mobileExpanded === link.label && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => { setMobileOpen(false); setMobileExpanded(null) }}
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-3 flex flex-col gap-2 px-4">
              <Link href="/login" className="text-sm font-medium text-slate-700 py-2 text-center border border-slate-200 rounded-lg">Sign in</Link>
              <Link href="/register" className="text-sm font-semibold text-white text-center nexora-gradient py-2 rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
