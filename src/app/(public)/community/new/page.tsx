'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Loader2, LogIn } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/client'

const CURRICULUM_OPTIONS = [
  'Cambridge IGCSE',
  'Cambridge A-Level',
  'Edexcel',
  'IB Diploma',
  'JAMB / UTME',
  'WAEC / WASSCE',
  'SAT',
]

export default function NewPostPage() {
  const router = useRouter()
  const [session, setSession] = useState<boolean | null>(null) // null = loading
  const [title, setTitle] = useState('')
  const [curriculum, setCurriculum] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Please enter a title.'); return }
    if (!body.trim() || body.trim().length < 20) { setError('Body must be at least 20 characters.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/community/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), subject: subject.trim(), curriculum }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create post.')
        setSubmitting(false)
        return
      }
      router.push('/community/' + data.id)
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  // Loading state
  if (session === null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  // Not signed in
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <LogIn className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-black text-slate-900 mb-2">Sign in required</h2>
            <p className="text-slate-500 text-sm mb-6">
              You must be signed in to start a discussion.
            </p>
            <Link
              href="/login?redirectTo=/community/new"
              className="inline-block nexora-gradient text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign in to continue
            </Link>
            <div className="mt-4">
              <Link href="/community" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                ← Back to Community
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Signed in — show form
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="nexora-gradient text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">New Discussion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Start a Discussion</h1>
          <p className="text-white/70 text-sm mt-1">Share a question, tip, or resource with the community.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g. Best resources for IGCSE Chemistry Paper 6?"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460]"
                maxLength={200}
                required
              />
            </div>

            {/* Curriculum */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Curriculum</label>
              <select
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460] bg-white"
              >
                <option value="">— Select curriculum (optional)</option>
                {CURRICULUM_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="E.g. Mathematics, Biology, Economics… (optional)"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460]"
                maxLength={100}
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Discussion body <span className="text-red-500">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your question, resource, or insight…"
                rows={7}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460] resize-y"
                required
                minLength={20}
              />
              <p className="text-xs text-slate-400 mt-1">{body.length} characters (minimum 20)</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="nexora-gradient text-white font-bold px-7 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Posting…' : 'Post Discussion'}
              </button>
              <Link href="/community" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
