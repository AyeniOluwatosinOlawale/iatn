'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Briefcase, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

type Vacancy = {
  id: string
  title: string
  department: string
  type: string
  description: string
  created_at: string
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const DEPARTMENTS = ['Teaching Staff', 'Administration', 'IT & Technology', 'Finance', 'Library', 'Sports & Extra-curricular', 'Support Staff', 'Management']

export default function SchoolRecruitmentPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    department: '',
    type: 'Full-time',
    description: '',
  })

  function resetForm() {
    setForm({ title: '', department: '', type: 'Full-time', description: '' })
    setError('')
    setSaved(false)
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.department || !form.description.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')

    await new Promise(r => setTimeout(r, 600))

    const newVacancy: Vacancy = {
      id: Date.now().toString(),
      title: form.title,
      department: form.department,
      type: form.type,
      description: form.description,
      created_at: new Date().toISOString(),
    }

    setVacancies(p => [newVacancy, ...p])
    setSaved(true)
    setSaving(false)

    setTimeout(() => {
      setShowForm(false)
      resetForm()
    }, 1200)
  }

  function removeVacancy(id: string) {
    setVacancies(p => p.filter(v => v.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/school-dashboard/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Recruitment</h1>
              <p className="text-slate-500 text-sm mt-0.5">Post and manage job vacancies at your school</p>
            </div>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Post a vacancy
          </button>
        </div>

        {/* Post vacancy form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">New Job Vacancy</h2>
              <button onClick={() => { setShowForm(false); resetForm() }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {saved && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Vacancy posted successfully!</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Mathematics Teacher (A-Level)" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employment type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Describe the role, responsibilities, qualifications required, and how to apply..." />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowForm(false); resetForm() }}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Posting…' : 'Post Vacancy'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vacancies list */}
        {vacancies.length === 0 && !showForm ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">No vacancies posted yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Post your first job vacancy to attract qualified teachers and staff to your school.
            </p>
            <button onClick={() => { resetForm(); setShowForm(true) }}
              className="inline-flex items-center gap-2 mt-5 bg-emerald-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
              <Plus className="w-4 h-4" /> Post a vacancy
            </button>
          </div>
        ) : vacancies.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-bold text-slate-900">{vacancies.length} active {vacancies.length === 1 ? 'vacancy' : 'vacancies'}</h2>
            {vacancies.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{v.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{v.department}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{v.type}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{v.description}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Posted {new Date(v.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeVacancy(v.id)} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 mt-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

      </div>
    </div>
  )
}
