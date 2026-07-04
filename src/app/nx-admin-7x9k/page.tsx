'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, GraduationCap, School, BookOpen, TrendingUp, RefreshCw, LogOut, Shield, Eye, CheckCircle2, Clock, ChevronDown, ChevronUp, MapPin, Phone, Mail } from 'lucide-react'

interface Stats {
  total: number; students: number; tutors: number; parents: number; schools: number
  recent: { email: string; role: string; full_name: string; phone: string; created_at: string }[]
}
interface TutorRow {
  id: string; full_name: string; email: string; phone: string | null
  city: string | null; state: string | null; bio: string | null
  years_experience: number | null; teaching_mode: string | null
  current_institution: string | null; is_verified: boolean
  verification_status: string; registration_number: string | null; created_at: string
  subjects: { subject: string; curriculum: string; proficiency_level: string }[]
  qualifications: { qualification_type: string; institution: string; field_of_study: string; year_obtained: number }[]
}
interface SchoolRow {
  id: string; school_name: string; email: string; phone: string | null
  city: string | null; state: string | null; address: string | null
  school_type: string | null; curricula: string[] | null
  founded_year: number | null; student_count: number | null
  about: string | null; website: string | null
  is_verified: boolean; verification_status: string
  registration_number: string | null; created_at: string
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PASSWORD || 'nexora-admin-2026'

function StatusBadge({ verified }: { verified: boolean }) {
  return verified
    ? <span className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Verified</span>
    : <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" /> Pending</span>
}

function VerifyBtn({ verified, loading, onClick }: { verified: boolean; loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
        verified ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      }`}>
      {loading ? '…' : verified ? 'Revoke' : 'Verify & Email'}
    </button>
  )
}

export default function AdminDashboard() {
  const [authed, setAuthed]         = useState(false)
  const [pw, setPw]                 = useState('')
  const [pwError, setPwError]       = useState(false)
  const [stats, setStats]           = useState<Stats | null>(null)
  const [tutors, setTutors]         = useState<TutorRow[]>([])
  const [schools, setSchools]       = useState<SchoolRow[]>([])
  const [loading, setLoading]       = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [tab, setTab]               = useState<'overview' | 'tutors' | 'schools'>('overview')
  const [verifyLoading, setVerifyLoading] = useState<string | null>(null)
  const [expanded, setExpanded]     = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, tutorsRes, schoolsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/tutors'),
        fetch('/api/admin/schools'),
      ])
      if (statsRes.ok)   setStats(await statsRes.json())
      if (tutorsRes.ok)  setTutors((await tutorsRes.json()).tutors ?? [])
      if (schoolsRes.ok) setSchools((await schoolsRes.json()).schools ?? [])
      setLastRefresh(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (authed) fetchAll() }, [authed, fetchAll])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
      sessionStorage.setItem('nx-admin-session', 'true')
    } else setPwError(true)
  }

  async function verifyTutor(t: TutorRow) {
    setVerifyLoading(t.id)
    await fetch('/api/admin/tutors', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutor_id: t.id, verified: !t.is_verified, password: ADMIN_PASSWORD, email: t.email, name: t.full_name }),
    })
    setTutors(prev => prev.map(x => x.id === t.id ? { ...x, is_verified: !x.is_verified, verification_status: !x.is_verified ? 'verified' : 'pending' } : x))
    setVerifyLoading(null)
  }

  async function verifySchool(s: SchoolRow) {
    setVerifyLoading(s.id)
    await fetch('/api/admin/schools', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ school_id: s.id, verified: !s.is_verified, password: ADMIN_PASSWORD, email: s.email, name: s.school_name }),
    })
    setSchools(prev => prev.map(x => x.id === s.id ? { ...x, is_verified: !x.is_verified, verification_status: !x.is_verified ? 'verified' : 'pending' } : x))
    setVerifyLoading(null)
  }

  if (!authed) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-1">Nexora Academic — Builder Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="bg-slate-800 rounded-2xl p-6 space-y-4">
          {pwError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-xl">Incorrect password</div>}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter admin password" autoFocus />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )

  const pendingTutors  = tutors.filter(t => !t.is_verified).length
  const pendingSchools = schools.filter(s => !s.is_verified).length

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'tutors',   label: `Tutors${pendingTutors  > 0 ? ` (${pendingTutors} pending)`  : ''}` },
    { key: 'schools',  label: `Schools${pendingSchools > 0 ? ` (${pendingSchools} pending)` : ''}` },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="font-bold">Nexora Admin</span>
          <span className="text-slate-500 text-sm hidden sm:block">Builder Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && <span className="text-slate-500 text-xs hidden sm:block">Updated: {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchAll} disabled={loading} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-6xl mx-auto flex">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && !stats ? (
          <div className="text-center py-20 text-slate-400">Loading…</div>
        ) : tab === 'overview' ? (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6 flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Total Registered Users</p>
                <p className="text-5xl font-black mt-1">{stats?.total ?? 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-white/20" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Students', value: stats?.students ?? 0, icon: BookOpen,      bg: 'bg-blue-50',    color: 'text-blue-600' },
                { label: 'Tutors',   value: stats?.tutors   ?? 0, icon: GraduationCap, bg: 'bg-indigo-50',  color: 'text-indigo-600' },
                { label: 'Parents',  value: stats?.parents  ?? 0, icon: Users,         bg: 'bg-emerald-50', color: 'text-emerald-600' },
                { label: 'Schools',  value: stats?.schools  ?? 0, icon: School,        bg: 'bg-amber-50',   color: 'text-amber-600' },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{card.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 mb-6">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><Eye className="w-4 h-4 text-indigo-500" /> Recent Registrations</h2>
                <span className="text-xs text-slate-400">Last 20</span>
              </div>
              <div className="divide-y divide-slate-50">
                {(stats?.recent ?? []).length > 0 ? (stats?.recent ?? []).map((u, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{u.full_name || u.email}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                      {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                      <p className="text-xs text-slate-300 mt-0.5">{new Date(u.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'student' ? 'bg-blue-100 text-blue-700' : u.role === 'tutor' ? 'bg-indigo-100 text-indigo-700' : u.role === 'parent' ? 'bg-emerald-100 text-emerald-700' : u.role === 'school' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{u.role || 'unknown'}</span>
                  </div>
                )) : <div className="px-6 py-8 text-center text-slate-400 text-sm">No registrations yet</div>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Supabase Users', href: 'https://supabase.com/dashboard/project/qpllfkmqtcdaveljibgk/auth/users' },
                { label: 'Vercel Logs',    href: 'https://vercel.com/ayenis-projects-b8f1ef85/nexora-academic/logs' },
                { label: 'Vercel Analytics', href: 'https://vercel.com/ayenis-projects-b8f1ef85/nexora-academic/analytics' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-center">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </>
        ) : tab === 'tutors' ? (
          <div className="space-y-3">
            {tutors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-12 text-center text-slate-400 text-sm">No tutors registered yet.</div>
            ) : tutors.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Summary row */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">{t.full_name}</p>
                      <StatusBadge verified={t.is_verified} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Mail className="w-3 h-3" />{t.email}</span>
                      {t.phone && <span className="flex items-center gap-1 text-xs text-slate-500"><Phone className="w-3 h-3" />{t.phone}</span>}
                      {(t.city || t.state) && <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{[t.city, t.state].filter(Boolean).join(', ')}</span>}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Joined {new Date(t.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <VerifyBtn verified={t.is_verified} loading={verifyLoading === t.id} onClick={() => verifyTutor(t)} />
                    <button onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                      {expanded === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === t.id && (
                  <div className="border-t border-slate-100 px-6 py-5 bg-slate-50 space-y-4">
                    {t.bio && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bio</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{t.bio}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {t.years_experience != null && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</p><p className="text-sm text-slate-800 font-semibold mt-0.5">{t.years_experience} years</p></div>}
                      {t.teaching_mode && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</p><p className="text-sm text-slate-800 font-semibold mt-0.5 capitalize">{t.teaching_mode}</p></div>}
                      {t.current_institution && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institution</p><p className="text-sm text-slate-800 font-semibold mt-0.5">{t.current_institution}</p></div>}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subjects to Teach</p>
                      {t.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {t.subjects.map((s, i) => (
                            <span key={i} className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
                              {s.subject} · {s.curriculum}{s.proficiency_level ? ` (${s.proficiency_level})` : ''}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No subjects on file — tutor registered before subjects were required.</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Qualifications & Expertise</p>
                      {t.qualifications.length > 0 ? (
                        <div className="space-y-1.5">
                          {t.qualifications.map((q, i) => (
                            <div key={i} className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                              <span className="font-semibold capitalize">{q.qualification_type.replace(/_/g, ' ')}</span>
                              {q.field_of_study && ` in ${q.field_of_study}`}
                              {q.institution && ` — ${q.institution}`}
                              {q.year_obtained && ` (${q.year_obtained})`}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No qualifications on file.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Schools tab */
          <div className="space-y-3">
            {schools.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-12 text-center text-slate-400 text-sm">No schools registered yet.</div>
            ) : schools.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">{s.school_name}</p>
                      <StatusBadge verified={s.is_verified} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Mail className="w-3 h-3" />{s.email}</span>
                      {s.phone && <span className="flex items-center gap-1 text-xs text-slate-500"><Phone className="w-3 h-3" />{s.phone}</span>}
                      {(s.city || s.state) && <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{[s.city, s.state].filter(Boolean).join(', ')}</span>}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Joined {new Date(s.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <VerifyBtn verified={s.is_verified} loading={verifyLoading === s.id} onClick={() => verifySchool(s)} />
                    <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                      {expanded === s.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {expanded === s.id && (
                  <div className="border-t border-slate-100 px-6 py-5 bg-slate-50 space-y-4">
                    {s.about && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">About</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{s.about}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {s.school_type && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</p><p className="text-sm text-slate-800 font-semibold mt-0.5 capitalize">{s.school_type}</p></div>}
                      {s.founded_year && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Founded</p><p className="text-sm text-slate-800 font-semibold mt-0.5">{s.founded_year}</p></div>}
                      {s.student_count && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</p><p className="text-sm text-slate-800 font-semibold mt-0.5">{s.student_count.toLocaleString()}</p></div>}
                      {s.address && <div className="col-span-2"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</p><p className="text-sm text-slate-800 font-semibold mt-0.5">{s.address}</p></div>}
                      {s.website && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website</p><a href={s.website} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-semibold mt-0.5 hover:underline block">{s.website}</a></div>}
                    </div>
                    {s.curricula && s.curricula.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Curricula</p>
                        <div className="flex flex-wrap gap-2">
                          {s.curricula.map((c, i) => (
                            <span key={i} className="text-xs bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-full uppercase">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {s.registration_number && (
                      <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reg. Number</p><p className="text-sm font-mono text-slate-800 mt-0.5">{s.registration_number}</p></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
