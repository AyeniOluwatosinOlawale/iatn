import { redirect } from 'next/navigation'
import { Star, Users, TrendingUp, Eye, ArrowLeft, Award } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function SchoolAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  type SchoolRow = {
    overall_rating: number
    review_count: number
    student_count: number | null
    is_verified: boolean
    school_name: string
    created_at: string
  }

  const { data: school } = await supabase
    .from('schools')
    .select('overall_rating, review_count, student_count, is_verified, school_name, created_at')
    .eq('user_id', user.id)
    .maybeSingle() as { data: SchoolRow | null }

  if (!school) redirect('/school-dashboard/dashboard')

  const joinedDate = new Date(school.created_at).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const stats = [
    {
      icon: Star,
      label: 'Average Rating',
      value: school.overall_rating > 0 ? Number(school.overall_rating).toFixed(1) : '—',
      sub: `${school.review_count} review${school.review_count !== 1 ? 's' : ''}`,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Users,
      label: 'Enrolled Students',
      value: school.student_count ?? '—',
      sub: 'From your profile',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Eye,
      label: 'Profile Views',
      value: '0',
      sub: 'Tracking coming soon',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Applications',
      value: '0',
      sub: 'This month',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex items-center gap-3">
          <Link href="/school-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
            <p className="text-slate-500 text-sm mt-0.5">How {school.school_name} is performing</p>
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

          {/* Rating breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-[#0f3460]" />
              <h2 className="font-black text-slate-900">Rating Overview</h2>
            </div>
            {school.review_count === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reviews yet.</p>
                <p className="text-xs mt-1">Reviews from students and parents will appear here.</p>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-slate-900">{Number(school.overall_rating).toFixed(1)}</div>
                  <div className="flex justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(school.overall_rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{school.review_count} reviews</div>
                </div>
              </div>
            )}
          </div>

          {/* School info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-[#0f3460]" />
              <h2 className="font-black text-slate-900">Account Summary</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Member since', value: joinedDate },
                { label: 'Verification', value: school.is_verified ? '✓ Verified' : 'Pending review' },
                { label: 'Profile completeness', value: 'Visit Edit Profile to improve' },
              ].map(row => (
                <div key={row.label} className="flex items-start justify-between gap-4 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-slate-500 font-medium">{row.label}</span>
                  <span className={`font-semibold text-right ${row.value.startsWith('✓') ? 'text-emerald-600' : 'text-slate-900'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <Link href="/school-dashboard/profile/edit"
              className="mt-5 block w-full text-center bg-[#0f3460] text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              Complete Your Profile
            </Link>
          </div>

        </div>

        {/* Coming soon notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-blue-800">More analytics coming soon</p>
          <p className="text-xs text-blue-600 mt-1">Profile view tracking, application trends, and student engagement data will appear here.</p>
        </div>

      </div>
    </div>
  )
}
