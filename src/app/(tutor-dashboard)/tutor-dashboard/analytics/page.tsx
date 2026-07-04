import { redirect } from 'next/navigation'
import { TrendingUp, Eye, Star, Users, MessageSquare, ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  type TutorRow = {
    id: string; overall_rating: number; review_count: number
    total_teaching_hours: number; profile_views: number
  }
  const { data: tutor } = await supabase
    .from('tutors')
    .select('id, overall_rating, review_count, total_teaching_hours, profile_views')
    .eq('user_id', user.id)
    .maybeSingle() as { data: TutorRow | null }

  if (!tutor) redirect('/tutor-dashboard/dashboard')

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  type ViewRow = { created_at: string; viewer_role: string }
  type ReviewRow = { rating: number; body: string | null; created_at: string; reviewer_name: string | null }

  const [viewsRes, reviewsRes] = await Promise.all([
    serviceClient.from('profile_views')
      .select('created_at, viewer_role')
      .eq('tutor_id', tutor.id)
      .order('created_at', { ascending: false })
      .limit(100) as unknown as Promise<{ data: ViewRow[] | null }>,
    serviceClient.from('reviews')
      .select('rating, body, created_at, reviewer_name')
      .eq('tutor_id', tutor.id)
      .order('created_at', { ascending: false })
      .limit(10) as unknown as Promise<{ data: ReviewRow[] | null }>,
  ])

  const views = viewsRes.data ?? []
  const reviews = reviewsRes.data ?? []

  // Views this week vs last week
  const now = Date.now()
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  const viewsThisWeek = views.filter(v => now - new Date(v.created_at).getTime() < oneWeek).length
  const viewsLastWeek = views.filter(v => {
    const age = now - new Date(v.created_at).getTime()
    return age >= oneWeek && age < 2 * oneWeek
  }).length

  // Views by role
  const roleMap: Record<string, number> = {}
  for (const v of views) roleMap[v.viewer_role] = (roleMap[v.viewer_role] ?? 0) + 1

  const stats = [
    { icon: Eye, label: 'Total Profile Views', value: views.length, sub: `${viewsThisWeek} this week`, color: 'bg-blue-50 text-blue-600' },
    { icon: Star, label: 'Average Rating', value: tutor.overall_rating > 0 ? Number(tutor.overall_rating).toFixed(1) : '—', sub: `${tutor.review_count} reviews`, color: 'bg-amber-50 text-amber-600' },
    { icon: Calendar, label: 'Teaching Hours', value: tutor.total_teaching_hours ?? 0, sub: 'All time', color: 'bg-purple-50 text-purple-600' },
    { icon: Users, label: 'Students Reached', value: views.length, sub: 'Unique profile visits', color: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex items-center gap-3">
          <Link href="/tutor-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
            <p className="text-slate-500 text-sm mt-0.5">How your profile is performing</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views by visitor type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-[#0f3460]" />
              <h2 className="font-black text-slate-900">Views This Week vs Last Week</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'This week', value: viewsThisWeek, max: Math.max(viewsThisWeek, viewsLastWeek, 1), color: 'nexora-gradient' },
                { label: 'Last week', value: viewsLastWeek, max: Math.max(viewsThisWeek, viewsLastWeek, 1), color: 'bg-slate-200' },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{row.label}</span>
                    <span className="font-bold text-slate-900">{row.value}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${Math.round((row.value / row.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Visitors by Role</h3>
              <div className="space-y-2">
                {Object.entries(roleMap).length === 0 ? (
                  <p className="text-sm text-slate-400">No visitor data yet.</p>
                ) : (
                  Object.entries(roleMap).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 capitalize">{role}</span>
                      <span className="font-bold text-slate-900">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-5 h-5 text-[#0f3460]" />
              <h2 className="font-black text-slate-900">Recent Reviews</h2>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reviews yet.</p>
                <p className="text-xs mt-1">Reviews from students will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-800">{r.reviewer_name ?? 'Anonymous'}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    {r.body && <p className="text-xs text-slate-500 leading-relaxed">{r.body}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(r.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
