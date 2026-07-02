import Link from 'next/link'
import { GraduationCap, MapPin, Star, ChevronRight, BookOpen, ExternalLink } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const UNIVERSITIES = [
  {
    id: '1', name: 'University of Lagos (UNILAG)', location: 'Lagos, Nigeria', type: 'Federal',
    accepts: ['jamb', 'waec', 'neco'], notable_programmes: ['Medicine', 'Law', 'Engineering', 'Business Admin'],
    min_jamb: 200, min_waec: 5, rating: 4.7, review_count: 1240,
    about: 'One of Nigeria\'s premier universities, UNILAG is known for academic excellence and produces top graduates across all disciplines.',
    logo: 'UL',
  },
  {
    id: '2', name: 'University of Ibadan (UI)', location: 'Ibadan, Oyo', type: 'Federal',
    accepts: ['jamb', 'waec', 'neco'], notable_programmes: ['Medicine', 'Pharmacy', 'Agriculture', 'Arts'],
    min_jamb: 200, min_waec: 5, rating: 4.8, review_count: 980,
    about: 'Nigeria\'s first and oldest university. Renowned for research and postgraduate programmes.',
    logo: 'UI',
  },
  {
    id: '3', name: 'Oxford University', location: 'Oxford, United Kingdom', type: 'International',
    accepts: ['a_level', 'igcse', 'ib'], notable_programmes: ['PPE', 'Medicine', 'Law', 'Computer Science'],
    min_jamb: null, min_waec: null, rating: 5.0, review_count: 4120,
    about: 'One of the world\'s oldest and most prestigious universities. Accepts Cambridge A-Level and IB students from Nigeria.',
    logo: 'OX',
  },
  {
    id: '4', name: 'University of Cambridge', location: 'Cambridge, United Kingdom', type: 'International',
    accepts: ['a_level', 'igcse', 'ib'], notable_programmes: ['Engineering', 'Natural Sciences', 'Mathematics', 'Law'],
    min_jamb: null, min_waec: null, rating: 5.0, review_count: 3890,
    about: 'World-leading research university. Top destination for Nigerian students with Cambridge A-Level qualifications.',
    logo: 'CAM',
  },
  {
    id: '5', name: 'Imperial College London', location: 'London, United Kingdom', type: 'International',
    accepts: ['a_level', 'edexcel', 'ib'], notable_programmes: ['Medicine', 'Engineering', 'Computing', 'Physics'],
    min_jamb: null, min_waec: null, rating: 4.9, review_count: 2760,
    about: 'Top 10 global university specialising in science, engineering, medicine and business.',
    logo: 'ICL',
  },
  {
    id: '6', name: 'University of Toronto', location: 'Toronto, Canada', type: 'International',
    accepts: ['a_level', 'igcse', 'ib', 'sat'], notable_programmes: ['Computer Science', 'Business', 'Medicine', 'Engineering'],
    min_jamb: null, min_waec: null, rating: 4.8, review_count: 1980,
    about: 'Canada\'s top university and a leading global institution. Popular choice for Nigerian students seeking North American education.',
    logo: 'UT',
  },
  {
    id: '7', name: 'Covenant University', location: 'Ota, Ogun State', type: 'Private',
    accepts: ['jamb', 'waec', 'neco', 'a_level'], notable_programmes: ['Engineering', 'Business', 'Architecture', 'Computer Science'],
    min_jamb: 180, min_waec: 5, rating: 4.6, review_count: 870,
    about: 'Nigeria\'s top-ranked private university. Known for discipline, excellent facilities, and strong graduate employment rates.',
    logo: 'CU',
  },
  {
    id: '8', name: 'Harvard University', location: 'Cambridge, Massachusetts, USA', type: 'International',
    accepts: ['sat', 'act', 'a_level', 'ib'], notable_programmes: ['Law', 'Business (MBA)', 'Medicine', 'Government'],
    min_jamb: null, min_waec: null, rating: 5.0, review_count: 5100,
    about: 'The world\'s most famous university. Accepts SAT, A-Level, and IB students from Nigeria with outstanding profiles.',
    logo: 'HU',
  },
]

