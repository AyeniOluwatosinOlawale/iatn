import { redirect } from 'next/navigation'
import { GraduationCap, ArrowLeft, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function SchoolAdmissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  type SchoolRow = { id: string; school_name: string; is_verified: boolean }

  const { data: school } = await supabase
    .from('schools')
    .select('id, school_name, is_verified')
    .eq('user_id', user.id)
    .maybeSingle() as { data: SchoolRow | null }

  if (!school) redirect('/school-dashboard/dashboard')

  const tabs = [
    { label: 'All', count: 0 },
    { label: 'Pending', count: 0, icon: Clock, color: 'text-amber-600' },
    { label: 'Accepted', count: 0, icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Declined', count: 0, icon: XCircle, color: 'text-red-500' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/school-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Admissions</h1>
              <p className="text-slate-500 text-sm mt-0.5">Manage student applications to {school.school_name}</p>
            </div>
          </div>
        </div>

        {!school.is_verified && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-800">Profile under review</div>
              <div className="text-xs text-amber-700 mt-0.5">
                Applications will be visible once your school profile is verified. Please allow 24–48 hours.
              </div>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {tabs.map((tab, i) => (
              <button key={tab.label}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${i === 0 ? 'text-[#0f3460] border-b-2 border-[#0f3460] bg-slate-50' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab.label}
                <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Search applications by name or email…"
                disabled
              />
            </div>
          </div>

          {/* Empty state */}
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">No applications yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Student applications will appear here once your profile is live and verified. Make sure your profile is complete to attract students.
            </p>
            <Link href="/school-dashboard/profile/edit"
              className="inline-block mt-5 bg-emerald-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
              Complete Profile
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">How admissions work on Nexora</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Student discovers your school', desc: 'Students browsing Nexora find your school profile and click Apply.' },
              { step: '2', title: 'Application submitted', desc: 'The student fills in their details and sends an application to your school.' },
              { step: '3', title: 'You review and respond', desc: 'You accept or decline the application here. The student is notified automatically.' },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0f3460] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
