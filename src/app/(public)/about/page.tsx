import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Link from 'next/link'
import { BookOpen, Target, Users, Award, TrendingUp, Globe } from 'lucide-react'

const TEAM = [
  { name: 'Oluwatosin Ayeni', role: 'Founder & CEO', bio: 'Education advocate with a passion for making international curriculum accessible to every Nigerian student.' },
  { name: 'Adaeze Okonkwo', role: 'Head of Tutor Verification', bio: 'Former Cambridge examiner with 10+ years in international education quality assurance.' },
  { name: 'Emeka Nwosu', role: 'Head of Technology', bio: 'Full-stack engineer building the infrastructure that connects knowledge with learners across Nigeria.' },
]

const VALUES = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'We hold every tutor and institution on our platform to the highest academic standards.' },
  { icon: Target, title: 'Verified Quality', desc: 'Every tutor is background-checked, qualification-verified, and independently reviewed.' },
  { icon: Globe, title: 'Nigeria-First', desc: 'Built specifically for the Nigerian context — our currency, our cities, our curricula.' },
  { icon: Users, title: 'Community Driven', desc: 'A platform shaped by students, parents, tutors and schools working together.' },
  { icon: Award, title: 'Recognition', desc: 'We celebrate outstanding educators through annual awards and public leaderboards.' },
  { icon: TrendingUp, title: 'Continuous Growth', desc: 'We invest in tutor CPD and student tools so learning never stops.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="nexora-gradient text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black mb-5">About Nexora Academic</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Nigeria&apos;s most trusted platform connecting students with verified IGCSE, A-Level, IB, and SAT tutors — and helping schools and universities reach the next generation of learners.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Our Mission</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Connecting Knowledge, Unlocking Futures</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nexora Academic was founded on a simple belief: every Nigerian student deserves access to world-class tutoring and education guidance, regardless of where they live.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We built a platform that makes it effortless to find verified tutors for Cambridge IGCSE, A-Level, IB Diploma, SAT, and WAEC — while giving tutors the tools, recognition, and income they deserve.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { num: '10,000+', label: 'Target Tutors' },
                { num: '50,000+', label: 'Target Students' },
                { num: '100+', label: 'Partner Schools' },
                { num: '6', label: 'States Covered' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-black text-[#0f3460]">{stat.num}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">What We Stand For</div>
            <h2 className="text-3xl font-black text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-[#0f3460]/10 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-[#0f3460]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">The People</div>
          <h2 className="text-3xl font-black text-gray-900">Meet the Team</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {TEAM.map(member => (
            <div key={member.name} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0f3460] to-[#533483] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-black">{member.name[0]}</span>
              </div>
              <h3 className="font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="nexora-gradient text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Join the Nexora Community</h2>
          <p className="text-white/80 mb-8">Whether you&apos;re a tutor, student, parent, or school — there&apos;s a place for you on Nexora Academic.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-[#0f3460] font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Get Started
            </Link>
            <Link href="/contact" className="border border-white/40 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
