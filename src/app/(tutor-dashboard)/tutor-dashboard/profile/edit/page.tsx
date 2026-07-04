'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/utils'

const TEACHING_MODES = ['Online only', 'In-person only', 'Both online and in-person']
const LANGUAGES = ['English', 'Yoruba', 'Igbo', 'Hausa', 'French', 'Arabic']
const TOOLS = ['Google Meet', 'Zoom', 'Microsoft Teams', 'Whiteboard', 'Google Classroom', 'Khan Academy', 'Past Papers']

type Form = {
  full_name: string
  phone: string
  state: string
  city: string
  current_institution: string
  years_experience: string
  teaching_mode: string
  hourly_rate_ngn: string
  bio: string
  languages: string[]
  tools: string[]
}

export default function EditTutorProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<Form>({
    full_name: '', phone: '', state: '', city: '',
    current_institution: '', years_experience: '',
    teaching_mode: '', hourly_rate_ngn: '',
    bio: '', languages: [], tools: [],
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const meta = user.user_metadata ?? {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('tutors')
        .select('full_name, phone, state, city, current_institution, years_experience, teaching_mode, hourly_rate_ngn, bio, languages, tools')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setForm({
          full_name: data.full_name ?? meta.full_name ?? '',
          phone: data.phone ?? meta.phone ?? '',
          state: data.state ?? '',
          city: data.city ?? '',
          current_institution: data.current_institution ?? '',
          years_experience: data.years_experience?.toString() ?? '',
          teaching_mode: data.teaching_mode ?? '',
          hourly_rate_ngn: data.hourly_rate_ngn?.toString() ?? '',
          bio: data.bio ?? '',
          languages: data.languages ?? [],
          tools: data.tools ?? [],
        })
      } else {
        setForm(f => ({ ...f, full_name: meta.full_name ?? '', phone: meta.phone ?? '' }))
      }
      setLoading(false)
    }
    load()
  }, [router])

  function toggle(field: 'languages' | 'tools', value: string) {
    setForm(p => ({
      ...p,
      [field]: p[field].includes(value) ? p[field].filter(x => x !== value) : [...p[field], value],
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

      await supabase.auth.updateUser({ data: { full_name: form.full_name, phone: form.phone } })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase as any)
        .from('tutors')
        .update({
          full_name: form.full_name,
          phone: form.phone || null,
          state: form.state || null,
          city: form.city || null,
          current_institution: form.current_institution || null,
          years_experience: form.years_experience ? parseInt(form.years_experience) : null,
          teaching_mode: form.teaching_mode || null,
          hourly_rate_ngn: form.hourly_rate_ngn ? parseFloat(form.hourly_rate_ngn) : null,
          bio: form.bio || null,
          languages: form.languages,
          tools: form.tools,
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
          <Link href="/tutor-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Profile</h1>
            <p className="text-slate-500 text-sm mt-0.5">Update your tutor profile — visible to students and parents</p>
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

          {/* Personal */}
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
                  placeholder="e.g. Victoria Island" />
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Professional Details</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current institution / employer</label>
              <input value={form.current_institution} onChange={e => setForm(p => ({ ...p, current_institution: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                placeholder="e.g. University of Lagos" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Years of experience</label>
                <input type="number" min={0} max={50} value={form.years_experience} onChange={e => setForm(p => ({ ...p, years_experience: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="e.g. 5" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hourly rate (₦)</label>
                <input type="number" min={0} value={form.hourly_rate_ngn} onChange={e => setForm(p => ({ ...p, hourly_rate_ngn: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="e.g. 15000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teaching mode</label>
              <select value={form.teaching_mode} onChange={e => setForm(p => ({ ...p, teaching_mode: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                <option value="">Select mode</option>
                {TEACHING_MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] resize-none"
                placeholder="Tell students about your teaching style, experience, and strengths..." />
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(l => (
                <button key={l} type="button" onClick={() => toggle('languages', l)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.languages.includes(l)
                      ? 'bg-[#0f3460] text-white border-[#0f3460]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>{l}</button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Teaching Tools</h2>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map(t => (
                <button key={t} type="button" onClick={() => toggle('tools', t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.tools.includes(t)
                      ? 'bg-[#0f3460] text-white border-[#0f3460]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>{t}</button>
              ))}
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