const CURRICULUM_LABELS: Record<string, string> = {
  jamb: 'JAMB / UTME', waec: 'WAEC', neco: 'NECO', a_level: 'A-Level',
  igcse: 'IGCSE', ib: 'IB Diploma', edexcel: 'Edexcel', sat: 'SAT', act: 'ACT',
}

const CURRICULUM_COLORS: Record<string, string> = {
  jamb: 'bg-teal-100 text-teal-800', waec: 'bg-orange-100 text-orange-800',
  neco: 'bg-lime-100 text-lime-800', a_level: 'bg-indigo-100 text-indigo-800',
  igcse: 'bg-blue-100 text-blue-800', ib: 'bg-purple-100 text-purple-800',
  edexcel: 'bg-emerald-100 text-emerald-800', sat: 'bg-rose-100 text-rose-800', act: 'bg-amber-100 text-amber-800',
}

const TYPE_COLORS: Record<string, string> = {
  Federal: 'bg-green-100 text-green-800',
  Private: 'bg-blue-100 text-blue-800',
  International: 'bg-purple-100 text-purple-800',
}

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="iatn-gradient text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Universities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">University Guide</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Explore Nigerian and international universities — entry requirements, programmes, and how your IGCSE, A-Level, JAMB or IB qualifications are accepted.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Nigerian Universities', 'UK Universities', 'US Universities', 'Canadian Universities'].map((tab) => (
              <button key={tab} className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-1.5 rounded-full transition-colors">
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f3460] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Universities Listed' },
            { value: '40+', label: 'Countries' },
            { value: '95%', label: 'Placement Rate' },
            { value: '10,000+', label: 'Alumni Reviews' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* University list */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">Featured Universities</h2>
          <div className="flex gap-2">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3460]">
              <option>All types</option>
              <option>Nigerian (Federal)</option>
              <option>Nigerian (Private)</option>
              <option>International</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {UNIVERSITIES.map((uni) => (
            <div key={uni.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#0f3460] hover:shadow-md transition-all">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl iatn-gradient flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {uni.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-slate-900 text-sm leading-snug">{uni.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[uni.type]}`}>{uni.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3" /> {uni.location}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-800">{uni.rating}</span>
                    <span className="text-xs text-slate-500">({uni.review_count.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{uni.about}</p>

              <div className="mb-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Accepts</div>
                <div className="flex flex-wrap gap-1.5">
                  {uni.accepts.map((c) => (
                    <span key={c} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CURRICULUM_COLORS[c] ?? 'bg-slate-100 text-slate-700'}`}>
                      {CURRICULUM_LABELS[c] ?? c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Top Programmes</div>
                <div className="flex flex-wrap gap-1.5">
                  {uni.notable_programmes.map((p) => (
                    <span key={p} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>

              {uni.min_jamb && (
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 mb-4">
                  <span className="font-bold">Min JAMB score:</span> {uni.min_jamb} pts &nbsp;·&nbsp; <span className="font-bold">Min WAEC credits:</span> {uni.min_waec} subjects
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/tutors?curriculum=${uni.accepts[0]}`}
                  className="flex-1 text-center text-xs font-semibold text-[#0f3460] border border-[#0f3460] py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Find a Tutor
                </Link>
                <button className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold text-white iatn-gradient py-2 rounded-lg hover:opacity-90 transition-opacity">
                  View Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 px-4 iatn-gradient text-white">
        <div className="max-w-3xl mx-auto text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-black mb-3">Need Help With Your University Application?</h2>
          <p className="text-white/75 mb-6">Our verified tutors specialise in university entrance preparation — JAMB, A-Levels, SAT, IELTS, TOEFL, and personal statement coaching.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tutors" className="bg-white text-[#0f3460] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Find a Tutor
            </Link>
            <Link href="/register" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
