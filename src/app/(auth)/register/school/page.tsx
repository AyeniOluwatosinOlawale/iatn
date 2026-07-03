'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/utils'

const CURRICULA_OPTIONS = ['Cambridge IGCSE', 'Cambridge A-Level', 'Edexcel IGCSE', 'Edexcel A-Level', 'IB Diploma', 'JAMB / UTME', 'WAEC / WASSCE', 'NECO', 'SAT', 'OxfordAQA']
const SCHOOL_TYPES = ['Private', 'Government', 'International', 'Faith-based', 'Montessori']

export default function SchoolRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    // Account
    contact_name: '',
    contact_email: '',
    password: '',
    contact_phone: '',
    // School info
    school_name: '',
    school_type: '',
    state: '',
    city: '',
    address: '',
    website: '',
    founded_year: '',
    student_count: '',
    curricula: [] as string[],
    about: '',
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const toggleCurriculum = (c: string) =>
    setForm(p => ({
      ...p,
      curricula: p.curricula.includes(c) ? p.curricula.filter(x => x !== c) : [...p.curricula, c],
    }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email: form.contact_email,
      password: form.password,
      options: {
        data: {
          full_name: form.contact_name,
          role: 'school',
          phone: form.contact_phone,
          school_name: form.school_name,
          school_type: form.school_type,
          state: form.state,
          city: form.city,
          curricula: form.curricula,
          website: form.website,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    fetch('/api/admin/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.contact_email, full_name: form.contact_name, role: 'school' }),
    }).catch(() => {})

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">School Application Submitted!</h1>
          <p className="text-slate-600 text-sm mb-2">
            Thank you for registering <span className="font-semibold">{form.school_name}</span> on Nexora Academic.
          </p>
          <p className="text-slate-500 text-sm mb-2">
            We sent a confirmation to <span className="font-semibold">{form.contact_email}</span>.
          </p>
          <p className="text-slate-500 text-sm mb-6">
            Our team will review your school profile and issue an <span className="font-semibold">Nexora School Registration Number</span> within 2–3 business days.
          </p>
          <div className="space-y-3">
            <Link href="/login" className="block bg-amber-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-amber-600 transition-colors">
              Sign In to School Dashboard
            </Link>
            <Link href="/schools" className="block text-sm text-slate-500 hover:text-slate-700">
              Browse other schools
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalSteps = 3
  const stepLabels = ['Account', 'School Info', 'Curriculum']

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 nexora-gradient rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-slate-900 text-xl tracking-tight">Nexora</span>
      </Link>

      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${step > i ? 'bg-amber-500' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="flex justify-between mb-6">
          {stepLabels.map((label, i) => (
            <span key={label} className={`text-xs font-semibold ${step > i ? 'text-amber-600' : 'text-slate-400'}`}>{label}</span>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Register Your School</h1>
          <p className="text-slate-500 text-sm mt-1">{stepLabels[step - 1]}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          {/* Step 1 — Account */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your name (admin / principal)</label>
                <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">School email address</label>
                <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="admin@yourschool.edu.ng" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone number</label>
                <input type="tel" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="+234 800 000 0000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Minimum 8 characters" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!form.contact_name || !form.contact_email || !form.password) { setError('Please fill in all required fields.'); return }
                  if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
                  setError(''); setStep(2)
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 — School info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">School name</label>
                <input value={form.school_name} onChange={e => set('school_name', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Greensprings School" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">School type</label>
                  <select value={form.school_type} onChange={e => set('school_type', e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Select type</option>
                    {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Founded year</label>
                  <input type="number" value={form.founded_year} onChange={e => set('founded_year', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 1998" min="1800" max="2025" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">City / LGA</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Lekki" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">School address</label>
                <input value={form.address} onChange={e => set('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Full street address" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website <span className="font-normal text-slate-400">(optional)</span></label>
                <input type="url" value={form.website} onChange={e => set('website', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://yourschool.edu.ng" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Number of students <span className="font-normal text-slate-400">(approx.)</span></label>
                <input type="number" value={form.student_count} onChange={e => set('student_count', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. 850" min="1" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">Back</button>
                <button type="button"
                  onClick={() => {
                    if (!form.school_name || !form.school_type || !form.state) { setError('Please fill in school name, type and state.'); return }
                    setError(''); setStep(3)
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3 — Curricula + about */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Curricula offered <span className="text-slate-400 font-normal">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {CURRICULA_OPTIONS.map(c => (
                    <button
                      key={c} type="button" onClick={() => toggleCurriculum(c)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition-all ${form.curricula.includes(c)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-slate-200 text-slate-700 hover:border-amber-400'}`}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">About your school <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea value={form.about} onChange={e => set('about', e.target.value)} rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Tell parents and students about your school — facilities, achievements, ethos..." />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>After registration:</strong> Our team will verify your school and issue an official <strong>Nexora School Registration Number</strong> (NXR-SCH-2026-XXXX) within 2–3 business days.
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">Back</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#0f3460] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
