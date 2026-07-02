import Link from 'next/link'
import { Users, MessageSquare, TrendingUp, ChevronRight, Calendar, Bell, Star, Shield } from 'lucide-react'

const children = [
  {
    name: 'Amara Chukwu',
    year: 'Year 12 (A-Level)',
    school: 'Greensprings School, Lekki',
    subjects: ['A-Level Maths', 'A-Level Economics', 'IGCSE Chemistry'],
    tutor: 'Dr. Adaeze Okonkwo',
    lastLesson: '2 days ago',
    nextLesson: 'Today, 4:00 PM',
    avgScore: 76,
    avatar: 'A',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Kosi Chukwu',
    year: 'Year 10 (IGCSE)',
    school: 'Greensprings School, Lekki',
    subjects: ['IGCSE Maths', 'IGCSE Biology'],
    tutor: 'Mr. Babatunde Ige',
    lastLesson: '3 days ago',
    nextLesson: 'Tomorrow, 10:00 AM',
    avgScore: 82,
    avatar: 'K',
    color: 'bg-purple-100 text-purple-700',
  },
]

const alerts = [
  { type: 'lesson', message: 'Amara has a lesson today at 4:00 PM with Dr. Adaeze', time: '2h ago', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { type: 'score', message: 'Kosi scored 85% on IGCSE Biology mock exam', time: '1d ago', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export default function ParentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Welcome, Mrs. Chukwu 👋</h1>
            <p className="text-slate-500 mt-1 text-sm">Monitoring 2 children · Lagos, Nigeria</p>
          </div>
          <Link href="/tutors" className="text-sm font-semibold bg-[#0f3460] text-white px-4 py-2 rounded-xl hover:bg-[#0a2540] transition-colors">
            Find a Tutor
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Children Enrolled', value: '2', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Active accounts' },
            { label: 'Lessons This Month', value: '14', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', sub: '+3 next week' },
            { label: 'Tutors Engaged', value: '2', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Active this term' },
            { label: 'Avg. Performance', value: '79%', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Across all subjects' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className={`text-xs font-medium mt-1 ${s.color}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children overview */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="font-black text-slate-900">My Children</h2>
            {children.map((child) => (
              <div key={child.name} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${child.color} flex items-center justify-center text-lg font-black flex-shrink-0`}>
                    {child.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-slate-900">{child.name}</h3>
                        <div className="text-xs text-slate-500">{child.year} · {child.school}</div>
                      </div>
                      <Link href="/parent-dashboard/children" className="text-xs font-semibold text-[#0f3460] hover:underline flex-shrink-0">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Current tutor</div>
                    <div className="text-sm font-semibold text-slate-800">{child.tutor}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Last lesson: {child.lastLesson}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Next lesson</div>
                    <div className="text-sm font-semibold text-slate-800">{child.nextLesson}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Online session</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Average mock score</span>
                    <span className="font-bold text-slate-800">{child.avgScore}%</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2">
                    <div className="nexora-gradient h-2 rounded-full" style={{ width: `${child.avgScore}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {child.subjects.map((s) => (
                    <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Recent alerts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-[#0f3460]" />
                <h3 className="font-black text-slate-900 text-sm">Recent Alerts</h3>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${alert.bg}`}>
                    <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.color}`} />
                    <div>
                      <p className="text-xs text-slate-700 font-medium leading-snug">{alert.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-black text-slate-900 text-sm mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Book a lesson', href: '/tutors', icon: Calendar },
                  { label: 'View children', href: '/parent-dashboard/children', icon: Users },
                  { label: 'Message tutors', href: '/parent-dashboard/messages', icon: MessageSquare },
                  { label: 'Find schools', href: '/schools', icon: Shield },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-[#0f3460] transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#0f3460] transition-colors">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f3460] ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
