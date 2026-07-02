import Link from 'next/link'
import { Calendar, BookOpen, TrendingUp, MessageSquare, Award, ChevronRight, Clock, Target, Zap } from 'lucide-react'

const stats = [
  { label: 'Upcoming Lessons', value: '3', icon: Calendar, change: 'This week', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Study Hours', value: '42h', icon: Clock, change: 'This month', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Mock Exams Taken', value: '8', icon: BookOpen, change: '+2 this week', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Avg. Mock Score', value: '76%', icon: TrendingUp, change: '+4% vs last', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const upcomingLessons = [
  { tutor: 'Dr. Adaeze Okonkwo', subject: 'A-Level Mathematics', time: 'Today, 4:00 PM', duration: '90 min', mode: 'online', avatar: 'A' },
  { tutor: 'Mr. Babatunde Ige', subject: 'IGCSE Chemistry', time: 'Tomorrow, 10:00 AM', duration: '60 min', mode: 'online', avatar: 'B' },
  { tutor: 'Mrs. Chioma Nwosu', subject: 'A-Level Economics', time: 'Fri, 2:00 PM', duration: '90 min', mode: 'physical', avatar: 'C' },
]

const recentScores = [
  { exam: 'A-Level Maths P1 Mock', score: 72, total: 100, grade: 'B', date: '2 days ago' },
  { exam: 'IGCSE Chemistry Paper 4', score: 81, total: 100, grade: 'A', date: '5 days ago' },
  { exam: 'A-Level Economics P2 Mock', score: 68, total: 100, grade: 'B', date: '1 week ago' },
]

const studyPlan = [
  { subject: 'A-Level Maths', topic: 'Further Pure — Complex Numbers', due: 'Today', priority: 'high' },
  { subject: 'IGCSE Chemistry', topic: 'Organic Chemistry revision', due: 'Tomorrow', priority: 'medium' },
  { subject: 'A-Level Economics', topic: 'Macroeconomics essay plan', due: 'Friday', priority: 'medium' },
]

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Good morning, Amara 👋</h1>
            <p className="text-slate-500 mt-1 text-sm">A-Level Candidate · Target: University of Lagos · Year 12</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/tutors" className="text-sm font-semibold bg-[#0f3460] text-white px-4 py-2 rounded-xl hover:bg-[#0a2540] transition-colors">
              Find a Tutor
            </Link>
          </div>
        </div>

        {/* Exam countdown */}
        <div className="nexora-gradient rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-semibold text-white/80">A-Level May/June 2026 — Countdown</span>
          </div>
          <div className="flex items-end gap-6">
            <div>
              <div className="text-4xl font-black">142</div>
              <div className="text-white/70 text-sm">days remaining</div>
            </div>
            <div className="flex gap-4 text-sm">
              <div><div className="text-2xl font-black">3</div><div className="text-white/70">Subjects</div></div>
              <div><div className="text-2xl font-black">6</div><div className="text-white/70">Papers</div></div>
              <div><div className="text-2xl font-black">2</div><div className="text-white/70">Tutors</div></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
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
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-slate-900">Upcoming Lessons</h2>
                <Link href="/student-dashboard/bookings" className="text-xs font-semibold text-[#0f3460] hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingLessons.map((lesson, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 nexora-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {lesson.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-sm">{lesson.tutor}</div>
                      <div className="text-xs text-slate-500">{lesson.subject}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold text-slate-800">{lesson.time}</div>
                      <div className="text-xs text-slate-500">{lesson.duration} · {lesson.mode}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent mock scores */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-slate-900">Recent Mock Scores</h2>
                <Link href="/student-dashboard/mock-exams" className="text-xs font-semibold text-[#0f3460] hover:underline flex items-center gap-1">
                  Take a mock <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentScores.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      s.grade === 'A' || s.grade === 'A*' ? 'bg-emerald-100 text-emerald-700' :
                      s.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{s.grade}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{s.exam}</div>
                      <div className="mt-1.5 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#0f3460] h-1.5 rounded-full" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-slate-900">{s.score}%</div>
                      <div className="text-xs text-slate-400">{s.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Study plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-slate-900 text-sm">Today&apos;s Study Plan</h3>
              </div>
              <div className="space-y-3">
                {studyPlan.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${item.priority === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.subject}</div>
                      <div className="text-sm text-slate-800 font-medium">{item.topic}</div>
                      <div className="text-xs text-slate-400">{item.due}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/student-dashboard/study-plan" className="mt-4 block text-xs font-semibold text-[#0f3460] hover:underline">
                View full study plan →
              </Link>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-black text-slate-900 text-sm mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Book a lesson', href: '/tutors', icon: Calendar },
                  { label: 'Take a mock exam', href: '/student-dashboard/mock-exams', icon: BookOpen },
                  { label: 'Message my tutors', href: '/student-dashboard/messages', icon: MessageSquare },
                  { label: 'View progress report', href: '/student-dashboard/progress', icon: TrendingUp },
                  { label: 'Browse resources', href: '/resources', icon: Award },
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
