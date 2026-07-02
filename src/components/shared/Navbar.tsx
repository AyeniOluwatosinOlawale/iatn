'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react'
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
    ],
  },
  {
    label: 'Schools',
    href: '/schools',
    children: [
      { label: 'Find Schools', href: '/schools' },
      { label: 'Compare Schools', href: '/schools/compare' },
    ],
  },
  { label: 'Universities', href: '/universities' },
  { label: 'Exams', href: '/exams' },
  { label: 'Resources', href: '/resources' },
  { label: 'Community', href: '/community' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 iatn-gradient rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <div className="font-black text-slate-900 text-lg tracking-tight">IATN</div>
              <div className="text-[9px] text-slate-500 font-medium tracking-widest uppercase hidden sm:block">Int&apos;l Academic Tutors Nigeria</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg transition-colors'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3 h-3 opacity-60" />}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0f3460] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
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
              className="text-sm font-semibold text-white iatn-gradient px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
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
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#0f3460] hover:bg-slate-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-3 flex flex-col gap-2 px-4">
              <Link href="/login" className="text-sm font-medium text-slate-700 py-2 text-center border border-slate-200 rounded-lg">Sign in</Link>
              <Link href="/register" className="text-sm font-semibold text-white text-center iatn-gradient py-2 rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
