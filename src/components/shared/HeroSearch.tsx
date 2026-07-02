'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2 } from 'lucide-react'
import { NIGERIAN_STATES } from '@/lib/utils'

export default function HeroSearch() {
  const router = useRouter()
  const [tab, setTab] = useState<'tutors' | 'schools'>('tutors')
  const [query, setQuery] = useState('')
  const [state, setState] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (state) params.set('state', state)
    const qs = params.toString()
    router.push(tab === 'tutors' ? `/tutors${qs ? `?${qs}` : ''}` : `/schools${qs ? `?${qs}` : ''}`)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/10 rounded-xl p-1 mb-3 w-fit mx-auto">
        <button
          onClick={() => { setTab('tutors'); setQuery('') }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'tutors' ? 'bg-white text-[#0f3460] shadow' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
        >
          <Search className="w-4 h-4" /> Find Tutors
        </button>
        <button
          onClick={() => { setTab('schools'); setQuery('') }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'schools' ? 'bg-white text-[#533483] shadow' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
        >
          <Building2 className="w-4 h-4" /> Find Schools
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={tab === 'tutors' ? 'Subject, curriculum, or tutor name...' : 'School name or location...'}
            className="flex-1 text-slate-800 placeholder:text-slate-400 outline-none text-sm bg-transparent"
          />
        </div>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border-l border-slate-200 px-4 text-sm text-slate-700 bg-white outline-none"
        >
          <option value="">All states</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap nexora-gradient"
        >
          {tab === 'tutors' ? 'Search Tutors' : 'Search Schools'}
        </button>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        <span className="text-white/50 text-sm">Popular:</span>
        {tab === 'tutors' ? (
          <>
            {['IGCSE Maths', 'A-Level Physics', 'A-Level Chemistry', 'IB English', 'SAT Prep', 'JAMB Prep'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); setTimeout(handleSearch, 0) }}
                className="text-sm bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </>
        ) : (
          <>
            {['Lagos Schools', 'Abuja Schools', 'A-Level Schools', 'IB Schools', 'Boarding Schools'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag.replace(' Schools', '')); setTimeout(handleSearch, 0) }}
                className="text-sm bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
