import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, MessageSquare, User } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import ReplyForm from './ReplyForm'

type Post = {
  id: string
  author_name: string
  title: string
  body: string
  subject: string | null
  curriculum: string | null
  reply_count: number
  is_pinned: boolean
  created_at: string
}

type Reply = {
  id: string
  author_name: string
  body: string
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

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = (await supabase
    .from('community_posts')
    .select('id, author_name, title, body, subject, curriculum, reply_count, is_pinned, created_at')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()) as { data: Post | null; error: unknown }

  if (!post) notFound()

  const { data: repliesData } = (await supabase
    .from('community_replies')
    .select('id, author_name, body, created_at')
    .eq('post_id', id)
    .eq('is_published', true)
    .order('created_at', { ascending: true })) as { data: Reply[] | null; error: unknown }

  const replies: Reply[] = repliesData ?? []

  const curriculumLabel = post.curriculum ? (CURRICULUM_LABEL[post.curriculum] ?? null) : null
  const curriculumBadge = post.curriculum ? (CURRICULUM_BADGE[post.curriculum] ?? 'bg-slate-100 text-slate-700') : null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="nexora-gradient text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white line-clamp-1">{post.title}</span>
          </div>
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black flex-1">{post.title}</h1>
            {curriculumLabel && curriculumBadge && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-1 ${curriculumBadge}`}>
                {curriculumLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-white/70 text-sm mt-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {post.author_name}
            </span>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
            {post.subject && (
              <>
                <span>·</span>
                <span>{post.subject}</span>
              </>
            )}
            <span>·</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Post body */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full nexora-gradient flex items-center justify-center text-white text-sm font-bold">
              {post.author_name[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">{post.author_name}</span>
              <span className="text-xs text-slate-400 ml-2">{timeAgo(post.created_at)}</span>
            </div>
          </div>
          <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {post.body}
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-4">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                      {reply.author_name[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900">{reply.author_name}</span>
                      <span className="text-xs text-slate-400 ml-2">{timeAgo(reply.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply form */}
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4">Join the Discussion</h2>
          <ReplyForm postId={id} />
        </div>

        <div className="pt-2">
          <Link href="/community" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to Community
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
