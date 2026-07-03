'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CURRICULA = ['Cambridge IGCSE', 'Cambridge A-Level', 'IB Diploma', 'JAMB / UTME', 'WAEC / WASSCE', 'SAT', 'Edexcel', 'Other']
const YEARS = ['Year 7', 'Year 8', 'Year 9', 'Year 10 (IGCSE Year 1)', 'Year 11 (IGCSE Year 2)', 'Year 12 (AS Level)', 'Year 13 (A2 Level)', 'University Applicant', 'SS1', 'SS2', 'SS3 / Finalist']

export default function StudentRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    year_group: '',
    curriculum: '',
    school_name: '',
    target_university: '',
    subjects: [] as string[],
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            role: 'student',
            year_group: form.year_group,
            curriculum: form.curriculum,
            school_name: form.school_name,
            phone: form.phone,
          },
        },
      })

      if (authError) throw new Error(`Account creation failed: ${authError.message}`)

      if (authData.user) {
        fetch('/api/profiles/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: authData.user.id, role: 'student' }),
        }).catch(() => {})
      }

      fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, full_name: form.full_name, role: 'student' }),
      }).catch(() => {})

      setStep(3)
    } catch (err) {
      const msg = err instanceof Error ? err.message : (typeof err === 'string' ? err : `Error: ${JSON.stringify(err)}`)
      setError(msg || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">You&apos;re registered!</h1>
          <p className="text-slate-600 text-sm mb-2">
            Welcome to Nexora Academic, <span className="font-semibold">{form.full_name}</span>!
          </p>
          <p className="text-slate-500 text-sm mb-6">
            We sent a confirmation email to <span className="font-semibold">{form.email}</span>. Please verify your email to activate your account.
          </p>
          <Link href="/login" className="inline-block nexora-gradient text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
            Sign In to Your Account
          </Link>
        </div>
      </div>
    )
  }

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
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-[#0f3460]' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900">Register as a Student</h1>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1 ? 'Your account details' : 'Your study profile'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
                <input value={form.full_name} onChange={e => set('full_name', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone number</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="+234 800 000 0000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                    placeholder="Minimum 8 characters" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!form.full_name || !form.email || !form.password) { setError('Please fill in all required fields.'); return }
                  if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
                  setError(''); setStep(2)
                }}
                className="w-full nexora-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year group / Level</label>
                <select value={form.year_group} onChange={e => set('year_group', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                  <option value="">Select your year</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Curriculum / Exam</label>
                <select value={form.curriculum} onChange={e => set('curriculum', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                  <option value="">Select curriculum</option>
                  {CURRICULA.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current school <span className="text-slate-400 font-normal">(optional)</span></label>
                <input value={form.school_name} onChange={e => set('school_name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="e.g. Greensprings School, Lagos" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target university <span className="text-slate-400 font-normal">(optional)</span></label>
                <input value={form.target_university} onChange={e => set('target_university', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                  placeholder="e.g. University of Lagos, Oxford" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 nexora-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Account
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#0f3460] hover:underline">Sign in</Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          Are you a tutor?{' '}
          <Link href="/register/tutor" className="font-semibold text-[#0f3460] hover:underline">Register as Tutor</Link>
        </p>
      </div>
    </div>
  )
}
