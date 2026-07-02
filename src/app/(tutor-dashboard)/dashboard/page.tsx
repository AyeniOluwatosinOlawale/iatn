import Link from 'next/link'
import { Calendar, DollarSign, Star, Users, TrendingUp, Eye, Award, ArrowRight, BookOpen } from 'lucide-react'
import { formatNgn } from '@/lib/utils'

const stats = [
  { label: 'This Month Earnings', value: formatNgn(185000), icon: DollarSign, change: '+12%', color: 'text-emerald-600' },
  { label: 'Active Students', value: '23', icon: Users, change: '+3', color: 'text-blue-600' },
  { label: 'Upcoming Lessons', value: '8', icon: Calendar, change: 'This week', color: 'text-purple-600' },
  { label: 'Overall Rating', value: '4.9★', icon: Star, change: '87 reviews', color: 'text-amber-600' },
]

const upcomingLessons = [
  { student: 'Amara N.', subject: 'A-Level Mathematics', time: 'Today, 4:00 PM', duration: '90 min', mode: 'online' },
  { student: 'Chidi O.', subject: 'IGCSE Further Maths', time: 'Tomorrow, 10:00 AM', duration: '60 min', mode: 'online' },
  { student: 'Sola A.', subject: 'A-Level Mathematics', time: 'Thu 17 Jul, 3:00 PM', duration: '90 min', mode: 'physical' },
]

const recentMessages = [
  { from: 'Mrs. Kemi Adeyemi', message: 'Can we schedule an extra session this weekend for my son?', time: '1h ago', unread: true },
  { from: 'Tunde B.', message: "Thank you for yesterday's lesson! I finally understood integration.", time: '3h ago', unread: false },
]

export default function TutorDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar + main layout would be here in a full app */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Good morning, Dr. Adaeze 👋</h1>
            <p className="text-slate-500 mt-1 text-sm">Your IATN registration: <span className="font-mono font-bold text-[#0f3460]">IATN-2026-000001</span></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-verified">✓ Verified Tutor</span>
            <span className="badge-cambridge">🏆 Cambridge Expert</span>
          </div>
        </div>

        {/* Verification notice if pending */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-800">Profile under verification</div>
            <div className="text-xs text-amber-700 mt-0.5">Our team is reviewing your certificates. You will receive an email once verified. This usually takes 24–48 hours.</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <span className={`text-xs font-medium ${s.color}`}>{s.change}</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
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
            <div className="space-y-3">
              {upcomingLessons.map((l, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-10 h-10 iatn-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {l.student[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{l.student}</div>
                    <div className="text-xs text-slate-500">{l.subject}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-medium text-slate-700">{l.time}</div>
                    <div className="text-xs text-slate-400">{l.duration} · {l.mode}</div>
                  </div>
                  <button className="text-xs bg-[#0f3460] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Messages</h2>
              <Link href="/tutor-dashboard/messages" className="text-xs text-[#0f3460] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentMessages.map((m, i) => (
                <div key={i} className={`p-3.5 rounded-xl border cursor-pointer hover:border-slate-300 transition-colors ${m.unread ? 'border-[#0f3460] bg-blue-50' : 'border-slate-100'}`}>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-0.5">
                      {m.from[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 truncate">{m.from}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{m.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{m.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Eye, label: 'View Public Profile', href: '/tutors/1', color: 'bg-blue-50 text-blue-700' },
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
