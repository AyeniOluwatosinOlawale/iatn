import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, Star, Users, TrendingUp, Eye, Award, ArrowRight, BookOpen, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

function getGreeting() {
  const hour = new Date().toLocaleString('en-NG', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' })
  const h = parseInt(hour)
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function TutorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const firstName = (meta.full_name ?? meta.name ?? 'Tutor').split(' ')[0]

  type TutorRow = { id: string; registration_number: string | null; is_verified: boolean; verification_status: string; overall_rating: number; review_count: number; total_teaching_hours: number }
  type BookingRow = { id: string; subject: string; curriculum: string; start_time: string; end_time: string; lesson_type: string; status: string }

  const { data: tutor } = await supabase
    .from('tutors')
    .select('id, registration_number, is_verified, verification_status, overall_rating, review_count, total_teaching_hours')
    .eq('user_id', user.id)
    .maybeSingle() as { data: TutorRow | null; error: unknown }

  let bookings: BookingRow[] = []
  if (tutor?.id) {
    const { data } = await supabase
      .from('bookings')
      .select('id, subject, curriculum, start_time, end_time, lesson_type, status')
      .eq('tutor_id', tutor.id)
      .gte('start_time', new Date().toISOString())
      .in('status', ['confirmed', 'pending'])
      .order('start_time', { ascending: true })
      .limit(3) as { data: BookingRow[] | null; error: unknown }
    bookings = data ?? []
  }

  const params = await searchParams
  const justRegistered = params.registered === 'true'

  const isVerified: boolean = tutor?.is_verified ?? false
  const verificationStatus: string = tutor?.verification_status ?? 'pending'
  const registrationNumber: string | null = tutor?.registration_number ?? null
  const rating: number = tutor?.overall_rating ?? 0
  const reviewCount: number = tutor?.review_count ?? 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{getGreeting()}, {firstName} 👋</h1>
            {registrationNumber ? (
              <p className="text-slate-500 mt-1 text-sm">
                Your Nexora registration: <span className="font-mono font-bold text-[#0f3460]">{registrationNumber}</span>
              </p>
            ) : (
              <p className="text-slate-500 mt-1 text-sm">Your registration number will be assigned after verification.</p>
            )}
          </div>
          {isVerified && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
              ✓ Verified Tutor
            </span>
          )}
        </div>

        {/* Just registered banner */}
        {justRegistered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-emerald-600 flex-shrink-0 mt-0.5">🎉</div>
            <div>
              <div className="text-sm font-bold text-emerald-800">Welcome to Nexora Academic!</div>
              <div className="text-xs text-emerald-700 mt-0.5">Your account has been created. Complete your profile to start appearing in search results.</div>
            </div>
          </div>
        )}

        {/* Verification notice */}
        {!isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-800">
                {verificationStatus === 'pending' ? 'Profile under verification' : 'Verification in progress'}
              </div>
              <div className="text-xs text-amber-700 mt-0.5">
                Our team is reviewing your certificates. You will receive an email once verified. This usually takes 24–48 hours.
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">This month</span>
            </div>
            <div className="text-2xl font-black text-slate-900">0</div>
            <div className="text-xs text-slate-500 mt-0.5">Lessons This Month</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Total</span>
            </div>
            <div className="text-2xl font-black text-slate-900">0</div>
            <div className="text-xs text-slate-500 mt-0.5">Active Students</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">Total hours</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{tutor?.total_teaching_hours ?? 0}</div>
            <div className="text-xs text-slate-500 mt-0.5">Teaching Hours</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-400">{reviewCount} reviews</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{rating > 0 ? `${rating}★` : '—'}</div>
            <div className="text-xs text-slate-500 mt-0.5">Overall Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming lessons */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Upcoming Lessons</h2>
              <Link href="/tutor-dashboard/bookings" className="text-xs text-[#0f3460] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="w-10 h-10 nexora-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {b.subject?.[0] ?? 'L'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{b.subject}</div>
                      <div className="text-xs text-slate-500">{b.curriculum} · {b.lesson_type}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-medium text-slate-700">
                        {new Date(b.start_time).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Africa/Lagos' })}
                      </div>
                      <div className={`text-xs mt-0.5 ${b.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>{b.status}</div>
                    </div>
                    <button className="text-xs bg-[#0f3460] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No upcoming lessons yet.</p>
                <p className="text-xs mt-1">Once students book sessions with you, they&apos;ll appear here.</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Messages</h2>
              <Link href="/tutor-dashboard/messages" className="text-xs text-[#0f3460] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-center py-10 text-slate-400">
              <div className="w-8 h-8 mx-auto mb-2 opacity-40 text-2xl">💬</div>
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">Messages from students and parents will appear here.</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Eye, label: 'View Public Profile', href: '/tutors/me', color: 'bg-blue-50 text-blue-700' },
            { icon: Calendar, label: 'Manage Availability', href: '/tutor-dashboard/bookings', color: 'bg-purple-50 text-purple-700' },
            { icon: TrendingUp, label: 'View Analytics', href: '/tutor-dashboard/analytics', color: 'bg-emerald-50 text-emerald-700' },
            { icon: BookOpen, label: 'Sell Resources', href: '/tutor-dashboard/resources/sell', color: 'bg-amber-50 text-amber-700' },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0f3460] hover:shadow-sm transition-all text-center">
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-700">{action.label}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
