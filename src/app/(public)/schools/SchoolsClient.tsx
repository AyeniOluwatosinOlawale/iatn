'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, Users, CheckCircle2, SlidersHorizontal, ChevronRight, Building2, Award, X } from 'lucide-react'
import { NIGERIAN_STATES } from '@/lib/utils'

export interface SchoolRow {
  id: string
  registration_number: string | null
  school_name: string
  logo_url: string | null
  state: string
  city: string | null
  school_type: string | null
  curricula: string[] | null
  founded_year: number | null
  student_count: number | null
  a_star_a_rate: number | null
  university_placement_rate: number | null
  about: string | null
  is_verified: boolean
  overall_rating: number | null
  review_count: number | null
}

const CURRICULA_LABELS: Record<string, string> = {
  igcse: 'Cambridge IGCSE', a_level: 'Cambridge A-Level', edexcel: 'Edexcel',
  oxfordaqa: 'OxfordAQA', ib: 'IB Diploma', sat: 'SAT', act: 'ACT',
  jamb: 'JAMB', neco: 'NECO', jupeb: 'JUPEB',
}

const CURRICULA_FILTER = ['igcse', 'a_level', 'edexcel', 'ib', 'oxfordaqa']

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

export default function SchoolsClient({ schools }: { schools: SchoolRow[] }) {
  const [query, setQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])
  const [schoolType, setSchoolType] = useState('')
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  const toggleCurriculum = (value: string) =>
    setSelectedCurricula(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])

  const hasFilters = !!(query || selectedState || selectedCurricula.length || schoolType || onlyVerified)

  const clearFilters = () => {
    setQuery(''); setSelectedState(''); setSelectedCurricula([]); setSchoolType('')
    setOnlyVerified(false); setSortBy('rating')
  }

  const filtered = useMemo(() => {
    let results = [...schools]

    if (query) {
      const q = query.toLowerCase()
      results = results.filter(s =>
        s.school_name.toLowerCase().includes(q) ||
        (s.city ?? '').toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        (s.about ?? '').toLowerCase().includes(q)
      )
    }

    if (selectedCurricula.length > 0) {
      results = results.filter(s => (s.curricula ?? []).some(c => selectedCurricula.includes(c)))
    }

    if (selectedState) {
      results = results.filter(s => s.state === selectedState)
    }

    if (schoolType) {
      results = results.filter(s => s.school_type === schoolType.toLowerCase())
    }

    if (onlyVerified) {
      results = results.filter(s => s.is_verified)
    }

    results.sort((a, b) => {
      if (sortBy === 'a_star') return (b.a_star_a_rate ?? 0) - (a.a_star_a_rate ?? 0)
      if (sortBy === 'reviews') return (b.review_count ?? 0) - (a.review_count ?? 0)
      return (b.overall_rating ?? 0) - (a.overall_rating ?? 0)
    })

    return results
  }, [query, selectedCurricula, selectedState, schoolType, onlyVerified, sortBy, schools])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="text-white py-14 px-4" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Schools</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Find A-Level & IGCSE Schools in Nigeria</h1>
          <p className="text-white/70 mb-7 max-w-xl">Compare verified Cambridge, Edexcel, and IB schools across Nigeria — real data, real schools.</p>

          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
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
              value={selectedState} onChange={e => setSelectedState(e.target.value)}
              className="border-l border-slate-200 px-4 text-sm text-slate-700 bg-white outline-none"
            >
              <option value="">All states</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={clearFilters}
              className="text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
            >
              Search Schools
            </button>
          </div>
        </div>
      </div>

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
                  <button onClick={clearFilters} className="text-xs text-[#533483] hover:underline font-medium">Clear all</button>
                )}
              </div>

              <FilterSection title="Curriculum">
                {CURRICULA_FILTER.map(c => (
                  <label key={c} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#533483]">
                    <input type="checkbox" checked={selectedCurricula.includes(c)} onChange={() => toggleCurriculum(c)} className="accent-[#533483]" />
                    {CURRICULA_LABELS[c]}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="State">
                <select
                  value={selectedState} onChange={e => setSelectedState(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#533483] bg-white"
                >
                  <option value="">All states</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="School type">
                {['Private', 'International', 'Government'].map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#533483]">
                    <input type="radio" name="type" checked={schoolType === t} onChange={() => setSchoolType(schoolType === t ? '' : t)} className="accent-[#533483]" />
                    {t}
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Features">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#533483]">
                  <input type="checkbox" checked={onlyVerified} onChange={() => setOnlyVerified(v => !v)} className="accent-[#533483]" />
                  Verified only
                </label>
              </FilterSection>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-600 text-sm">
                <span className="font-bold text-slate-900">{filtered.length}</span> school{filtered.length !== 1 ? 's' : ''} found
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-3 inline-flex items-center gap-1 text-xs text-[#533483] hover:underline">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
              <select
                value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#533483] bg-white"
              >
                <option value="rating">Sort: Highest rated</option>
                <option value="a_star">Sort: Highest A*/A rate</option>
                <option value="reviews">Sort: Most reviewed</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {schools.length === 0 ? 'No schools registered yet' : 'No schools match your filters'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {schools.length === 0
                    ? 'Be the first school to register on Nexora Academic.'
                    : 'Try adjusting your filters or search terms'}
                </p>
                {schools.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(school => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.id}`}
                    className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-purple-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-4">
                      {school.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={school.logo_url} alt={school.school_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
                          {getInitials(school.school_name)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 group-hover:text-[#533483] transition-colors">{school.school_name}</h3>
                              {school.is_verified && <span className="badge-verified text-xs">✓ Verified</span>}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 flex-wrap">
                              <MapPin className="w-3 h-3" />
                              {school.city ? `${school.city}, ` : ''}{school.state}
                              {school.founded_year && <><span className="mx-1">·</span><Building2 className="w-3 h-3" /> Est. {school.founded_year}</>}
                              {school.student_count && <><span className="mx-1">·</span><Users className="w-3 h-3" /> {school.student_count.toLocaleString()} students</>}
                            </div>
                          </div>
                          {(school.overall_rating ?? 0) > 0 && (
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1 mt-0.5 justify-end">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold">{Number(school.overall_rating).toFixed(1)}</span>
                                <span className="text-xs text-slate-500">({school.review_count})</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {(school.curricula ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(school.curricula ?? []).map(c => (
                              <span key={c} className="badge-cambridge">{CURRICULA_LABELS[c] || c}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-5 mt-3">
                          {school.a_star_a_rate && (
                            <div className="flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-semibold text-slate-700">{Number(school.a_star_a_rate).toFixed(1)}% A*/A rate</span>
                            </div>
                          )}
                          {school.university_placement_rate && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-semibold text-slate-700">{Number(school.university_placement_rate).toFixed(0)}% uni placement</span>
                            </div>
                          )}
                        </div>

                        {school.about && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{school.about}</p>
                        )}
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
          <p className="text-slate-600 mb-6">Join verified Cambridge and international schools on Nexora Academic. Reach thousands of parents actively looking for the right school.</p>
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
          >
            <Building2 className="w-4 h-4" /> Register Your School
          </Link>
        </div>
      </section>
    </div>
  )
}
