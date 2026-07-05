import Link from 'next/link'
import { Star, Shield, Award, Users, BookOpen, TrendingUp, ArrowRight, CheckCircle2, ChevronRight, Building2, GraduationCap, MapPin } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import HeroSearch from '@/components/shared/HeroSearch'
import DualVideoHero from '@/components/shared/DualVideoHero'

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
    title: 'Unique Nexora Number',
    description: 'Every registered tutor receives a unique NXR-YYYY-NNNNNN professional registration number — your verified digital identity.',
  },
]

const featuredSchools = [
  {
    id: '1',
    name: 'Greensprings School',
    initial: 'GS',
    location: 'Anthony Village, Lagos',
    curricula: ['Cambridge IGCSE', 'Cambridge A-Level'],
    aStarRate: 87.3,
    uniPlacement: 96,
    rating: 4.9,
    reviews: 214,
    tags: ['Cambridge Centre', 'Boarding'],
  },
  {
    id: '2',
    name: 'Corona Secondary School',
    initial: 'CS',
    location: 'Lekki, Lagos',
    curricula: ['Cambridge A-Level', 'Pearson Edexcel'],
    aStarRate: 82.1,
    uniPlacement: 94,
    rating: 4.8,
    reviews: 178,
    tags: ['Cambridge Centre', 'Small Classes'],
  },
  {
    id: '3',
    name: 'Loyola Jesuit College',
    initial: 'LJ',
    location: 'Wuse, Abuja',
    curricula: ['Cambridge A-Level'],
    aStarRate: 91.0,
    uniPlacement: 98,
    rating: 4.9,
    reviews: 312,
    tags: ['Top Ranked', 'Boarding'],
  },
]

const testimonials = [
  {
    name: 'Mrs. Adaobi Okonkwo',
    role: 'Parent, Lagos',
    quote: 'I found my daughter an A-Level Chemistry tutor through Nexora Academic. She went from a D to an A* in six months. The verified badge gave me the confidence I needed.',
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
    quote: 'Nexora gave me a professional identity. My Cambridge Expert badge and verified pass rate statistics have tripled my student enquiries.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="nexora-gradient text-white pt-20 pb-28 px-4 relative overflow-hidden">
        {/* Background video */}
        <DualVideoHero src1="/videos/hero-home2.mp4" src2="/videos/hero-home.mp4" />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(15,52,96,0.82) 0%, rgba(22,33,62,0.80) 60%, rgba(26,26,46,0.80) 100%)' }}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Nigeria&apos;s #1 Academic Excellence Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-balance">
            Find Nigeria&apos;s Best Tutors &amp; Schools
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-8 text-balance">
            Verified IGCSE, A-Level, IB, WAEC, JAMB, and SAT tutors and schools across Nigeria — plus an AI Tutor to solve any exam problem, all in one trusted platform.
          </p>

          <HeroSearch />
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

      {/* Find A-Level Schools */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#533483] bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-3">
                <Building2 className="w-3.5 h-3.5" /> SCHOOLS
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Find A-Level Schools in Nigeria</h2>
              <p className="text-slate-600 max-w-xl">Compare top IGCSE and A-Level schools — A*/A rates, university placements, and verified reviews.</p>
            </div>
            <Link href="/schools" className="flex items-center gap-2 text-sm font-bold text-[#533483] hover:text-[#0f3460] transition-colors whitespace-nowrap flex-shrink-0">
              Browse All Schools <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* School cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {featuredSchools.map((school) => (
              <Link
                key={school.id}
                href={`/schools/${school.id}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#533483] hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-black text-white" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
                    {school.initial}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-[#533483] transition-colors">{school.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3 h-3" /> {school.location}
                    </div>
                  </div>
                </div>

                {/* Curricula */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {school.curricula.map((c) => (
                    <span key={c} className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-[#533483]">{school.aStarRate}%</div>
                    <div className="text-xs text-slate-500">A*/A Rate</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-emerald-600">{school.uniPlacement}%</div>
                    <div className="text-xs text-slate-500">Uni Placement</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-800">{school.rating}</span>
                    <span className="text-xs text-slate-500">({school.reviews})</span>
                  </div>
                  <div className="flex gap-1.5">
                    {school.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* School quick links */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'A-Level Schools', href: '/schools?curriculum=a_level' },
              { label: 'IGCSE Schools', href: '/schools?curriculum=igcse' },
              { label: 'IB Schools', href: '/schools?curriculum=ib' },
              { label: 'Schools in Lagos', href: '/schools?state=Lagos' },
              { label: 'Schools in Abuja', href: '/schools?state=Abuja' },
              { label: 'Boarding Schools', href: '/schools?type=boarding' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#533483] hover:bg-purple-50 text-slate-700 hover:text-[#533483] rounded-full text-sm font-medium transition-all"
              >
                <GraduationCap className="w-4 h-4" /> {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nexora */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Why Parents & Students Trust Nexora Academic</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We built the platform we wished existed when searching for qualified international curriculum tutors in Nigeria.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0f3460] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl nexora-gradient flex items-center justify-center mb-4">
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
      <section className="py-20 px-4 nexora-gradient">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Are You a Cambridge, WAEC or IB Tutor?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Join 2,000+ verified tutors on Nexora Academic. Get your unique Nexora registration number, showcase your Cambridge results, and start earning.
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
            {['Free registration', 'Unique Nexora number', 'Verified badge', 'Instant bookings'].map((item) => (
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
