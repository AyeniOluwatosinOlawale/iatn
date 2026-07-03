'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { useState } from 'react'

export type PostRow = {
  id: string
  author_name: string
  title: string
  body: string
  subject: string | null
  curriculum: string | null
  reply_count: number
  created_at: string
}

const CURRICULUM_BADGE: Record<string, string> = {
  igcse: 'bg-blue-100 text-blue-700',
  a_level: 'bg-indigo-100 text-indigo-700',
  edexcel: 'bg-emerald-100 text-emerald-700',
  ib: 'bg-purple-100 text-purple-700',
  jamb: 'bg-teal-100 text-teal-700',
  neco: 'bg-orange-100 text-orange-700',
  sat: 'bg-rose-100 text-rose-700',
  act: 'bg-pink-100 text-pink-700',
  oxfordaqa: 'bg-cyan-100 text-cyan-700',
  jupeb: 'bg-yellow-100 text-yellow-700',
}

const CURRICULUM_LABEL: Record<string, string> = {
  igcse: 'IGCSE',
  a_level: 'A-Level',
  edexcel: 'Edexcel',
  ib: 'IB',
  jamb: 'JAMB',
  neco: 'WAEC/NECO',
  sat: 'SAT',
  act: 'ACT',
  oxfordaqa: 'Oxford AQA',
  jupeb: 'JUPEB',
}

const FILTERS = [
  { label: 'All', value: null },
  { label: 'IGCSE', value: 'igcse' },
  { label: 'A-Level', value: 'a_level' },
  { label: 'JAMB', value: 'jamb' },
  { label: 'WAEC/NECO', value: 'neco' },
  { label: 'IB', value: 'ib' },
  { label: 'SAT', value: 'sat' },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 2) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function CommunityClient({ posts }: { posts: PostRow[] }) {
  const [active, setActive] = useState<string | null>(null)

  const filtered = active ? posts.filter((p) => p.curriculum === active) : posts

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActive(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              active === f.value
                ? 'nexora-gradient text-white border-transparent'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold mb-2">No posts yet in this category</p>
          <Link
            href="/community/new"
            className="inline-block nexora-gradient text-white font-bold px-5 py-2 rounded-xl mt-2 hover:opacity-90 transition-opacity"
          >
            Start the first discussion
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="block bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-black text-slate-900 group-hover:text-[#0f3460] transition-colors leading-snug flex-1">
                  {post.title}
                </h3>
                {post.curriculum && CURRICULUM_LABEL[post.curriculum] && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      CURRICULUM_BADGE[post.curriculum] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {CURRICULUM_LABEL[post.curriculum]}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {post.body.length > 120 ? post.body.slice(0, 120) + '…' : post.body}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{post.author_name}</span>
                <span>·</span>
                <span>{timeAgo(post.created_at)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
