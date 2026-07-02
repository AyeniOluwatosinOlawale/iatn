'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Check, Loader2, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES, SUBJECTS, CURRICULA, QUALIFICATION_TYPES, TEACHING_TOOLS } from '@/lib/utils'
import type { TutorRegistrationForm } from '@/types'

const STEPS = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'Personal' },
  { num: 3, label: 'Professional' },
  { num: 4, label: 'Subjects' },
  { num: 5, label: 'Qualifications' },
  { num: 6, label: 'Cambridge Results' },
  { num: 7, label: 'Rates & Schedule' },
]

const initialForm: TutorRegistrationForm = {
  email: '', password: '', confirmPassword: '',
  full_name: '', phone: '', state: '', city: '',
  current_institution: '', years_experience: 0, teaching_mode: 'both', languages: ['English'], bio: '',
  subjects: [],
  qualifications: [],
  total_students_taught: 0, total_exam_sittings: 0, a_star_a_percentage: undefined, pass_rate: undefined, top_achievements: '',
  hourly_rate_ngn: 10000, max_class_size: 1, offers_group_classes: false, offers_trial_lesson: true,
  tools: [], availability: [],
}

export default function TutorRegistrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<TutorRegistrationForm>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof TutorRegistrationForm, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  function nextStep() { setError(''); setStep((s) => Math.min(s + 1, 7)) }
  function prevStep() { setStep((s) => Math.max(s - 1, 1)) }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: 'tutor' } },
      })

      if (authError || !authData.user) throw new Error(authError?.message || 'Registration failed')

      // Create tutor record
      const tutorPayload = {
        user_id: authData.user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        state: form.state,
        city: form.city,
        current_institution: form.current_institution,
        years_experience: form.years_experience,
        teaching_mode: form.teaching_mode,
        languages: form.languages,
        bio: form.bio,
        hourly_rate_ngn: form.hourly_rate_ngn,
        max_class_size: form.max_class_size,
        offers_group_classes: form.offers_group_classes,
        offers_trial_lesson: form.offers_trial_lesson,
        tools: form.tools,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: tutorError } = await (supabase as any).from('tutors').insert(tutorPayload)

      if (tutorError) throw new Error(tutorError.message)

      router.push('/tutor-dashboard/dashboard?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 iatn-gradient rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 text-lg">IATN</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Register as a Tutor</h1>
          <p className="text-slate-500 text-sm mt-1">Complete all 7 steps to receive your IATN registration number</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s.num ? 'iatn-gradient text-white' : step === s.num ? 'bg-[#0f3460] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div className={`text-[10px] mt-1 font-medium hidden sm:block ${step === s.num ? 'text-[#0f3460]' : 'text-slate-400'}`}>
                  {s.label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${step > s.num ? 'bg-[#0f3460]' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          {/* Step 1 — Account */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Create Your Account</h2>
              <Field label="Email address">
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="you@example.com" required />
              </Field>
              <Field label="Password">
                <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputCls} placeholder="At least 8 characters" required />
              </Field>
              <Field label="Confirm password">
                <input type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} className={inputCls} placeholder="Repeat your password" required />
              </Field>
            </div>
          )}

          {/* Step 2 — Personal */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              <Field label="Full name">
                <input type="text" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className={inputCls} placeholder="Dr. / Mr. / Mrs. Your Full Name" required />
              </Field>
              <Field label="Phone number">
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+234 800 000 0000" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="State">
                  <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls} required>
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="City">
                  <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} placeholder="e.g. Ikeja" />
                </Field>
              </div>
            </div>
          )}

          {/* Step 3 — Professional */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
              <Field label="Current school / institution (if any)">
                <input type="text" value={form.current_institution} onChange={(e) => set('current_institution', e.target.value)} className={inputCls} placeholder="e.g. Greenwood International School" />
              </Field>
              <Field label="Years of teaching experience">
                <input type="number" min="0" max="50" value={form.years_experience} onChange={(e) => set('years_experience', Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Teaching mode">
                <select value={form.teaching_mode} onChange={(e) => set('teaching_mode', e.target.value)} className={inputCls}>
                  <option value="online">Online only</option>
                  <option value="physical">Physical / In-person only</option>
                  <option value="both">Both online and physical</option>
                </select>
              </Field>
              <Field label="Professional bio">
                <textarea
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  rows={4}
                  className={inputCls + ' resize-none'}
                  placeholder="Describe your teaching experience, achievements, and teaching philosophy. This appears on your public profile."
                />
              </Field>
            </div>
          )}

          {/* Step 4 — Subjects */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Subjects & Curricula</h2>
              <p className="text-sm text-slate-500">Add each subject/curriculum combination you teach.</p>

              {form.subjects.map((sub, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => set('subjects', form.subjects.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Subject">
                      <select value={sub.subject} onChange={(e) => {
                        const updated = [...form.subjects]; updated[i] = { ...updated[i], subject: e.target.value }; set('subjects', updated)
                      }} className={inputCls}>
                        {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Curriculum">
                      <select value={sub.curriculum} onChange={(e) => {
                        const updated = [...form.subjects]; updated[i] = { ...updated[i], curriculum: e.target.value as never }; set('subjects', updated)
                      }} className={inputCls}>
                        {CURRICULA.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Level">
                      <select value={sub.proficiency} onChange={(e) => {
                        const updated = [...form.subjects]; updated[i] = { ...updated[i], proficiency: e.target.value as never }; set('subjects', updated)
                      }} className={inputCls}>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </Field>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => set('subjects', [...form.subjects, { subject: 'Mathematics', curriculum: 'igcse', proficiency: 'expert' }])}
                className="w-full border-2 border-dashed border-slate-300 hover:border-[#0f3460] text-slate-500 hover:text-[#0f3460] rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            </div>
          )}

          {/* Step 5 — Qualifications */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Qualifications</h2>
              <p className="text-sm text-slate-500">Add your academic and professional qualifications. You can upload certificates after registration.</p>

              {form.qualifications.map((q, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
                  <button type="button" onClick={() => set('qualifications', form.qualifications.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Qualification type">
                      <select value={q.qualification_type} onChange={(e) => {
                        const updated = [...form.qualifications]; updated[i] = { ...updated[i], qualification_type: e.target.value }; set('qualifications', updated)
                      }} className={inputCls}>
                        {QUALIFICATION_TYPES.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Institution">
                      <input type="text" value={q.institution} onChange={(e) => {
                        const updated = [...form.qualifications]; updated[i] = { ...updated[i], institution: e.target.value }; set('qualifications', updated)
                      }} className={inputCls} placeholder="University / College name" />
                    </Field>
                    <Field label="Field of study">
                      <input type="text" value={q.field_of_study} onChange={(e) => {
                        const updated = [...form.qualifications]; updated[i] = { ...updated[i], field_of_study: e.target.value }; set('qualifications', updated)
                      }} className={inputCls} placeholder="e.g. Mathematics Education" />
                    </Field>
                    <Field label="Year obtained">
                      <input type="number" min="1970" max={new Date().getFullYear()} value={q.year_obtained} onChange={(e) => {
                        const updated = [...form.qualifications]; updated[i] = { ...updated[i], year_obtained: Number(e.target.value) }; set('qualifications', updated)
                      }} className={inputCls} />
                    </Field>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => set('qualifications', [...form.qualifications, { qualification_type: 'bachelors', institution: '', field_of_study: '', year_obtained: 2020 }])}
                className="w-full border-2 border-dashed border-slate-300 hover:border-[#0f3460] text-slate-500 hover:text-[#0f3460] rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Add Qualification
              </button>
            </div>
          )}

          {/* Step 6 — Cambridge Metrics */}
          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Cambridge & Exam Results</h2>
              <p className="text-sm text-slate-500">These metrics appear on your public profile and are verified by IATN admin. Enter what you can — all fields optional.</p>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Total students taught">
                  <input type="number" min="0" value={form.total_students_taught} onChange={(e) => set('total_students_taught', Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="Total exam sittings">
                  <input type="number" min="0" value={form.total_exam_sittings} onChange={(e) => set('total_exam_sittings', Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="A*/A percentage (%)">
                  <input type="number" min="0" max="100" step="0.1" value={form.a_star_a_percentage || ''} onChange={(e) => set('a_star_a_percentage', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} placeholder="e.g. 85.5" />
                </Field>
                <Field label="Pass rate (%)">
                  <input type="number" min="0" max="100" step="0.1" value={form.pass_rate || ''} onChange={(e) => set('pass_rate', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} placeholder="e.g. 98.0" />
                </Field>
              </div>

              <Field label="Top student achievements (optional)">
                <textarea value={form.top_achievements || ''} onChange={(e) => set('top_achievements', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder="e.g. Student achieved Outstanding Learner Award in Cambridge IGCSE Mathematics 2023..." />
              </Field>
            </div>
          )}

          {/* Step 7 — Rates & Schedule */}
          {step === 7 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Rates & Availability</h2>

              <Field label="Hourly rate (NGN)">
                <input type="number" min="1000" step="500" value={form.hourly_rate_ngn} onChange={(e) => set('hourly_rate_ngn', Number(e.target.value))} className={inputCls} placeholder="e.g. 10000" />
                <p className="text-xs text-slate-400 mt-1">IATN takes 10–15% commission per booking</p>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Max class size">
                  <input type="number" min="1" max="20" value={form.max_class_size} onChange={(e) => set('max_class_size', Number(e.target.value))} className={inputCls} />
                </Field>
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.offers_group_classes} onChange={(e) => set('offers_group_classes', e.target.checked)} className="w-4 h-4 accent-[#0f3460]" />
                  <span className="text-sm font-medium text-slate-700">I offer group classes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.offers_trial_lesson} onChange={(e) => set('offers_trial_lesson', e.target.checked)} className="w-4 h-4 accent-[#0f3460]" />
                  <span className="text-sm font-medium text-slate-700">I offer a free/discounted trial lesson</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teaching tools I use</label>
                <div className="flex flex-wrap gap-2">
                  {TEACHING_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => set('tools', form.tools.includes(tool) ? form.tools.filter((t) => t !== tool) : [...form.tools, tool])}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                        form.tools.includes(tool) ? 'iatn-gradient text-white border-transparent' : 'border-slate-200 text-slate-600 hover:border-[#0f3460]'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                ← Back
              </button>
            ) : (
              <Link href="/register" className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                ← Back
              </Link>
            )}

            {step < 7 ? (
              <button type="button" onClick={nextStep} className="iatn-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Continue →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="iatn-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Complete Registration
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent transition'
