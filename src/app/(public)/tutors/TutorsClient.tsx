'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Star, Clock, CheckCircle2, Award, X } from 'lucide-react'
import { CURRICULA, SUBJECTS, NIGERIAN_STATES } from '@/lib/utils'
import DualVideoHero from '@/components/shared/DualVideoHero'

const badgeColors: Record<string, string> = {
  verified_tutor:        'badge-verified',
  top_tutor:             'badge-top',
  cambridge_expert:      'badge-cambridge',
  qualification_verified:'badge-cambridge',
  identity_verified:     'badge-verified',
  background_verified:   'badge-cambridge',
}

const badgeLabels: Record<string, string> = {
  verified_tutor:        '✓ Verified',
  top_tutor:             '★ Top Tutor',
  cambridge_expert:      '🏆 Cambridge Expert',
  qualification_verified:'📜 Qual. Verified',
  identity_verified:     '🪪 ID Verified',
  background_verified:   '🛡 BG Checked',
}

const BADGE_FILTERS = ['Verified only', 'Cambridge Expert', 'Top Tutor', 'Trial available']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TutorsClient({ tutors }: { tutors: any[] }) {
  const [query, setQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [teachingMode, setTeachingMode] = useState('')
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('rating')

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])

  const hasFilters = !!(query || selectedState || selectedCurricula.length || selectedSubjects.length || teachingMode || selectedBadges.length)

  const clearFilters = () => {
    setQuery(''); setSelectedState(''); setSelectedCurricula([])
    setSelectedSubjects([]); setTeachingMode(''); setSelectedBadges([])
    setSortBy('rating')
  }

  const filtered = useMemo(() => {
    let results = [...tutors]

    if (query) {
      const q = query.toLowerCase()
      results = results.filter(t =>
        t.full_name?.toLowerCase().includes(q) ||
        t.bio?.toLowerCase().includes(q) ||
        t.subjects?.some((s: { subject: string }) => s.subject.toLowerCase().includes(q)) ||
        t.city?.toLowerCase().includes(q) || t.state?.toLowerCase().includes(q)
      )
    }
    if (selectedCurricula.length > 0)
      results = results.filter(t => t.subjects?.some((s: { curriculum: string }) => selectedCurricula.includes(s.curriculum)))
    if (selectedSubjects.length > 0)
      results = results.filter(t => t.subjects?.some((s: { subject: string }) => selectedSubjects.includes(s.subject)))
    if (selectedState)
      results = results.filter(t => t.state === selectedState)
    if (teachingMode)
      results = results.filter(t => t.teaching_mode === teachingMode.toLowerCase() || (teachingMode === 'Both' && t.teaching_mode === 'both'))
    if (selectedBadges.includes('Verified only'))
      results = results.filter(t => t.is_verified)
    if (selectedBadges.includes('Cambridge Expert'))
      results = results.filter(t => t.effectiveBadges?.includes('cambridge_expert'))
    if (selectedBadges.includes('Top Tutor'))
      results = results.filter(t => t.effectiveBadges?.includes('top_tutor'))
    if (selectedBadges.includes('Trial available'))
      results = results.filter(t => t.offers_trial_lesson)

    results.sort((a, b) =>
      sortBy === 'reviews' ? (b.review_count ?? 0) - (a.review_count ?? 0) : (b.overall_rating ?? 0) - (a.overall_rating ?? 0)
    )
    return results
  }, [tutors, query, selectedCurricula, selectedSubjects, selectedState, teachingMode, selectedBadges, sortBy])

  return (
    <>
      {/* Search header */}
      <div className="relative overflow-hidden nexora-gradient text-white py-12 px-4">
        <DualVideoHero src1="/videos/hero-tutors2.mp4" src2="/videos/hero-tutors.mp4" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,52,96,0.82) 0%, rgba(22,33,62,0.78) 60%, rgba(26,26,46,0.75) 100%)' }} aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Find Your Tutor</h1>
          <p className="text-white/70 mb-6">Verified IGCSE, A-Level, IB, WAEC, JAMB and SAT tutors across Nigeria</p>
          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Subject, curriculum, or tutor name..."
                className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent" />
              {query && <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
            </div>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
              className="border-l border-slate-200 px-4 text-sm text-slate-700 bg-white outline-none">
              <option value="">All states</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="nexora-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </div>
                {hasFilters && <button onClick={clearFilters} className="text-xs text-[#0f3460] hover:underline font-medium">Clear all</button>}
              </div>
              <FilterSection title="Curriculum">
                {CURRICULA.map(c => (
                  <label key={c.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="checkbox" checked={selectedCurricula.includes(c.value)} onChange={() => toggle(selectedCurricula, setSelectedCurricula, c.value)} className="accent-[#0f3460]" />
                    {c.label}
                  </label>
                ))}
              </FilterSection>
              <FilterSection title="Subject">
                {SUBJECTS.map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="checkbox" checked={selectedSubjects.includes(s)} onChange={() => toggle(selectedSubjects, setSelectedSubjects, s)} className="accent-[#0f3460]" />
                    {s}
                  </label>
                ))}
              </FilterSection>
              <FilterSection title="State">
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none bg-white">
                  <option value="">All states</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterSection>
              <FilterSection title="Teaching mode">
                {['Online', 'Physical', 'Both'].map(m => (
                  <label key={m} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="radio" name="mode" checked={teachingMode === m} onChange={() => setTeachingMode(teachingMode === m ? '' : m)} className="accent-[#0f3460]" />
                    {m}
                  </label>
                ))}
              </FilterSection>
              <FilterSection title="Badges">
                {BADGE_FILTERS.map(b => (
                  <label key={b} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-[#0f3460]">
                    <input type="checkbox" checked={selectedBadges.includes(b)} onChange={() => toggle(selectedBadges, setSelectedBadges, b)} className="accent-[#0f3460]" />
                    {b}
                  </label>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-600 text-sm">
                <span className="font-bold text-slate-900">{filtered.length}</span> tutor{filtered.length !== 1 ? 's' : ''} found
                {hasFilters && <button onClick={clearFilters} className="ml-3 inline-flex items-center gap-1 text-xs text-[#0f3460] hover:underline"><X className="w-3 h-3" /> Clear filters</button>}
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white">
                <option value="rating">Sort: Highest rated</option>
                <option value="reviews">Sort: Most reviewed</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {tutors.length === 0 ? 'No tutors registered yet' : 'No tutors match your search'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {tutors.length === 0
                    ? 'Be the first to register as a tutor on Nexora Academic.'
                    : 'Try adjusting your filters or search terms.'}
                </p>
                {tutors.length === 0 ? (
                  <Link href="/register/tutor" className="nexora-gradient text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 inline-block">
                    Register as a Tutor
                  </Link>
                ) : (
                  <button onClick={clearFilters} className="nexora-gradient text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(tutor => (
                  <Link key={tutor.id} href={`/tutors/${tutor.id}`}
                    className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0f3460] hover:shadow-md transition-all group">
                    <div className="flex gap-4">
                      {tutor.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tutor.photo_url} alt={tutor.full_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl nexora-gradient flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                          {tutor.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-[#0f3460] transition-colors">{tutor.full_name}</h3>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 flex-wrap">
                              {tutor.city && tutor.state && <><MapPin className="w-3 h-3" /> {tutor.city}, {tutor.state}</>}
                              {tutor.years_experience && <><span className="mx-1">·</span><Clock className="w-3 h-3" /> {tutor.years_experience} yrs experience</>}
                            </div>
                          </div>
                          {(tutor.overall_rating > 0 || tutor.review_count > 0) && (
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1 justify-end">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold">{tutor.overall_rating > 0 ? Number(tutor.overall_rating).toFixed(1) : '—'}</span>
                                {tutor.review_count > 0 && <span className="text-xs text-slate-500">({tutor.review_count})</span>}
                              </div>
                            </div>
                          )}
                        </div>

                        {tutor.effectiveBadges?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {tutor.effectiveBadges.map((b: string) => (
                              <span key={b} className={badgeColors[b] ?? 'badge-verified'}>{badgeLabels[b] ?? b}</span>
                            ))}
                          </div>
                        )}

                        {tutor.subjects?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {tutor.subjects.slice(0, 3).map((s: { subject: string; curriculum: string }) => (
                              <span key={`${s.subject}-${s.curriculum}`} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {s.subject} · {CURRICULA.find(c => c.value === s.curriculum)?.label ?? s.curriculum}
                              </span>
                            ))}
                          </div>
                        )}

                        {tutor.bio && <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{tutor.bio}</p>}

                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          {tutor.teaching_mode && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              {tutor.teaching_mode === 'online' ? 'Online only' : tutor.teaching_mode === 'physical' ? 'In-person only' : 'Online & In-person'}
                            </span>
                          )}
                          {tutor.offers_trial_lesson && (
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-500" /> Trial lesson available
                            </span>
                          )}
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
    </>
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
