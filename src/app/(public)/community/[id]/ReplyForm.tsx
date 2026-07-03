'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ReplyForm({ postId }: { postId: string }) {
  const router = useRouter()
  const [session, setSession] = useState<boolean | null>(null)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!body.trim() || body.trim().length < 5) {
      setError('Reply must be at least 5 characters.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/community/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, body: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to post reply.')
        setSubmitting(false)
        return
      }
      setBody('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (session === null) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
        <LogIn className="w-7 h-7 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-semibold mb-1">Sign in to join the discussion</p>
        <p className="text-slate-400 text-sm mb-4">You must be signed in to reply to this post.</p>
        <Link
          href={`/login?redirectTo=/community/${postId}`}
          className="inline-block nexora-gradient text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          Sign in to Reply
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3 className="font-black text-slate-900 mb-4">Add a Reply</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts, answer, or resource…"
          rows={4}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/30 focus:border-[#0f3460] resize-y"
          required
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2.5">
            Reply posted successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="nexora-gradient text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? 'Posting…' : 'Post Reply'}
        </button>
      </form>
    </div>
  )
}
