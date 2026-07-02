import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Star, Clock, CheckCircle2, Award } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { CURRICULA, SUBJECTS, NIGERIAN_STATES, formatNgn } from '@/lib/utils'
import type { Tutor } from '@/types'

// Sample tutors for UI scaffolding
const SAMPLE_TUTORS: Partial<Tutor>[] = [
  {
    id: '1', registration_number: 'IATN-2026-000001', full_name: 'Dr. Adaeze Obi',
    state: 'Lagos', city: 'Victoria Island', years_experience: 12, teaching_mode: 'both',
    hourly_rate_ngn: 25000, overall_rating: 4.9, review_count: 87, is_verified: true,
    bio: 'Cambridge examiner and A-Level Mathematics specialist with 12 years of experience. My students consistently achieve A* and A grades.',
    subjects: [{ id: '', tutor_id: '', subject: 'Mathematics', curriculum: 'a_level', proficiency: 'expert' },
               { id: '', tutor_id: '', subject: 'Further Mathematics', curriculum: 'igcse', proficiency: 'expert' }],
    badges: [{ id: '', tutor_id: '', badge: 'verified_tutor', awarded_at: '' }, { id: '', tutor_id: '', badge: 'cambridge_expert', awarded_at: '' }],
  },
  {
    id: '2', registration_number: 'IATN-2026-000002', full_name: 'Mr. Emeka Chukwu',
    state: 'Abuja', city: 'Maitama', years_experience: 8, teaching_mode: 'online',
    hourly_rate_ngn: 18000, overall_rating: 4.8, review_count: 62, is_verified: true,
    bio: 'Physics and Chemistry specialist. Cambridge IGCSE expert with proven record of A* students at top Abuja schools.',
    subjects: [{ id: '', tutor_id: '', subject: 'Physics', curriculum: 'igcse', proficiency: 'expert' },
               { id: '', tutor_id: '', subject: 'Chemistry', curriculum: 'igcse', proficiency: 'expert' }],
    badges: [{ id: '', tutor_id: '', badge: 'verified_tutor', awarded_at: '' }],
  },
  {
    id: '3', registration_number: 'IATN-2026-000003', full_name: 'Mrs. Fatimah Al-Hassan',
    state: 'Kano', city: 'Nassarawa GRA', years_experience: 15, teaching_mode: 'physical',
    hourly_rate_ngn: 15000, overall_rating: 5.0, review_count: 134, is_verified: true,
    bio: 'Senior Economics and Business Studies tutor. IB and A-Level expert with 15 years teaching at leading Nigerian international schools.',
    subjects: [{ id: '', tutor_id: '', subject: 'Economics', curriculum: 'a_level', proficiency: 'expert' },
               { id: '', tutor_id: '', subject: 'Business Studies', curriculum: 'ib', proficiency: 'expert' }],
    badges: [{ id: '', tutor_id: '', badge: 'top_tutor', awarded_at: '' }, { id: '', tutor_id: '', badge: 'verified_tutor', awarded_at: '' }],
  },
  {
    id: '4', registration_number: 'IATN-2026-000004', full_name: 'Dr. Blessing Eze',
    state: 'Rivers', city: 'Port Harcourt', years_experience: 10, teaching_mode: 'both',
    hourly_rate_ngn: 20000, overall_rating: 4.7, review_count: 45, is_verified: true,
    bio: 'Biology and Chemistry A-Level tutor. PhD graduate from University of Lagos. Medical school entrance specialist.',
    subjects: [{ id: '', tutor_id: '', subject: 'Biology', curriculum: 'a_level', proficiency: 'expert' },
               { id: '', tutor_id: '', subject: 'Chemistry', curriculum: 'a_level', proficiency: 'advanced' }],
    badges: [{ id: '', tutor_id: '', badge: 'qualification_verified', awarded_at: '' }, { id: '', tutor_id: '', badge: 'verified_tutor', awarded_at: '' }],
  },
  {
    id: '5', registration_number: 'IATN-2026-000005', full_name: 'Mr. Tunde Adesanya',
    state: 'Oyo', city: 'Ibadan', years_experience: 6, teaching_mode: 'online',
    hourly_rate_ngn: 12000, overall_rating: 4.6, review_count: 28, is_verified: true,
    bio: 'SAT and ACT preparation specialist. Computer Science and Mathematics tutor for US college admissions. 100% of my students improved their SAT scores.',
    subjects: [{ id: '', tutor_id: '', subject: 'Mathematics', curriculum: 'sat', proficiency: 'expert' },
               { id: '', tutor_id: '', subject: 'Computer Science', curriculum: 'igcse', proficiency: 'advanced' }],
    badges: [{ id: '', tutor_id: '', badge: 'verified_tutor', awarded_at: '' }],
  },
  {
    id: '6', registration_number: 'IATN-2026-000006', full_name: 'Mrs. Ngozi Alozie',
    state: 'Enugu', city: 'Enugu', years_experience: 18, teaching_mode: 'both',
    hourly_rate_ngn: 22000, overall_rating: 4.9, review_count: 201, is_verified: true,
    bio: 'English Language and Literature veteran. Cambridge IGCSE and A-Level examiner. Edexcel specialist with exceptional results track record.',
    subjects: [{ id: '', tutor_id: '', subject: 'English Language', curriculum: 'igcse', proficiency: 'expert' },
               { id: '', tutor_id: '', subject: 'English Language', curriculum: 'a_level', proficiency: 'expert' }],
    badges: [{ id: '', tutor_id: '', badge: 'cambridge_expert', awarded_at: '' }, { id: '', tutor_id: '', badge: 'top_tutor', awarded_at: '' }, { id: '', tutor_id: '', badge: 'verified_tutor', awarded_at: '' }],
  },
]

