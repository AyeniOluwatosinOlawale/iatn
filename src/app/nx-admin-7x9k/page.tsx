'use client'

import { useState, useEffect } from 'react'
import { Users, GraduationCap, School, BookOpen, TrendingUp, RefreshCw, LogOut, Shield, Eye } from 'lucide-react'

interface Stats {
  total: number
  students: number
  tutors: number
  parents: number
  schools: number
  recent: { email: string; role: string; created_at: string }[]
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PASSWORD || 'nexora-admin-2026'

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  async function fetchStats() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setLastRefresh(new Date())
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) fetchStats()
  }, [authed])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  if (!authed) {
    return (
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
            {pwError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-xl">
                Incorrect password
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  const ROLE_CARDS = [
    { label: 'Students', value: stats?.students ?? 0, icon: BookOpen, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Tutors', value: stats?.tutors ?? 0, icon: GraduationCap, bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { label: 'Parents', value: stats?.parents ?? 0, icon: Users, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Schools', value: stats?.schools ?? 0, icon: School, bg: 'bg-amber-50', color: 'text-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="font-bold">Nexora Admin</span>
          <span className="text-slate-500 text-sm hidden sm:block">Builder Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-slate-500 text-xs hidden sm:block">Updated: {lastRefresh.toLocaleTimeString()}</span>
          )}
          <button onClick={fetchStats} disabled={loading}
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && !stats ? (
          <div className="text-center py-20 text-slate-400">Loading stats…</div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6 flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Total Registered Users</p>
                <p className="text-5xl font-black mt-1">{stats?.total ?? 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-white/20" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {ROLE_CARDS.map(card => (
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
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-500" /> Recent Registrations
                </h2>
                <span className="text-xs text-slate-400">Last 20</span>
              </div>
              <div className="divide-y divide-slate-50">
                {stats?.recent && stats.recent.length > 0 ? stats.recent.map((u, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{u.email}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(u.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.role === 'student' ? 'bg-blue-100 text-blue-700' :
                      u.role === 'tutor' ? 'bg-indigo-100 text-indigo-700' :
                      u.role === 'parent' ? 'bg-emerald-100 text-emerald-700' :
                      u.role === 'school' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role || 'unknown'}
                    </span>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-slate-400 text-sm">No registrations yet</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Supabase Users', href: 'https://supabase.com/dashboard/project/qpllfkmqtcdaveljibgk/auth/users' },
                { label: 'Vercel Logs', href: 'https://vercel.com/ayenis-projects-b8f1ef85/nexora-academic/logs' },
                { label: 'Vercel Analytics', href: 'https://vercel.com/ayenis-projects-b8f1ef85/nexora-academic/analytics' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-center">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
