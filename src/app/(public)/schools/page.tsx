'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, Users, CheckCircle2, SlidersHorizontal, ChevronRight, Building2, Award, X } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { NIGERIAN_STATES } from '@/lib/utils'
import DualVideoHero from '@/components/shared/DualVideoHero'

const SAMPLE_SCHOOLS = [
  {
    id: '1', registration_number: 'NXR-SCH-2026-0001', school_name: 'Greensprings School',
    logo_initial: 'GS', state: 'Lagos', city: 'Anthony Village', school_type: 'private',
    curricula: ['igcse', 'a_level'], founded_year: 1999, student_count: 2800,
    fee_range_ngn_min: 2500000, fee_range_ngn_max: 4500000, is_verified: true,
    overall_rating: 4.9, review_count: 214, a_star_a_rate: 87.3, university_placement_rate: 96,
    has_boarding: true,
    about: "One of Nigeria's leading international schools, offering Cambridge IGCSE and A-Level programmes with a strong track record of university placements at top global institutions.",
    tags: ['Cambridge Centre', 'Boarding Available', 'University Guidance'],
  },
  {
    id: '2', registration_number: 'NXR-SCH-2026-0002', school_name: 'Corona Secondary School',
    logo_initial: 'CS', state: 'Lagos', city: 'Lekki', school_type: 'private',
    curricula: ['igcse', 'a_level', 'edexcel'], founded_year: 1989, student_count: 1500,
    fee_range_ngn_min: 3000000, fee_range_ngn_max: 5000000, is_verified: true,
    overall_rating: 4.8, review_count: 178, a_star_a_rate: 82.1, university_placement_rate: 94,
    has_boarding: false,
    about: 'Premier Cambridge and Edexcel centre in Lagos. Known for exceptional A-Level results and strong UK university placement record.',
    tags: ['Cambridge Centre', 'Edexcel Centre', 'Sports Programme'],
  },
  {
    id: '3', registration_number: 'NXR-SCH-2026-0003', school_name: 'Loyola Jesuit College',
    logo_initial: 'LJ', state: 'FCT - Abuja', city: 'Abuja', school_type: 'private',
    curricula: ['igcse', 'a_level'], founded_year: 2000, student_count: 1200,
    fee_range_ngn_min: 4000000, fee_range_ngn_max: 6000000, is_verified: true,
    overall_rating: 4.9, review_count: 156, a_star_a_rate: 91.5, university_placement_rate: 98,
    has_boarding: true,
    about: "Nigeria's premier boarding school offering Cambridge IGCSE and A-Level. Consistently produces Outstanding Learner Award winners.",
    tags: ['Full Boarding', 'Outstanding Results', 'Cambridge Expert'],
  },
  {
    id: '4', registration_number: 'NXR-SCH-2026-0004', school_name: 'Atlantic Hall',
    logo_initial: 'AH', state: 'Lagos', city: 'Epe', school_type: 'international',
    curricula: ['igcse', 'a_level', 'ib'], founded_year: 1994, student_count: 900,
    fee_range_ngn_min: 5000000, fee_range_ngn_max: 8000000, is_verified: true,
    overall_rating: 4.8, review_count: 132, a_star_a_rate: 88.4, university_placement_rate: 97,
    has_boarding: true,
    about: 'International boarding school offering Cambridge IGCSE, A-Level, and IB Diploma in a stunning lakeside campus.',
    tags: ['Cambridge + IB', 'Full Boarding', 'International Campus'],
  },
  {
    id: '5', registration_number: 'NXR-SCH-2026-0005', school_name: 'Whiteplains British School',
    logo_initial: 'WB', state: 'FCT - Abuja', city: 'Abuja', school_type: 'private',
    curricula: ['igcse', 'a_level'], founded_year: 2005, student_count: 800,
    fee_range_ngn_min: 3500000, fee_range_ngn_max: 5500000, is_verified: true,
    overall_rating: 4.7, review_count: 98, a_star_a_rate: 79.6, university_placement_rate: 92,
    has_boarding: false,
    about: 'British-curriculum school in Abuja offering Cambridge IGCSE and A-Level. Known for small class sizes and individual attention.',
    tags: ['Small Class Sizes', 'British Curriculum', 'UK Teachers'],
  },
  {
    id: '6', registration_number: 'NXR-SCH-2026-0006', school_name: 'Hillcrest School',
    logo_initial: 'HS', state: 'Plateau', city: 'Jos', school_type: 'international',
    curricula: ['igcse', 'a_level'], founded_year: 1942, student_count: 600,
    fee_range_ngn_min: 2800000, fee_range_ngn_max: 4200000, is_verified: true,
    overall_rating: 4.8, review_count: 87, a_star_a_rate: 84.2, university_placement_rate: 95,
    has_boarding: true,
    about: "Nigeria's oldest international school with over 80 years of excellence. Boarding and day school with strong Cambridge tradition.",
    tags: ['80+ Years Heritage', 'Full Boarding', 'Cambridge Centre'],
  },
]

const CURRICULA_LABELS: Record<string, string> = {
  igcse: 'Cambridge IGCSE', a_level: 'Cambridge A-Level', edexcel: 'Edexcel',
  oxfordaqa: 'OxfordAQA', ib: 'IB Diploma', sat: 'SAT', act: 'ACT',
  jamb: 'JAMB', neco: 'NECO', jupeb: 'JUPEB',
}

const CURRICULA_FILTER = ['igcse', 'a_level', 'edexcel', 'ib', 'oxfordaqa']
const FEATURES_FILTER = ['Boarding available', 'A*/A rate > 80%', 'Verified only']

