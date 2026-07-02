import Link from 'next/link'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  'Find Tutors': [
    { label: 'IGCSE Tutors', href: '/tutors?curriculum=igcse' },
    { label: 'A-Level Tutors', href: '/tutors?curriculum=a_level' },
    { label: 'SAT Tutors', href: '/tutors?curriculum=sat' },
    { label: 'IB Diploma Tutors', href: '/tutors?curriculum=ib' },
    { label: 'All Tutors', href: '/tutors' },
  ],
  'Platform': [
    { label: 'Find Schools', href: '/schools' },
    { label: 'University Guide', href: '/universities' },
    { label: 'Examination Hub', href: '/exams' },
    { label: 'Resources & Notes', href: '/resources' },
    { label: 'Community', href: '/community' },
  ],
  'For Tutors': [
    { label: 'Register as Tutor', href: '/register?role=tutor' },
    { label: 'Tutor Dashboard', href: '/tutor-dashboard/dashboard' },
{ label: 'Job Board', href: '/jobs' },
    { label: 'CPD Tracker', href: '/cpd' },
  ],
  'Company': [
    { label: 'About Nexora', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Sitemap', href: '/sitemap' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#16213e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="leading-none">
                <div className="font-black text-white text-lg tracking-tight">Nexora Academic</div>
                <div className="text-[9px] text-white/50 tracking-widest uppercase">Connecting Knowledge, Unlocking Futures</div>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Nigeria&apos;s most trusted platform for verified IGCSE, A-Level, IB, and SAT tutors and schools.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@nexora.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" /> hello@nexora.com
              </a>
              <a href="tel:+2348000000000" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" /> +234 800 000 0000
              </a>
              <span className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-3.5 h-3.5" /> Lagos, Nigeria
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Nexora Academic — Connecting Knowledge, Unlocking Futures. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">Curricula covered:</span>
            {['IGCSE', 'A-Level', 'Edexcel', 'IB', 'SAT', 'ACT'].map((c) => (
              <span key={c} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
