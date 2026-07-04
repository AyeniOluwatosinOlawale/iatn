'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/utils'

const CURRICULA = ['Cambridge IGCSE', 'Cambridge A-Level', 'IB Diploma', 'Edexcel', 'WAEC / WASSCE', 'NECO', 'JAMB / UTME', 'SAT', 'OxfordAQA']
const SCHOOL_TYPES = ['Primary', 'Secondary', 'Sixth Form / A-Level Centre', 'Tutorial / Prep School', 'University', 'Polytechnic', 'Vocational / Technical', 'International School']

type SchoolRow = {
  school_name: string
  email: string
  phone: string | null
  state: string
  city: string | null
  address: string | null
  school_type: string
  curricula: string[]
  founded_year: number | null
  student_count: number | null
  about: string | null
}

export default function EditSchoolProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<SchoolRow>({
    school_name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    school_type: '',
    curricula: [],
    founded_year: null,
    student_count: null,
    about: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('schools')
        .select('school_name, email, phone, state, city, address, school_type, curricula, founded_year, student_count, about')
        .eq('user_id', user.id)
        .maybeSingle() as unknown as { data: SchoolRow | null; error: unknown }

      if (data) {
        setForm({
          school_name: data.school_name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          state: data.state ?? '',
          city: data.city ?? '',
          address: data.address ?? '',
          school_type: data.school_type ?? '',
          curricula: data.curricula ?? [],
          founded_year: data.founded_year,
          student_count: data.student_count,
          about: data.about ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [router])

  function toggleCurriculum(c: string) {
    setForm(p => ({
      ...p,
      curricula: p.curricula.includes(c) ? p.curricula.filter(x => x !== c) : [...p.curricula, c],
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('schools')
        .update({
          school_name: form.school_name,
          phone: form.phone || null,
          state: form.state,
          city: form.city || null,
          address: form.address || null,
          school_type: form.school_type,
          curricula: form.curricula,
          founded_year: form.founded_year,
          student_count: form.student_count,
          about: form.about || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (updateError) throw new Error(updateError.message)
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
          <Link href="/school-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Profile</h1>
            <p className="text-slate-500 text-sm mt-0.5">Update your school&apos;s public information</p>
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

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">School name</label>
              <input value={form.school_name} onChange={e => setForm(p => ({ ...p, school_name: e.target.value }))} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Greenfield Academy" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">School type</label>
              <select value={form.school_type} onChange={e => setForm(p => ({ ...p, school_type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="">Select type</option>
                {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">About your school</label>
              <textarea value={form.about ?? ''} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Tell students and parents about your school, ethos, and strengths..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Founded year</label>
                <input type="number" value={form.founded_year ?? ''} onChange={e => setForm(p => ({ ...p, founded_year: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 1995" min={1800} max={new Date().getFullYear()} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student count</label>
                <input type="number" value={form.student_count ?? ''} onChange={e => setForm(p => ({ ...p, student_count: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 800" min={1} />
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Contact & Location</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone number</label>
              <input type="tel" value={form.phone ?? ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+234 800 000 0000" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
              <input value={form.city ?? ''} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Lekki" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
              <input value={form.address ?? ''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Full street address" />
            </div>
          </div>

          {/* Curricula */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Curricula Offered</h2>
            <div className="flex flex-wrap gap-2">
              {CURRICULA.map(c => (
                <button key={c} type="button" onClick={() => toggleCurriculum(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.curricula.includes(c)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

      </div>
    </div>
  )
}
