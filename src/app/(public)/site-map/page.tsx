import Link from 'next/link'
import { BookOpen, Users, School, GraduationCap, FileText, Brain, Briefcase, MessageSquare, BookMarked, Shield, MapPin, Mail } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Find Tutors',
    icon: Users,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    links: [
      { label: 'Browse All Tutors', href: '/tutors' },
      { label: 'Cambridge A-Level Tutors', href: '/tutors?curriculum=Cambridge+A-Level' },
      { label: 'Cambridge IGCSE Tutors', href: '/tutors?curriculum=Cambridge+IGCSE' },
      { label: 'IB Diploma Tutors', href: '/tutors?curriculum=IB+Diploma' },
      { label: 'WAEC / WASSCE Tutors', href: '/tutors?curriculum=WAEC+%2F+WASSCE' },
      { label: 'SAT Preparation', href: '/tutors?curriculum=SAT' },
    ],
  },
  {
    title: 'Schools & Universities',
    icon: School,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    links: [
      { label: 'Browse Schools', href: '/schools' },
      { label: 'Universities Guide', href: '/universities' },
      { label: 'Register Your School', href: '/register/school' },
    ],
  },
  {
    title: 'Examinations',
    icon: FileText,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    links: [
      { label: 'Examination Hub', href: '/exams' },
      { label: 'Past Questions & Resources', href: '/resources' },
      { label: 'CPD for Educators', href: '/cpd' },
    ],
  },
  {
    title: 'AI Tutor',
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    links: [
      { label: 'AI Examination Intelligence', href: '/ai-tutor' },
      { label: 'Solve Past Papers', href: '/ai-tutor' },
      { label: 'Essay Review & Feedback', href: '/ai-tutor' },
      { label: 'Mark Scheme Analysis', href: '/ai-tutor' },
    ],
  },
  {
    title: 'Community',
    icon: MessageSquare,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    links: [
      { label: 'Community Forum', href: '/community' },
      { label: 'Jobs Board', href: '/jobs' },
    ],
  },
  {
    title: 'Register',
    icon: GraduationCap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    links: [
      { label: 'Register as Student', href: '/register/student' },
      { label: 'Register as Parent', href: '/register/parent' },
      { label: 'Register as Tutor', href: '/register/tutor' },
      { label: 'Register Your School', href: '/register/school' },
      { label: 'Sign In', href: '/login' },
    ],
  },
  {
    title: 'Company',
    icon: BookMarked,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    links: [
      { label: 'About Nexora Academic', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    title: 'Dashboards',
    icon: Briefcase,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    links: [
      { label: 'Student Dashboard', href: '/student-dashboard/dashboard' },
      { label: 'Tutor Dashboard', href: '/tutor-dashboard/dashboard' },
      { label: 'Parent Dashboard', href: '/parent-dashboard/dashboard' },
      { label: 'School Dashboard', href: '/school-dashboard/dashboard' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 nexora-gradient rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tight">Nexora</span>
          </Link>
          <span className="text-slate-300 text-xl font-light">/</span>
          <span className="text-slate-600 font-semibold">Sitemap</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Sitemap</h1>
          <p className="text-slate-500">Every page on Nexora Academic — Nigeria&apos;s international education platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {SECTIONS.map(section => {
            const Icon = section.icon
            return (
              <div key={section.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className={`w-9 h-9 ${section.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${section.color}`} />
                </div>
                <h2 className="font-bold text-slate-900 mb-3 text-sm">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-sm text-slate-500 hover:text-indigo-600 hover:underline transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Contact / Address strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Contact & Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Address</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  8 Bode Ajayi Street, Fortune City<br />
                  Ologuneru, Ibadan<br />
                  Oyo State, Nigeria
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                <a href="mailto:hello@nexora-academic.com" className="text-sm text-slate-700 hover:text-indigo-600 transition-colors">
                  hello@nexora-academic.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Legal</p>
                <div className="space-y-1">
                  <Link href="/privacy" className="block text-sm text-slate-700 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="block text-sm text-slate-700 hover:text-indigo-600 transition-colors">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Nexora Academic · All rights reserved
        </p>
      </div>
    </div>
  )
}
