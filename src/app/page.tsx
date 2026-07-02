import Link from 'next/link'
import { Search, Star, Shield, Award, Users, BookOpen, TrendingUp, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const stats = [
  { value: '2,000+', label: 'Verified Tutors' },
  { value: '200+', label: 'Schools Listed' },
  { value: '50,000+', label: 'Students Helped' },
  { value: '4.9★', label: 'Platform Rating' },
]

const curricula = [
  { name: 'Cambridge IGCSE', href: '/tutors?curriculum=igcse', color: 'from-blue-500 to-blue-700', count: '420+ tutors' },
  { name: 'Cambridge A-Level', href: '/tutors?curriculum=a_level', color: 'from-indigo-500 to-indigo-700', count: '380+ tutors' },
  { name: 'IB Diploma', href: '/tutors?curriculum=ib', color: 'from-purple-500 to-purple-700', count: '120+ tutors' },
  { name: 'SAT / ACT', href: '/tutors?curriculum=sat', color: 'from-rose-500 to-rose-700', count: '95+ tutors' },
  { name: 'Pearson Edexcel', href: '/tutors?curriculum=edexcel', color: 'from-emerald-500 to-emerald-700', count: '200+ tutors' },
  { name: 'OxfordAQA', href: '/tutors?curriculum=oxfordaqa', color: 'from-amber-500 to-amber-700', count: '85+ tutors' },
]

const subjects = [
  'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Economics', 'Business Studies', 'Computer Science', 'English Language', 'Geography',
]

const features = [
  {
    icon: Shield,
    title: 'Verified & Trusted',
    description: 'Every tutor is manually verified. We check qualifications, identity, and Cambridge track records before issuing a verification badge.',
  },
  {
    icon: TrendingUp,
    title: 'Proven Cambridge Results',
    description: 'See real data: A*/A pass rates, number of students taught, and outstanding learner awards — all admin-verified.',
  },
  {
    icon: Star,
    title: 'Rated by Students',
    description: 'Hundreds of verified student reviews so you can choose with confidence. Every review is from a real lesson booking.',
  },
  {
    icon: BookOpen,
    title: 'AI-Powered Learning',
    description: 'AI study assistant, personalised study plans, mock exams, and AI homework feedback — all built in to help students excel.',
  },
  {
    icon: Users,
    title: 'Schools & Universities',
    description: 'Compare IGCSE and A-Level schools, explore university pathways, and access our full examination hub.',
  },
  {
    icon: Award,
    title: 'Unique IATN Number',
    description: 'Every registered tutor receives a unique IATN-YYYY-NNNNNN professional registration number — your verified digital identity.',
  },
]

const testimonials = [
  {
    name: 'Mrs. Adaobi Okonkwo',
    role: 'Parent, Lagos',
    quote: 'I found my daughter an A-Level Chemistry tutor through IATN. She went from a D to an A* in six months. The verified badge gave me the confidence I needed.',
    rating: 5,
  },
  {
    name: 'Emeka Nwosu',
    role: 'IGCSE Student, Abuja',
    quote: 'The AI study assistant is incredible. I used it every day before my IGCSE Maths exam and it explained every topic clearly. I got an A*.',
    rating: 5,
  },
  {
    name: 'Mr. Tunde Adeleke',
    role: 'Cambridge Tutor, Port Harcourt',
    quote: 'IATN gave me a professional identity. My Cambridge Expert badge and verified pass rate statistics have tripled my student enquiries.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="iatn-gradient text-white pt-20 pb-28 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Nigeria&apos;s #1 International Curriculum Education Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-balance">
            Find Nigeria&apos;s Best<br />
            <span className="text-purple-300">IGCSE & A-Level</span> Tutors
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 text-balance">
            Verified tutors with proven Cambridge results. Book lessons, track progress, prepare for exams — all on one trusted platform.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-2 max-w-2xl mx-auto shadow-2xl flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Subject, curriculum, or tutor name..."
                className="flex-1 text-slate-800 placeholder:text-slate-400 outline-none text-sm bg-transparent"
              />
            </div>
            <select className="border-l border-slate-200 px-4 text-sm text-slate-700 bg-transparent outline-none">
              <option value="">All states</option>
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Kano</option>
              <option>Rivers</option>
              <option>Oyo</option>
            </select>
            <Link
              href="/tutors"
              className="iatn-gradient text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Search Tutors
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-white/50 text-sm">Popular:</span>
            {['IGCSE Maths', 'A-Level Physics', 'A-Level Chemistry', 'IB English', 'SAT Prep'].map((tag) => (
              <Link
                key={tag}
                href={`/tutors?q=${encodeURIComponent(tag)}`}
                className="text-sm bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0f3460] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by curriculum */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Browse by Curriculum</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Find specialists in every international curriculum offered in Nigeria</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {curricula.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="group flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#0f3460] hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} mb-3`} />
                <div className="text-sm font-bold text-slate-800 group-hover:text-[#0f3460] mb-1">{c.name}</div>
                <div className="text-xs text-slate-500">{c.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by subject */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Browse by Subject</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject) => (
              <Link
                key={subject}
                href={`/tutors?subject=${encodeURIComponent(subject)}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#0f3460] hover:bg-blue-50 text-slate-700 hover:text-[#0f3460] rounded-full text-sm font-medium transition-all"
              >
                {subject} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why IATN */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Why Parents & Students Trust IATN</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We built the platform we wished existed when searching for qualified international curriculum tutors in Nigeria.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0f3460] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl iatn-gradient flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">What Our Community Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-20 px-4 iatn-gradient">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Are You a Cambridge or International Curriculum Tutor?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Join 2,000+ verified tutors on IATN. Get your unique IATN registration number, showcase your Cambridge results, and start earning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=tutor"
              className="bg-white text-[#0f3460] font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
            >
              Register as a Tutor <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register?role=school"
              className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
            >
              Register Your School
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-white/60 text-sm">
            {['Free registration', 'Unique IATN number', 'Verified badge', 'Instant bookings'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
