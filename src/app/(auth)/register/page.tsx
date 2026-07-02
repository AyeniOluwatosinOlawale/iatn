'use client'

import Link from 'next/link'
import { BookOpen, GraduationCap, Users, School } from 'lucide-react'

const roles = [
  {
    key: 'tutor',
    icon: GraduationCap,
    title: 'I am a Tutor',
    description: 'Register as a professional IGCSE, A-Level, IB, or SAT tutor. Get your unique Nexora number and start earning.',
    href: '/register/tutor',
    color: 'border-[#0f3460] bg-[#f0f4ff]',
    iconColor: 'nexora-gradient',
    cta: 'Register as Tutor',
  },
  {
    key: 'student',
    icon: Users,
    title: 'I am a Student',
    description: 'Find verified tutors, take mock exams, use AI study tools, and prepare for Cambridge exams.',
    href: '/register/student',
    color: 'border-purple-300 bg-purple-50',
    iconColor: 'nexora-gradient-purple',
    cta: 'Register as Student',
  },
  {
    key: 'parent',
    icon: Users,
    title: 'I am a Parent',
    description: 'Find tutors and schools for your child. Monitor progress, pay for lessons, and communicate with teachers.',
    href: '/register/parent',
    color: 'border-emerald-300 bg-emerald-50',
    iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    cta: 'Register as Parent',
  },
  {
    key: 'school',
    icon: School,
    title: 'We are a School',
    description: 'List your school, recruit verified teachers, manage admissions, and reach thousands of parents.',
    href: '/register/school',
    color: 'border-amber-300 bg-amber-50',
    iconColor: 'bg-gradient-to-br from-amber-500 to-amber-700',
    cta: 'Register Your School',
  },
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 nexora-gradient rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-slate-900 text-xl tracking-tight">Nexora</span>
      </Link>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900">Join Nexora Academic</h1>
        <p className="text-slate-500 mt-2">Nigeria&apos;s international education platform. Who are you?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full">
        {roles.map((role) => (
          <Link
            key={role.key}
            href={role.href}
            className={`group bg-white rounded-2xl border-2 ${role.color} p-6 hover:shadow-lg transition-all`}
          >
            <div className={`w-12 h-12 ${role.iconColor} rounded-xl flex items-center justify-center mb-4`}>
              <role.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{role.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{role.description}</p>
            <span className="text-sm font-semibold text-[#0f3460] group-hover:underline">{role.cta} →</span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#0f3460] hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