const badgeColors: Record<string, string> = {
  verified_tutor: 'badge-verified',
  top_tutor: 'badge-top',
  cambridge_expert: 'badge-cambridge',
  qualification_verified: 'badge-cambridge',
  identity_verified: 'badge-verified',
  background_verified: 'badge-cambridge',
}

const badgeLabels: Record<string, string> = {
  verified_tutor: '✓ Verified',
  top_tutor: '★ Top Tutor',
  cambridge_expert: '🏆 Cambridge Expert',
  qualification_verified: '📜 Qual. Verified',
  identity_verified: '🪪 ID Verified',
  background_verified: '🛡 BG Checked',
}

export default function TutorsSearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Search header */}
      <div className="iatn-gradient text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Find Your Tutor</h1>
          <p className="text-white/70 mb-6">Verified IGCSE, A-Level, IB, and SAT tutors across Nigeria</p>
          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Subject, curriculum, or tutor name..." className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent" />
            </div>
            <select className="border-l border-slate-200 px-4 text-sm text-slate-700 bg-transparent outline-none">
              <option value="">All states</option>
              {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="iatn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </div>

              <FilterSection title="Curriculum">
                {CURRICULA.map((c) => (
                  <label key={c.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="checkbox" className="accent-[#0f3460]" />
                    {c.label}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Subject">
                {SUBJECTS.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="checkbox" className="accent-[#0f3460]" />
                    {s}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="State">
                <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f3460] bg-white">
                  <option value="">All states</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Teaching mode">
                {['Online', 'Physical', 'Both'].map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="radio" name="mode" className="accent-[#0f3460]" />
                    {m}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Price (NGN/hr)">
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f3460]" />
                  <input type="number" placeholder="Max" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f3460]" />
                </div>
              </FilterSection>

              <FilterSection title="Badges">
                {['Verified only', 'Cambridge Expert', 'Top Tutor', 'Trial available'].map((b) => (
                  <label key={b} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="checkbox" className="accent-[#0f3460]" />
                    {b}
                  </label>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-600 text-sm"><span className="font-bold text-slate-900">2,347</span> tutors found</div>
              <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f3460]">
                <option>Sort: Highest rated</option>
                <option>Sort: Price: Low to High</option>
                <option>Sort: Price: High to Low</option>
                <option>Sort: Most reviewed</option>
                <option>Sort: Newest</option>
              </select>
            </div>

            <div className="space-y-4">
              {SAMPLE_TUTORS.map((tutor) => (
                <Link
                  key={tutor.id}
                  href={`/tutors/${tutor.id}`}
                  className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0f3460] hover:shadow-md transition-all group"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-xl iatn-gradient flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                      {tutor.full_name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-[#0f3460] transition-colors">{tutor.full_name}</h3>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3" /> {tutor.city}, {tutor.state}
                            <span className="mx-1">·</span>
                            <Clock className="w-3 h-3" /> {tutor.years_experience} yrs experience
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-slate-900">{formatNgn(tutor.hourly_rate_ngn!)}<span className="text-xs font-normal text-slate-500">/hr</span></div>
                          <div className="flex items-center gap-1 mt-0.5 justify-end">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-semibold">{tutor.overall_rating?.toFixed(1)}</span>
                            <span className="text-xs text-slate-500">({tutor.review_count})</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tutor.badges?.map((b) => (
                          <span key={b.badge} className={badgeColors[b.badge] || 'badge-verified'}>
                            {badgeLabels[b.badge]}
                          </span>
                        ))}
                      </div>

                      {/* Subjects */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tutor.subjects?.slice(0, 3).map((s) => (
                          <span key={`${s.subject}-${s.curriculum}`} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {s.subject} · {CURRICULA.find((c) => c.value === s.curriculum)?.label || s.curriculum}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{tutor.bio}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {tutor.teaching_mode === 'online' ? 'Online' : tutor.teaching_mode === 'physical' ? 'Physical' : 'Online & Physical'}</span>
                        <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" /> Trial lesson available</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {[1, 2, 3, '...', 47].map((p, i) => (
                <button key={i} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === 1 ? 'iatn-gradient text-white' : 'border border-slate-200 text-slate-700 hover:border-[#0f3460]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}
