'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Heart, Star, PenSquare, Lock, Loader2, Eye, EyeOff, AlertCircle, MessageSquare, Clock } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DualVideoHero from '@/components/shared/DualVideoHero'

// ─── Types ─────────────────────────────────────────────────────────────────
type PostRow = {
  id: string
  author_name: string | null
  title: string
  body: string
  subject: string | null
  curriculum: string | null
  reply_count: number
  created_at: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const CURRICULUM_COLORS: Record<string, string> = {
  igcse: 'bg-blue-100 text-blue-700',
  a_level: 'bg-indigo-100 text-indigo-700',
  edexcel: 'bg-emerald-100 text-emerald-700',
  ib: 'bg-purple-100 text-purple-700',
  jamb: 'bg-teal-100 text-teal-700',
  neco: 'bg-orange-100 text-orange-700',
  sat: 'bg-rose-100 text-rose-700',
  oxfordaqa: 'bg-amber-100 text-amber-700',
}

const CURRICULUM_LABELS: Record<string, string> = {
  igcse: 'IGCSE', a_level: 'A-Level', edexcel: 'Edexcel',
  ib: 'IB', jamb: 'JAMB', neco: 'WAEC/NECO', sat: 'SAT', oxfordaqa: 'OxfordAQA',
}

const FILTERS = ['All', 'IGCSE', 'A-Level', 'JAMB', 'WAEC/NECO', 'IB', 'SAT']

function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const BADGES = ['🏆', '🥈', '🥉', '⭐', '⭐']

// ─── Auth Gate ──────────────────────────────────────────────────────────────
function CommunityGate({ onSuccess }: { onSuccess: () => void }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/check-ai-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Access denied.')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 nexora-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign in to join Community</h2>
          <p className="text-slate-500 text-sm mt-1">Available to registered students, tutors, parents and schools.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                placeholder="Your password"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full nexora-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Verifying...' : 'Sign In & Enter Community'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          No account?{' '}
          <Link href="/register" className="font-semibold text-[#0f3460] hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  )
}

// ─── Community Content ──────────────────────────────────────────────────────
function CommunityContent() {
  const [posts,      setPosts]      = useState<PostRow[]>([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('All')

  useEffect(() => {
    fetch('/api/community/posts')
      .then(r => r.json())
      .then(d => { setPosts(d.posts ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? posts : posts.filter(p => {
    const label = CURRICULUM_LABELS[p.curriculum ?? ''] ?? ''
    return label === filter || (filter === 'WAEC/NECO' && (label === 'WAEC/NECO'))
  })

  const contributorMap: Record<string, number> = {}
  for (const p of posts) {
    if (p.author_name) contributorMap[p.author_name] = (contributorMap[p.author_name] ?? 0) + 1
  }
  const contributors = Object.entries(contributorMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden nexora-gradient text-white py-14 px-4">
        <DualVideoHero src1="/videos/hero-community2.mp4" src2="/videos/hero-community.mp4" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,52,96,0.82) 0%, rgba(22,33,62,0.78) 60%, rgba(26,26,46,0.75) 100%)' }} aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Nexora Community</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Join Nigerian students, parents, and tutors. Discuss exams, share resources, celebrate results, and support each other.
          </p>
          <Link
            href="/community/new"
            className="bg-white text-[#0f3460] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
          >
            <PenSquare className="w-4 h-4" /> Start a Discussion
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Posts feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900">Recent Discussions</h2>
              <Link
                href="/community/new"
                className="nexora-gradient text-white font-semibold text-sm px-4 py-2 rounded-xl hover:opacity-90 inline-flex items-center gap-1.5"
              >
                <PenSquare className="w-3.5 h-3.5" /> New Post
              </Link>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${filter === f ? 'nexora-gradient text-white border-transparent' : 'border-slate-200 text-slate-600 hover:border-[#0f3460]'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#0f3460] animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold mb-3">
                  {posts.length === 0 ? 'No discussions yet — be the first!' : 'No posts in this category yet.'}
                </p>
                <Link href="/community/new" className="inline-block nexora-gradient text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90">
                  Start the first discussion
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(post => (
                  <Link key={post.id} href={`/community/${post.id}`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#0f3460] hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-[#0f3460] transition-colors leading-snug">{post.title}</h3>
                      {post.curriculum && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${CURRICULUM_COLORS[post.curriculum] ?? 'bg-slate-100 text-slate-600'}`}>
                          {CURRICULUM_LABELS[post.curriculum] ?? post.curriculum}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{post.body.slice(0, 120)}{post.body.length > 120 ? '…' : ''}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-medium text-slate-600">{post.author_name ?? 'Anonymous'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-slate-900">Top Contributors</h3>
              </div>
              {contributors.length === 0 ? (
                <p className="text-sm text-slate-500">No contributors yet.</p>
              ) : (
                <div className="space-y-3">
                  {contributors.map((u, i) => (
                    <div key={u.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{BADGES[i] ?? '⭐'}</span>
                        <div className="w-7 h-7 rounded-full nexora-gradient flex items-center justify-center text-white text-xs font-bold">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{u.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{u.count} posts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500" /> Community Rules
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {['Be respectful and supportive', 'No spamming or self-promotion', 'Share verified exam information only', 'Help others — you were a student once too', 'Report inappropriate content'].map(rule => (
                  <li key={rule} className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span> {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [authed, setAuthed] = useState(false)

  if (!authed) return <CommunityGate onSuccess={() => setAuthed(true)} />
  return <CommunityContent />
}
