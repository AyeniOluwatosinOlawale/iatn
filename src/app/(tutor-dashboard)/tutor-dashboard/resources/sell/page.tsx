'use client'

import { useState } from 'react'
import { BookOpen, Upload, FileText, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const RESOURCE_TYPES = ['Past Questions', 'Notes & Study Guide', 'Practice Tests', 'Essay Examples', 'Video Lesson', 'Worksheet', 'Other']
const CURRICULA_OPTIONS = ['IGCSE', 'A-Level', 'Edexcel', 'IB', 'JAMB', 'WAEC/NECO', 'SAT', 'OxfordAQA']
const SUBJECTS_OPTIONS = ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'English Language', 'Computer Science', 'Geography', 'History', 'Accounting', 'Other']

type Form = {
  title: string
  description: string
  resource_type: string
  subject: string
  curriculum: string
  price_ngn: string
  file: File | null
}

export default function SellResourcesPage() {
  const [form, setForm] = useState<Form>({
    title: '', description: '', resource_type: 'Past Questions',
    subject: 'Mathematics', curriculum: 'IGCSE', price_ngn: '', file: null,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required.')
    if (!form.price_ngn || isNaN(Number(form.price_ngn))) return setError('Enter a valid price.')
    if (!form.file) return setError('Please upload a file.')

    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('resource_type', form.resource_type)
    fd.append('subject', form.subject)
    fd.append('curriculum', form.curriculum)
    fd.append('price_ngn', form.price_ngn)
    fd.append('file', form.file)

    const res = await fetch('/api/resources/upload', { method: 'POST', body: fd })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Upload failed. Please try again.')
    } else {
      setSuccess(true)
      setForm({ title: '', description: '', resource_type: 'Past Questions', subject: 'Mathematics', curriculum: 'IGCSE', price_ngn: '', file: null })
    }
    setLoading(false)
  }

  const inputCls = 'w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white'

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="flex items-center gap-3">
          <Link href="/tutor-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Sell Resources</h1>
            <p className="text-slate-500 text-sm mt-0.5">Upload study materials for students to purchase</p>
          </div>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-800 text-sm">Resource submitted!</div>
              <div className="text-xs text-emerald-700 mt-0.5">It will be reviewed and listed in the marketplace within 24 hours.</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-[#0f3460]" />
            <h2 className="font-black text-slate-900">Upload a Resource</h2>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resource Title *</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. IGCSE Mathematics Past Papers 2020–2024"
                className={inputCls} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
                <select value={form.resource_type} onChange={e => set('resource_type', e.target.value)} className={inputCls}>
                  {RESOURCE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <select value={form.subject} onChange={e => set('subject', e.target.value)} className={inputCls}>
                  {SUBJECTS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Curriculum</label>
                <select value={form.curriculum} onChange={e => set('curriculum', e.target.value)} className={inputCls}>
                  {CURRICULA_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (₦) *</label>
                <input type="number" min="0" value={form.price_ngn} onChange={e => set('price_ngn', e.target.value)}
                  placeholder="e.g. 2000" className={inputCls} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="Describe what's included in this resource..."
                className={`${inputCls} resize-none`} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">File *</label>
              <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${form.file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-[#0f3460] bg-slate-50'}`}>
                {form.file ? (
                  <>
                    <FileText className="w-8 h-8 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">{form.file.name}</span>
                    <span className="text-xs text-emerald-600">{(form.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium">Click to upload PDF, Word, or ZIP</span>
                    <span className="text-xs text-slate-400">Max 20MB</span>
                  </>
                )}
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.zip,.pptx"
                  onChange={e => set('file', e.target.files?.[0] ?? null)} />
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full nexora-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Uploading...' : 'Submit Resource'}
            </button>
          </form>
        </div>

        {/* Info card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 mb-2 text-sm">How it works</h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {[
              'Upload your resource — past papers, notes, worksheets etc.',
              'Our team reviews it within 24 hours',
              'Once approved it goes live in the Resources marketplace',
              'Students purchase it and you earn 80% of the sale price',
              'Earnings are paid out monthly to your bank account',
            ].map(item => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="text-amber-500 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
