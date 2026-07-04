import { redirect } from 'next/navigation'
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ManageAvailabilityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  type TutorRow = { id: string; full_name: string; teaching_mode: string | null }
  const { data: tutor } = await supabase
    .from('tutors')
    .select('id, full_name, teaching_mode')
    .eq('user_id', user.id)
    .maybeSingle() as { data: TutorRow | null }

  type BookingRow = {
    id: string; subject: string; curriculum: string
    start_time: string; end_time: string
    lesson_type: string; status: string
    student_name?: string | null
  }

  let upcoming: BookingRow[] = []
  let past: BookingRow[] = []

  if (tutor?.id) {
    const now = new Date().toISOString()
    const [upRes, pastRes] = await Promise.all([
      supabase.from('bookings')
        .select('id, subject, curriculum, start_time, end_time, lesson_type, status')
        .eq('tutor_id', tutor.id)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(20) as unknown as Promise<{ data: BookingRow[] | null }>,
      supabase.from('bookings')
        .select('id, subject, curriculum, start_time, end_time, lesson_type, status')
        .eq('tutor_id', tutor.id)
        .lt('start_time', now)
        .order('start_time', { ascending: false })
        .limit(10) as unknown as Promise<{ data: BookingRow[] | null }>,
    ])
    upcoming = upRes.data ?? []
    past = pastRes.data ?? []
  }

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    confirmed: { label: 'Confirmed', color: 'text-emerald-700 bg-emerald-50', icon: CheckCircle2 },
    pending:   { label: 'Pending',   color: 'text-amber-700 bg-amber-50',   icon: AlertCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-50',       icon: XCircle },
    completed: { label: 'Completed', color: 'text-slate-600 bg-slate-100',  icon: CheckCircle2 },
  }

  function BookingCard({ b }: { b: BookingRow }) {
    const cfg = statusConfig[b.status] ?? statusConfig.pending
    const Icon = cfg.icon
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 nexora-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {b.subject?.[0] ?? 'L'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900">{b.subject}</div>
          <div className="text-xs text-slate-500 mt-0.5">{b.curriculum} · {b.lesson_type}</div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {new Date(b.start_time).toLocaleString('en-NG', {
              weekday: 'short', day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos'
            })}
          </div>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.color}`}>
          <Icon className="w-3 h-3" /> {cfg.label}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex items-center gap-3">
          <Link href="/tutor-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Manage Availability</h1>
            <p className="text-slate-500 text-sm mt-0.5">View and manage your bookings</p>
          </div>
        </div>

        {/* Teaching mode notice */}
        {tutor?.teaching_mode && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <span className="font-semibold">Your teaching mode:</span>{' '}
            {tutor.teaching_mode === 'online' ? 'Online only'
              : tutor.teaching_mode === 'physical' ? 'Physical / In-person only'
              : 'Both online and physical'}
            {' — '}
            <Link href="/tutor-dashboard/profile/edit" className="underline font-semibold">Update in profile</Link>
          </div>
        )}

        {/* Upcoming */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0f3460]" />
            <h2 className="text-lg font-black text-slate-900">Upcoming Lessons</h2>
            <span className="ml-1 bg-[#0f3460] text-white text-xs font-bold px-2 py-0.5 rounded-full">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No upcoming lessons</p>
              <p className="text-xs mt-1">When students book sessions, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(b => <BookingCard key={b.id} b={b} />)}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-4">Past Lessons</h2>
            <div className="space-y-3">
              {past.map(b => <BookingCard key={b.id} b={b} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