export default function SchoolsPage() {
  const [query, setQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])
  const [schoolType, setSchoolType] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('rating')

  const toggleCurriculum = (value: string) =>
    setSelectedCurricula(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  const toggleFeature = (value: string) =>
    setSelectedFeatures(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])

  const hasFilters = !!(query || selectedState || selectedCurricula.length || schoolType || selectedFeatures.length)

  const clearFilters = () => {
    setQuery(''); setSelectedState(''); setSelectedCurricula([]); setSchoolType('')
    setSelectedFeatures([]); setSortBy('rating')
  }

  const filteredSchools = useMemo(() => {
    let results = [...SAMPLE_SCHOOLS]

    if (query) {
      const q = query.toLowerCase()
      results = results.filter(s =>
        s.school_name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.about.toLowerCase().includes(q)
      )
    }

    if (selectedCurricula.length > 0) {
      results = results.filter(s => s.curricula.some(c => selectedCurricula.includes(c)))
    }

    if (selectedState) {
      results = results.filter(s => s.state === selectedState)
    }

    if (schoolType) {
      results = results.filter(s => s.school_type === schoolType.toLowerCase())
    }

    if (selectedFeatures.includes('Boarding available')) {
      results = results.filter(s => s.has_boarding)
    }
    if (selectedFeatures.includes('A*/A rate > 80%')) {
      results = results.filter(s => s.a_star_a_rate > 80)
    }
    if (selectedFeatures.includes('Verified only')) {
      results = results.filter(s => s.is_verified)
    }

    results.sort((a, b) => {
      if (sortBy === 'a_star') return b.a_star_a_rate - a.a_star_a_rate
      if (sortBy === 'reviews') return b.review_count - a.review_count
      return b.overall_rating - a.overall_rating
    })

    return results
  }, [query, selectedCurricula, selectedState, schoolType, selectedFeatures, sortBy])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <DualVideoHero
        leftVideo="/videos/hero-a.mp4"
        rightVideo="/videos/hero-b.mp4"
        overlay="rgba(83,52,131,0.75)"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Schools</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Find A-Level & IGCSE Schools in Nigeria</h1>
          <p className="text-white/70 mb-7 max-w-xl">Compare verified Cambridge, Edexcel, and IB schools across all 36 Nigerian states — results and real parent reviews.</p>

          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schools by name or location..."
                className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border-l border-slate-200 px-4 text-sm text-slate-700 bg-white outline-none"
            >
              <option value="">All states</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={clearFilters}
              className="text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
            >
              Search Schools
            </button>
          </div>

          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: '200+', label: 'Verified Schools' },
              { value: '36', label: 'States Covered' },
              { value: '95%', label: 'Avg Uni Placement' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </DualVideoHero>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Filters */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-[#533483] hover:underline font-medium">
                    Clear all
                  </button>
                )}
              </div>

              <FilterSection title="Curriculum">
                {CURRICULA_FILTER.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#533483]">
                    <input
                      type="checkbox"
                      checked={selectedCurricula.includes(c)}
                      onChange={() => toggleCurriculum(c)}
                      className="accent-[#533483]"
                    />
                    {CURRICULA_LABELS[c]}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="State">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#533483] bg-white"
                >
                  <option value="">All states</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="School type">
                {['Private', 'International', 'Government'].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#533483]">
                    <input
                      type="radio"
                      name="type"
                      checked={schoolType === t}
                      onChange={() => setSchoolType(schoolType === t ? '' : t)}
                      className="accent-[#533483]"
                    />
                    {t}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Features">
                {FEATURES_FILTER.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#533483]">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f)}
                      onChange={() => toggleFeature(f)}
                      className="accent-[#533483]"
                    />
                    {f}
                  </label>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-600 text-sm">
                <span className="font-bold text-slate-900">{filteredSchools.length}</span> schools found
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-3 inline-flex items-center gap-1 text-xs text-[#533483] hover:underline">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#533483] bg-white"
              >
                <option value="rating">Sort: Highest rated</option>
                <option value="a_star">Sort: Highest A*/A rate</option>
                <option value="reviews">Sort: Most reviewed</option>
              </select>
            </div>

            {filteredSchools.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No schools found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSchools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.id}`}
                    className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-purple-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
                        {school.logo_initial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 group-hover:text-[#533483] transition-colors">{school.school_name}</h3>
                              {school.is_verified && <span className="badge-verified">✓ Verified</span>}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3" /> {school.city}, {school.state}
                              <span className="mx-1">·</span>
                              <Building2 className="w-3 h-3" /> Est. {school.founded_year}
                              <span className="mx-1">·</span>
                              <Users className="w-3 h-3" /> {school.student_count.toLocaleString()} students
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 mt-0.5 justify-end">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-semibold">{school.overall_rating}</span>
                              <span className="text-xs text-slate-500">({school.review_count})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {school.curricula.map((c) => (
                            <span key={c} className="badge-cambridge">{CURRICULA_LABELS[c] || c}</span>
                          ))}
                        </div>

                        <div className="flex items-center gap-5 mt-3">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-semibold text-slate-700">{school.a_star_a_rate}% A*/A rate</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-slate-700">{school.university_placement_rate}% uni placement</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{school.about}</p>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {school.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Is Your School Listed?</h2>
          <p className="text-slate-600 mb-6">Join 200+ verified Cambridge and international schools on Nexora Academic. Reach thousands of parents actively looking for the right school.</p>
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
          >
            <Building2 className="w-4 h-4" /> Register Your School
          </Link>
        </div>
      </section>

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
