'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/utils'

const CURRICULA = ['Cambridge IGCSE', 'Cambridge A-Level', 'IB Diploma', 'Edexcel', 'WAEC / WASSCE', 'NECO', 'JAMB / UTME', 'SAT', 'OxfordAQA']
const YEAR_GROUPS = ['Year 7', 'Year 8', 'Year 9', 'Year 10 (IGCSE Year 1)', 'Year 11 (IGCSE Year 2)', 'Lower Sixth (AS)', 'Upper Sixth (A2)', 'University Year 1', 'University Year 2', 'University Year 3+', 'Graduate']

type Form = {
  full_name: string
  phone: string
  state: string
  city: string
  current_school: string
  year_group: string
  target_curricula: string[]
}

export default function EditStudentProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<Form>({
    full_name: '',
    phone: '',
    state: '',
    city: '',
    current_school: '',
    year_group: '',
    target_curricula: [],
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const meta = user.user_metadata ?? {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('students')
        .select('full_name, phone, state, city, current_school, year_group, target_curricula')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setForm({
          full_name: data.full_name ?? meta.full_name ?? '',
          phone: data.phone ?? meta.phone ?? '',
          state: data.state ?? '',
          city: data.city ?? '',
          current_school: data.current_school ?? '',
          year_group: data.year_group ?? '',
          target_curricula: data.target_curricula ?? [],
        })
      } else {
        setForm(f => ({ ...f, full_name: meta.full_name ?? '', phone: meta.phone ?? '' }))
      }
      setLoading(false)
    }
    load()
  }, [router])

  function toggleCurriculum(c: string) {
    setForm(p => ({
      ...p,
      target_curricula: p.target_curricula.includes(c)
        ? p.target_curricula.filter(x => x !== c)
        : [...p.target_curricula, c],
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update auth metadata
      await supabase.auth.updateUser({ data: { full_name: form.full_name, phone: form.phone } })

      // Update students table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase as any)
        .from('students')
        .update({
          full_name: form.full_name,
          phone: form.phone || null,
          state: form.state || null,
          city: form.city || null,
          current_school: form.current_school || null,
          year_group: form.year_group || null,
          target_curricula: form.target_curricula,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (dbErr) throw new Error(dbErr.message)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="flex items-center gap-3">
          <Link href="/student-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Profile</h1>
            <p className="text-slate-500 text-sm mt-0.5">Update your personal information</p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Profile saved successfully.</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Personal Information</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
              <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                placeholder="Your full name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                placeholder="+234 800 000 0000" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="e.g. Lekki" />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Academic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current school</label>
              <input value={form.current_school} onChange={e => setForm(p => ({ ...p, current_school: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                placeholder="Name of your school" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year group</label>
              <select value={form.year_group} onChange={e => setForm(p => ({ ...p, year_group: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                <option value="">Select year group</option>
                {YEAR_GROUPS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target curricula</label>
              <div className="flex flex-wrap gap-2">
                {CURRICULA.map(c => (
                  <button key={c} type="button" onClick={() => toggleCurriculum(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.target_curricula.includes(c)
                        ? 'bg-[#0f3460] text-white border-[#0f3460]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-[#0f3460] hover:bg-[#16213e] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

      </div>
    </div>
  )
}
