import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import VerifyControls from './VerifyControls'

export const dynamic = 'force-dynamic'

export default async function VerificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin role
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle() as { data: { role: string } | null }

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  type TutorVerifyRow = {
    id: string
    full_name: string
    email: string
    state: string | null
    city: string | null
    is_verified: boolean
    verification_status: string
    registration_number: string | null
    created_at: string
  }

  const { data: tutors } = await serviceClient
    .from('tutors')
    .select('id, full_name, email, state, city, is_verified, verification_status, registration_number, created_at')
    .order('created_at', { ascending: false }) as { data: TutorVerifyRow[] | null }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Tutor Verifications</h1>
        <p className="text-slate-500 text-sm mb-8">Review and verify tutor registrations.</p>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Reg. No.</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(tutors ?? []).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{t.full_name}</div>
                    <div className="text-xs text-slate-500">{t.email}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{[t.city, t.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-600">{t.registration_number ?? '—'}</td>
                  <td className="px-5 py-4">
                    {t.is_verified ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">✓ Verified</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">⏳ {t.verification_status}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {new Date(t.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <VerifyControls tutorId={t.id} isVerified={t.is_verified} />
                  </td>
                </tr>
              ))}
              {(tutors ?? []).length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No tutors registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
