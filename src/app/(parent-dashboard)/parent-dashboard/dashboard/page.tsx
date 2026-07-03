import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Users, Calendar, ArrowRight, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

function getGreeting() {
  const hour = new Date().toLocaleString('en-NG', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' })
  const h = parseInt(hour)
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function ParentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const firstName = (meta.full_name ?? meta.name ?? 'Parent').split(' ')[0]
  const childrenCount = meta.children_count ?? 0
  const params = await searchParams
  const justRegistered = params.registered === 'true'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900">{getGreeting()}, {firstName} 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor your {childrenCount > 0 ? `${childrenCount} child${childrenCount > 1 ? 'ren' : ''}` : 'children'}&apos;s progress and manage their tutoring.</p>
        </div>

        {/* Just registered banner */}
        {justRegistered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-emerald-600 flex-shrink-0 mt-0.5">🎉</div>
            <div>
              <div className="text-sm font-bold text-emerald-800">Welcome to Nexora Academic!</div>
              <div className="text-xs text-emerald-700 mt-0.5">Your account is ready. Start by searching for tutors or schools for your child.</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Children Registered', value: String(childrenCount || 0), icon: Users, note: 'On Nexora', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Tutors', value: '0', icon: Search, note: 'Booked', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Upcoming Lessons', value: '0', icon: Calendar, note: 'This week', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Sessions This Month', value: '0', icon: Calendar, note: 'Total', color: 'text-amber-600', bg: 'bg-amber-50' },
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
          {/* Children overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">My Children</h2>
              <Link href="/parent-dashboard/children" className="text-xs text-[#0f3460] hover:underline flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-center py-10 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Children&apos;s profiles will appear here.</p>
              <p className="text-xs mt-1 mb-4">Link your children&apos;s accounts to monitor their progress.</p>
              <Link href="/parent-dashboard/children" className="inline-block bg-[#0f3460] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Add Children
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Messages</h2>
              <Link href="/parent-dashboard/messages" className="text-xs text-[#0f3460] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-center py-10 text-slate-400">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">Messages from tutors will appear here.</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🔍', label: 'Find Tutors', href: '/tutors' },
            { icon: '🏫', label: 'Find Schools', href: '/schools' },
            { icon: '👧', label: 'My Children', href: '/parent-dashboard/children' },
            { icon: '💳', label: 'Payments', href: '/parent-dashboard/payments' },
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
