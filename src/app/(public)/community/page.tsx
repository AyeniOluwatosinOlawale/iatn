import Link from 'next/link'
import { ChevronRight, Heart, Star, PenSquare } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import CommunityClient, { type PostRow } from './CommunityClient'

type ContributorRow = {
  author_name: string
  post_count: number
}

const BADGES = ['🏆', '🥈', '🥉', '⭐', '⭐']

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  const supabase = await createClient()

  const { data: postsData } = (await supabase
    .from('community_posts')
    .select('id, author_name, title, body, subject, curriculum, reply_count, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(50)) as { data: PostRow[] | null; error: unknown }

  const posts: PostRow[] = postsData ?? []

  // Aggregate top contributors client-side from posts data (avoids needing an RPC)
  const contributorMap: Record<string, number> = {}
  for (const p of posts) {
    if (p.author_name) {
      contributorMap[p.author_name] = (contributorMap[p.author_name] ?? 0) + 1
    }
  }
  const contributors: ContributorRow[] = Object.entries(contributorMap)
    .map(([author_name, post_count]) => ({ author_name, post_count }))
    .sort((a, b) => b.post_count - a.post_count)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="nexora-gradient text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Nexora Community</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Join thousands of Nigerian students, parents, and tutors. Discuss exams, share resources, celebrate results, and support each other.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/community/new"
              className="bg-white text-[#0f3460] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4" /> Start a Discussion
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main posts area */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-900">Recent Discussions</h2>
              <Link
                href="/community/new"
                className="nexora-gradient text-white font-semibold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
              >
                <PenSquare className="w-3.5 h-3.5" /> New Post
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 font-semibold mb-3">No discussions yet — be the first!</p>
                <Link
                  href="/community/new"
                  className="inline-block nexora-gradient text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Start the first discussion
                </Link>
              </div>
            ) : (
              <CommunityClient posts={posts} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-slate-900">Top Contributors</h3>
              </div>
              {contributors.length === 0 ? (
                <p className="text-sm text-slate-500">No contributors yet.</p>
              ) : (
                <div className="space-y-3">
                  {contributors.map((user, i) => (
                    <div key={user.author_name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{BADGES[i] ?? '⭐'}</span>
                        <div className="w-7 h-7 rounded-full nexora-gradient flex items-center justify-center text-white text-xs font-bold">
                          {user.author_name[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{user.author_name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{user.post_count} posts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Community Rules */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500" /> Community Rules
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {[
                  'Be respectful and supportive',
                  'No spamming or self-promotion',
                  'Share verified exam information only',
                  'Help others — you were a student once too',
                  'Report inappropriate content',
                ].map((rule) => (
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
