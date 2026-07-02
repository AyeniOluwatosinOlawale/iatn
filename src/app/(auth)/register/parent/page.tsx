'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/utils'

const CURRICULA = ['Cambridge IGCSE', 'Cambridge A-Level', 'IB Diploma', 'JAMB / UTME', 'WAEC / WASSCE', 'SAT', 'Edexcel']

export default function ParentRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
  })

  const [children, setChildren] = useState([{ name: '', year: '', curriculum: '' }])

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const addChild = () => setChildren(p => [...p, { name: '', year: '', curriculum: '' }])
  const removeChild = (i: number) => setChildren(p => p.filter((_, idx) => idx !== i))
  const setChild = (i: number, k: string, v: string) =>
    setChildren(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: 'parent',
          phone: form.phone,
          state: form.state,
          children_count: children.length,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Account Created!</h1>
          <p className="text-slate-600 text-sm mb-2">Welcome to Nexora Academic, <span className="font-semibold">{form.full_name}</span>!</p>
          <p className="text-slate-500 text-sm mb-6">
            Check <span className="font-semibold">{form.email}</span> for a confirmation link to activate your account.
          </p>
          <Link href="/login" className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
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
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900">Register as a Parent</h1>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1 ? 'Your account details' : "Your children's study profiles"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
                <input value={form.full_name} onChange={e => set('full_name', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone number</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+234 800 000 0000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <select value={form.state} onChange={e => set('state', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-slate-600">Add details about your child / children so we can match the right tutors.</p>

              {children.map((child, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3 relative">
                  {children.length > 1 && (
                    <button type="button" onClick={() => removeChild(i)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Child {i + 1}</div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Child&apos;s name</label>
                    <input value={child.name} onChange={e => setChild(i, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="First name" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Year / Level</label>
                      <select value={child.year} onChange={e => setChild(i, 'year', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        <option value="">Select</option>
                        {['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', 'SS1', 'SS2', 'SS3'].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Curriculum</label>
                      <select value={child.curriculum} onChange={e => setChild(i, 'curriculum', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        <option value="">Select</option>
                        {CURRICULA.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {children.length < 5 && (
                <button type="button" onClick={addChild}
                  className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  <Plus className="w-4 h-4" /> Add another child
                </button>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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
      </div>
    </div>
  )
}
