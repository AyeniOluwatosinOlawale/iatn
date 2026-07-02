import Link from 'next/link'
import { MessageSquare, Users, TrendingUp, ChevronRight, Heart, Eye, Pin, Star } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const FORUMS = [
  {
    id: '1', name: 'IGCSE & O-Level Discussion', icon: '📘', color: 'bg-blue-50 border-blue-200',
    description: 'Discuss IGCSE subjects, share past paper strategies, and get help from fellow students and tutors.',
    posts: 1842, members: 6400, curriculum: 'IGCSE',
    latest: { title: 'Best resources for IGCSE Chemistry Paper 6?', author: 'Chidi_Lagos', time: '2h ago', replies: 14 },
  },
  {
    id: '2', name: 'Cambridge A-Level Hub', icon: '🎓', color: 'bg-indigo-50 border-indigo-200',
    description: 'A-Level subject help, university predictions, and exam strategies for Cambridge AS & A2.',
    posts: 2310, members: 8900, curriculum: 'A-Level',
    latest: { title: 'A-Level Maths Further Pure 3 — anyone struggling with complex numbers?', author: 'MathsGeek_Abuja', time: '45min ago', replies: 27 },
  },
  {
    id: '3', name: 'JAMB Preparation Corner', icon: '🏛️', color: 'bg-teal-50 border-teal-200',
    description: 'Share JAMB past questions, discuss UTME strategies, and celebrate admissions success.',
    posts: 5120, members: 18000, curriculum: 'JAMB',
    latest: { title: 'JAMB 2026 registration — everything you need to know', author: 'ExamPro_NG', time: '1h ago', replies: 89 },
  },
  {
    id: '4', name: 'WAEC & NECO Students', icon: '📚', color: 'bg-orange-50 border-orange-200',
    description: 'WAEC and NECO exam prep, question discussions, and grade achievement stories.',
    posts: 3760, members: 12400, curriculum: 'WAEC/NECO',
    latest: { title: 'WAEC 2026 timetable is out — download link inside', author: 'SS3_Ready', time: '3h ago', replies: 156 },
  },
  {
    id: '5', name: 'IB Diploma Students', icon: '🌍', color: 'bg-purple-50 border-purple-200',
    description: 'IB Internal Assessments, Extended Essay tips, TOK discussions, and CAS ideas.',
    posts: 980, members: 2100, curriculum: 'IB',
    latest: { title: 'My EE topic got approved — tips for IB History HL EE', author: 'IBStudent_PHC', time: '5h ago', replies: 19 },
  },
  {
    id: '6', name: 'SAT & US University Admissions', icon: '🇺🇸', color: 'bg-rose-50 border-rose-200',
    description: 'SAT prep strategies, US college application help, Common App, and scholarship discussions.',
    posts: 1240, members: 3800, curriculum: 'SAT',
    latest: { title: 'Got into UCLA on scholarship — here\'s my full application story', author: 'NigerianInAmerica', time: '1d ago', replies: 203 },
  },
]

const TRENDING = [
  { id: '1', title: 'CAIE outstanding learner award — how to qualify', curriculum: 'A-Level', replies: 341, views: 8920, pinned: true },
  { id: '2', title: 'Complete JAMB 2026 subject combination guide for all courses', curriculum: 'JAMB', replies: 289, views: 14200, pinned: true },
  { id: '3', title: 'WAEC vs NECO — which is better for Nigerian university admissions?', curriculum: 'WAEC', replies: 215, views: 6700, pinned: false },
  { id: '4', title: 'How I scored A* in IGCSE Maths without a tutor', curriculum: 'IGCSE', replies: 178, views: 9100, pinned: false },
  { id: '5', title: 'Best A-Level tutor on IATN — share your recommendations', curriculum: 'A-Level', replies: 134, views: 4500, pinned: false },
]

const CURRICULUM_COLORS: Record<string, string> = {
  'A-Level': 'bg-indigo-100 text-indigo-700',
  'IGCSE': 'bg-blue-100 text-blue-700',
  'JAMB': 'bg-teal-100 text-teal-700',
  'WAEC': 'bg-orange-100 text-orange-700',
  'NECO': 'bg-lime-100 text-lime-700',
  'IB': 'bg-purple-100 text-purple-700',
  'SAT': 'bg-rose-100 text-rose-700',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="iatn-gradient text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">IATN Community</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Join thousands of Nigerian students, parents, and tutors. Discuss exams, share resources, celebrate results, and support each other.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="bg-white text-[#0f3460] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2">
              <Users className="w-4 h-4" /> Join the Community
            </Link>
            <Link href="/login" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Sign In to Post
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f3460] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '52,000+', label: 'Community Members' },
            { value: '15,000+', label: 'Forum Posts' },
            { value: '6', label: 'Subject Forums' },
            { value: '24/7', label: 'Active Discussions' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Forums list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-slate-900 mb-5">Discussion Forums</h2>

            {FORUMS.map((forum) => (
              <Link key={forum.id} href="/login" className={`block border rounded-2xl p-5 hover:shadow-md transition-all group ${forum.color}`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{forum.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-black text-slate-900 group-hover:text-[#0f3460] transition-colors">{forum.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${CURRICULUM_COLORS[forum.curriculum] ?? 'bg-slate-100 text-slate-700'}`}>
                        {forum.curriculum}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{forum.description}</p>

                    {/* Latest post */}
                    <div className="bg-white/70 rounded-xl p-3 mb-3">
                      <div className="text-xs text-slate-500 mb-0.5">Latest post</div>
                      <div className="text-sm font-semibold text-slate-800 truncate">{forum.latest.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>by {forum.latest.author}</span>
                        <span>·</span>
                        <span>{forum.latest.time}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{forum.latest.replies} replies</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{forum.posts.toLocaleString()} posts</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{forum.members.toLocaleString()} members</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#0f3460]" />
                <h3 className="font-black text-slate-900">Trending Discussions</h3>
              </div>
              <div className="space-y-3">
                {TRENDING.map((post) => (
                  <Link key={post.id} href="/login" className="block group">
                    <div className="flex items-start gap-2">
                      {post.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-[#0f3460] transition-colors leading-snug line-clamp-2">{post.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className={`font-bold px-1.5 py-0.5 rounded ${CURRICULUM_COLORS[post.curriculum] ?? 'bg-slate-100 text-slate-600'}`}>{post.curriculum}</span>
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
                          <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.replies}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-slate-900">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'ExamPro_NG', posts: 412, badge: '🏆' },
                  { name: 'MathsGeek_Abuja', posts: 287, badge: '🥈' },
                  { name: 'IBStudent_PHC', posts: 234, badge: '🥉' },
                  { name: 'SS3_Ready', posts: 198, badge: '⭐' },
                  { name: 'NigerianInAmerica', posts: 176, badge: '⭐' },
                ].map((user) => (
                  <div key={user.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{user.badge}</span>
                      <div className="w-7 h-7 rounded-full iatn-gradient flex items-center justify-center text-white text-xs font-bold">
                        {user.name[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">{user.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community rules */}
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
