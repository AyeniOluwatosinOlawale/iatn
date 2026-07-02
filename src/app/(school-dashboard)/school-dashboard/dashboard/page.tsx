import Link from 'next/link'
import { Users, BookOpen, Star, TrendingUp, ChevronRight, Calendar, Bell, Award, Briefcase, Building2, CheckCircle } from 'lucide-react'

const stats = [
  { label: 'Enrolled Students', value: '1,240', icon: Users, change: '+18 this term', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Staff / Teachers', value: '87', icon: Briefcase, change: '3 vacancies', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Profile Views', value: '4,810', icon: TrendingUp, change: 'This month', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Avg. Rating', value: '4.7★', icon: Star, change: '124 reviews', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const recentApplications = [
  { name: 'Chidi Okafor', grade: 'Year 10', curriculum: 'IGCSE', date: 'Jun 30, 2026', status: 'pending' },
  { name: 'Sola Adeyemi', grade: 'Year 12', curriculum: 'A-Level', date: 'Jun 29, 2026', status: 'approved' },
  { name: 'Ngozi Eze', grade: 'Year 7', curriculum: 'IGCSE', date: 'Jun 28, 2026', status: 'pending' },
  { name: 'Emeka Nwosu', grade: 'Year 11', curriculum: 'A-Level', date: 'Jun 27, 2026', status: 'approved' },
]

const jobPostings = [
  { title: 'IGCSE Mathematics Teacher', type: 'Full-time', applications: 12, posted: '3 days ago', urgent: true },
  { title: 'A-Level Economics Tutor', type: 'Part-time', applications: 7, posted: '1 week ago', urgent: false },
  { title: 'IGCSE Sciences Lab Coordinator', type: 'Full-time', applications: 5, posted: '2 weeks ago', urgent: false },
]

const announcements = [
  { title: 'CAIE registration deadline', body: 'Cambridge IGCSE May/June 2027 — registration opens Oct 2026', type: 'info' },
  { title: 'Profile photo missing', body: 'Add a school cover image to boost your profile visibility by up to 60%', type: 'warning' },
  { title: 'Verification complete', body: 'Your NXR-SCH-2026-0045 registration number has been issued', type: 'success' },
]

export default function SchoolDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Greensprings School Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg font-bold">NXR-SCH-2026-0045</span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Verified School
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/school-dashboard/recruitment" className="text-sm font-semibold border border-[#0f3460] text-[#0f3460] px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">
              Post a Job
            </Link>
            <Link href="/schools/edit" className="text-sm font-semibold bg-[#0f3460] text-white px-4 py-2 rounded-xl hover:bg-[#0a2540] transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Verification / onboarding notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-amber-800 text-sm mb-1">Complete your school profile to attract more students</div>
            <div className="flex flex-wrap gap-4 text-xs text-amber-700">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Basic info</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Curricula listed</span>
              <span className="flex items-center gap-1 opacity-50">○ Cover photo</span>
              <span className="flex items-center gap-1 opacity-50">○ Gallery images</span>
              <span className="flex items-center gap-1 opacity-50">○ Fee structure</span>
            </div>
          </div>
          <Link href="/school-dashboard/profile" className="text-xs font-bold text-amber-800 hover:underline flex-shrink-0">Complete →</Link>
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
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent admissions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-slate-900">Recent Admissions Applications</h2>
                <Link href="/school-dashboard/admissions" className="text-xs font-semibold text-[#0f3460] hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentApplications.map((app, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    <div className="w-9 h-9 nexora-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {app.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800">{app.name}</div>
                      <div className="text-xs text-slate-400">{app.grade} · {app.curriculum}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{app.date}</div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job postings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-slate-900">Active Job Postings</h2>
                <Link href="/school-dashboard/recruitment" className="text-xs font-semibold text-[#0f3460] hover:underline flex items-center gap-1">
                  Post a job <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {jobPostings.map((job, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{job.title}</span>
                        {job.urgent && <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">Urgent</span>}
                      </div>
                      <div className="text-xs text-slate-400">{job.type} · Posted {job.posted}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-slate-900">{job.applications}</div>
                      <div className="text-xs text-slate-400">applicants</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Announcements */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-[#0f3460]" />
                <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
              </div>
              <div className="space-y-3">
                {announcements.map((a, i) => (
                  <div key={i} className={`p-3 rounded-xl text-xs ${
                    a.type === 'success' ? 'bg-emerald-50 border border-emerald-200' :
                    a.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="font-bold text-slate-800 mb-0.5">{a.title}</div>
                    <div className="text-slate-600">{a.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-black text-slate-900 text-sm mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'View school profile', href: '/schools/greensprings', icon: Building2 },
                  { label: 'Manage admissions', href: '/school-dashboard/admissions', icon: Users },
                  { label: 'Post a vacancy', href: '/school-dashboard/recruitment', icon: Briefcase },
                  { label: 'View exam results', href: '/school-dashboard/results', icon: BookOpen },
                  { label: 'View analytics', href: '/school-dashboard/analytics', icon: TrendingUp },
                  { label: 'Upcoming events', href: '/school-dashboard/events', icon: Calendar },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-[#0f3460] transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#0f3460] transition-colors">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0f3460] ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Curricula */}
            <div className="bg-[#0f3460] rounded-2xl p-5 text-white">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Curricula Offered
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['Cambridge IGCSE', 'Cambridge A-Level', 'Edexcel', 'WAEC', 'JAMB'].map((c) => (
                  <span key={c} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
