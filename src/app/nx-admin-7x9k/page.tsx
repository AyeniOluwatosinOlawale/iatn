'use client'

import { useState, useEffect } from 'react'
import { Users, GraduationCap, School, BookOpen, TrendingUp, RefreshCw, LogOut, Shield, Eye, Trash2, Search, X } from 'lucide-react'

interface User {
  id: string
  email: string
  role: string
  full_name: string
  phone: string
  created_at: string
}

interface Stats {
  total: number
  students: number
  tutors: number
  parents: number
  schools: number
  recent: User[]
  all: User[]
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PASSWORD || 'nexora-admin-2026'

const ROLE_COLORS: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  tutor: 'bg-indigo-100 text-indigo-700',
  parent: 'bg-emerald-100 text-emerald-700',
  school: 'bg-amber-100 text-amber-700',
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [tab, setTab] = useState<'overview' | 'users'>('overview')

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

  async function handleDelete(user: User) {
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setConfirmDelete(null)
      await fetchStats()
    } catch {
      setDeleteError('Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const filteredUsers = (stats?.all ?? []).filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const q = search.toLowerCase()
    const matchSearch = !q || u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q)
    return matchRole && matchSearch
  })

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
    { label: 'Students', value: stats?.students ?? 0, icon: BookOpen, bg: 'bg-blue-50', color: 'text-blue-600', role: 'student' },
    { label: 'Tutors', value: stats?.tutors ?? 0, icon: GraduationCap, bg: 'bg-indigo-50', color: 'text-indigo-600', role: 'tutor' },
    { label: 'Parents', value: stats?.parents ?? 0, icon: Users, bg: 'bg-emerald-50', color: 'text-emerald-600', role: 'parent' },
    { label: 'Schools', value: stats?.schools ?? 0, icon: School, bg: 'bg-amber-50', color: 'text-amber-600', role: 'school' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-6xl mx-auto flex gap-6">
          {(['overview', 'users'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3.5 text-sm font-semibold capitalize border-b-2 transition-colors ${
                tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'users' ? `Manage Users (${stats?.total ?? 0})` : 'Overview'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && !stats ? (
          <div className="text-center py-20 text-slate-400">Loading…</div>
        ) : tab === 'overview' ? (
          <>
            {/* Total banner */}
            <div className="bg-indigo-700 rounded-2xl p-6 text-white mb-6 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Registered Users</p>
                <p className="text-5xl font-black mt-1">{stats?.total ?? 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-white/20" />
            </div>

            {/* Role cards — click to jump to manage view filtered by role */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {ROLE_CARDS.map(card => (
                <button
                  key={card.label}
                  onClick={() => { setRoleFilter(card.role); setTab('users') }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{card.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
                </button>
              ))}
            </div>

            {/* Recent registrations with delete */}
            <div className="bg-white rounded-2xl border border-slate-200 mb-6">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-500" /> Recent Registrations
                </h2>
                <span className="text-xs text-slate-400">Last 20</span>
              </div>
              <div className="divide-y divide-slate-50">
                {stats?.recent && stats.recent.length > 0 ? stats.recent.map((u) => (
                  <div key={u.id} className="px-6 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{u.full_name || u.email}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {new Date(u.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
        ) : (
          /* Manage Users tab */
          <div className="bg-white rounded-2xl border border-slate-200">
            {/* Filters */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'student', 'tutor', 'parent', 'school'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      roleFilter === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r === 'all' ? `All (${stats?.total ?? 0})` : r}
                  </button>
                ))}
              </div>
            </div>

            {/* User rows */}
            <div className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 text-sm">No users found</div>
              ) : filteredUsers.map(u => (
                <div key={u.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.full_name || '—'}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                    <p className="text-xs text-slate-300 mt-0.5">
                      Joined {new Date(u.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                    <button
                      onClick={() => setConfirmDelete(u)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
                Showing {filteredUsers.length} of {stats?.total ?? 0} users
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <button onClick={() => { setConfirmDelete(null); setDeleteError('') }}
                className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Delete account?</h3>
            <p className="text-sm text-slate-500 mb-2">This will permanently delete:</p>
            <p className="text-sm font-semibold text-slate-800">{confirmDelete.full_name || confirmDelete.email}</p>
            <p className="text-xs text-slate-500 mb-1">{confirmDelete.email}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[confirmDelete.role] ?? 'bg-slate-100 text-slate-600'}`}>
              {confirmDelete.role}
            </span>
            <p className="text-xs text-red-500 mt-3 mb-4">This action cannot be undone.</p>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDelete(null); setDeleteError('') }}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
