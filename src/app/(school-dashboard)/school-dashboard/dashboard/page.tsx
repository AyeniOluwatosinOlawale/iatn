import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Users, BookOpen, Star, TrendingUp, Award, ArrowRight, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

function getGreeting() {
  const hour = new Date().toLocaleString('en-NG', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' })
  const h = parseInt(hour)
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function SchoolDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const schoolName = meta.school_name ?? meta.full_name ?? 'School'
  const params = await searchParams
  const justRegistered = params.registered === 'true'

  type SchoolRow = { registration_number: string | null; is_verified: boolean; verification_status: string; overall_rating: number; review_count: number }

  const { data: school } = await supabase
    .from('schools')
    .select('registration_number, is_verified, verification_status, overall_rating, review_count')
    .eq('user_id', user.id)
    .maybeSingle() as { data: SchoolRow | null; error: unknown }

  const isVerified: boolean = school?.is_verified ?? false
  const registrationNumber: string | null = school?.registration_number ?? null
  const rating: number = school?.overall_rating ?? 0
  const reviewCount: number = school?.review_count ?? 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{getGreeting()} 👋</h1>
            <p className="text-slate-500 mt-0.5 text-sm font-semibold">{schoolName}</p>
            {registrationNumber ? (
              <p className="text-slate-400 text-xs mt-1">
                Registration: <span className="font-mono font-bold text-[#0f3460]">{registrationNumber}</span>
              </p>
            ) : (
              <p className="text-slate-400 text-xs mt-1">Registration number will be assigned after verification.</p>
            )}
          </div>
          {isVerified && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
              ✓ Verified School
            </span>
          )}
        </div>

        {/* Just registered banner */}
        {justRegistered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-emerald-600 flex-shrink-0 mt-0.5">🎉</div>
            <div>
              <div className="text-sm font-bold text-emerald-800">Welcome to Nexora Academic!</div>
              <div className="text-xs text-emerald-700 mt-0.5">Your school profile is being reviewed. Our team will issue your registration number within 2–3 business days.</div>
            </div>
          </div>
        )}

        {/* Verification notice */}
        {!isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-800">Profile under review</div>
              <div className="text-xs text-amber-700 mt-0.5">
                Our team is verifying your school. You will receive your Nexora School Registration Number within 2–3 business days.
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Enrolled Students', value: '—', icon: Users, note: 'Update profile', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Staff / Teachers', value: '—', icon: BookOpen, note: 'Update profile', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Profile Views', value: '0', icon: TrendingUp, note: 'This month', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Avg. Rating', value: rating > 0 ? `${rating}★` : '—', icon: Star, note: `${reviewCount} reviews`, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <span className="text-xs font-medium text-slate-400">{s.note}</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent applications */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Recent Applications</h2>
              <Link href="/school-dashboard/admissions" className="text-xs text-[#0f3460] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-center py-10 text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No applications yet.</p>
              <p className="text-xs mt-1">Student applications will appear here once your profile is live.</p>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              {[
                { href: '/school-dashboard/profile/edit', label: 'Complete your profile', icon: '✏️' },
                { href: '/school-dashboard/recruitment', label: 'Post a job vacancy', icon: '📋' },
                { href: '/school-dashboard/admissions', label: 'Open admissions', icon: '🎓' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick action grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '✏️', label: 'Edit Profile', href: '/school-dashboard/profile/edit' },
            { icon: '📋', label: 'Recruitment', href: '/school-dashboard/recruitment' },
            { icon: '🎓', label: 'Admissions', href: '/school-dashboard/admissions' },
            { icon: '📊', label: 'Analytics', href: '/school-dashboard/analytics' },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0f3460] hover:shadow-sm transition-all text-center">
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-xs font-semibold text-slate-700">{action.label}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
