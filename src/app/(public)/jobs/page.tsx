'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Link from 'next/link'
import { MapPin, Clock, Briefcase, ChevronRight, Search, BookOpen, GraduationCap, Users } from 'lucide-react'

const JOBS = [
  {
    id: '1',
    title: 'IGCSE Mathematics Teacher',
    school: 'Greensprings School',
    location: 'Lekki, Lagos',
    type: 'Full-time',
    curriculum: ['Cambridge IGCSE', 'A-Level'],
    subjects: ['Mathematics', 'Further Mathematics'],
    posted: '2 days ago',
    deadline: '31 July 2026',
    description: 'We are seeking an experienced IGCSE Mathematics teacher to join our secondary school faculty. The ideal candidate will have a strong background in Cambridge curriculum and a passion for student achievement.',
    requirements: ['B.Sc or B.Ed in Mathematics or related field', 'Minimum 3 years teaching IGCSE/A-Level', 'TRCN registration preferred', 'Excellent communication skills'],
    badge: 'Urgent',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: '2',
    title: 'IB Physics & Chemistry Tutor',
    school: 'Corona Secondary School',
    location: 'Victoria Island, Lagos',
    type: 'Part-time',
    curriculum: ['IB Diploma'],
    subjects: ['Physics', 'Chemistry'],
    posted: '5 days ago',
    deadline: '15 August 2026',
    description: 'Corona Secondary School is looking for a qualified IB Physics and Chemistry tutor for after-school support sessions. Must be available weekday evenings and Saturdays.',
    requirements: ['Degree in Physics, Chemistry or Engineering', 'Experience with IB curriculum', 'Ability to teach both HL and SL levels', 'Patient and student-centred approach'],
    badge: 'New',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: '3',
    title: 'A-Level Economics & Business Teacher',
    school: 'Whiteplains British School',
    location: 'Abuja, FCT',
    type: 'Full-time',
    curriculum: ['Cambridge A-Level', 'Edexcel'],
    subjects: ['Economics', 'Business Studies'],
    posted: '1 week ago',
    deadline: '20 August 2026',
    description: 'Whiteplains British School seeks a dynamic A-Level Economics and Business Studies teacher. Experience with both Cambridge and Edexcel syllabi is a plus.',
    requirements: ['Degree in Economics, Business or related', 'A-Level teaching experience (3+ years)', 'Strong analytical and presentation skills', 'QTS or PGDE an advantage'],
    badge: null,
    badgeColor: '',
  },
  {
    id: '4',
    title: 'SAT / ACT Prep Instructor',
    school: 'EduPath Prep Centre',
    location: 'Ikeja, Lagos',
    type: 'Contract',
    curriculum: ['SAT', 'ACT'],
    subjects: ['Mathematics', 'English / Reading'],
    posted: '3 days ago',
    deadline: '10 August 2026',
    description: 'EduPath is expanding its US university admissions prep programme and needs an experienced SAT/ACT instructor. Must have a proven track record of improving student scores.',
    requirements: ['Personal SAT score 1400+ or ACT 30+', 'Experience teaching test prep (2+ years)', 'Familiarity with College Board materials', 'Engaging and motivating teaching style'],
    badge: 'Featured',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: '5',
    title: 'IGCSE English Language & Literature Teacher',
    school: 'Chrisland College',
    location: 'Ogba, Lagos',
    type: 'Full-time',
    curriculum: ['Cambridge IGCSE'],
    subjects: ['English Language', 'English Literature'],
    posted: '4 days ago',
    deadline: '5 August 2026',
    description: 'Chrisland College requires a passionate English teacher to deliver IGCSE English Language and Literature to Year 10 and Year 11 students.',
    requirements: ['B.A or B.Ed in English Language/Literature', 'Experience with Cambridge IGCSE syllabus', 'Excellent written and spoken English', 'Ability to inspire a love of reading'],
    badge: null,
    badgeColor: '',
  },
  {
    id: '6',
    title: 'Biology & Chemistry IGCSE Teacher',
    school: 'Dowen College',
    location: 'Lekki, Lagos',
    type: 'Full-time',
    curriculum: ['Cambridge IGCSE', 'A-Level'],
    subjects: ['Biology', 'Chemistry'],
    posted: '6 days ago',
    deadline: '28 July 2026',
    description: 'Dowen College is hiring a science teacher for IGCSE Biology and Chemistry. The role includes practical lab sessions and exam preparation support.',
    requirements: ['B.Sc in Biology, Chemistry or Biochemistry', 'Minimum 2 years IGCSE teaching', 'Lab management experience preferred', 'TRCN registered'],
    badge: 'Urgent',
    badgeColor: 'bg-red-100 text-red-700',
  },
]

const CURRICULA = ['All', 'Cambridge IGCSE', 'A-Level', 'Edexcel', 'IB Diploma', 'SAT', 'ACT']
const TYPES = ['All', 'Full-time', 'Part-time', 'Contract']
const LOCATIONS = ['All', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [curriculum, setCurriculum] = useState('All')
  const [type, setType] = useState('All')
  const [location, setLocation] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = JOBS.filter(job => {
    const matchSearch = !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.school.toLowerCase().includes(search.toLowerCase()) ||
      job.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchCurriculum = curriculum === 'All' || job.curriculum.includes(curriculum)
    const matchType = type === 'All' || job.type === type
    const matchLocation = location === 'All' || job.location.toLowerCase().includes(location.toLowerCase())
    return matchSearch && matchCurriculum && matchType && matchLocation
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="nexora-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-3 py-1 rounded-full mb-4">
              <Briefcase className="w-4 h-4" />
              Teaching Job Board
            </div>
            <h1 className="text-4xl font-black mb-3">Find Teaching Positions</h1>
            <p className="text-white/80 text-lg">
              Connect with top international curriculum schools across Nigeria. IGCSE, A-Level, IB, SAT and more.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div><div className="text-2xl font-black">{JOBS.length}+</div><div className="text-white/70 text-sm">Open Roles</div></div>
            <div><div className="text-2xl font-black">50+</div><div className="text-white/70 text-sm">Partner Schools</div></div>
            <div><div className="text-2xl font-black">6</div><div className="text-white/70 text-sm">States</div></div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, school or subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select value={curriculum} onChange={e => setCurriculum(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {CURRICULA.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={location} onChange={e => setLocation(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-5 text-sm text-gray-500">{filtered.length} position{filtered.length !== 1 ? 's' : ''} found</div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No jobs match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Job Header */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                        {job.badge && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${job.badgeColor}`}>{job.badge}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-blue-700 font-medium text-sm mb-3">
                        <GraduationCap className="w-4 h-4" />
                        {job.school}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.type}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{job.curriculum.join(', ')}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-400">Posted {job.posted}</div>
                      <div className="text-red-600 font-medium mt-1">Deadline: {job.deadline}</div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.subjects.map(s => (
                      <span key={s} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedId === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                    <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-1"><Users className="w-4 h-4" /> Requirements</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((r, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 pb-5 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    {expandedId === job.id ? 'Show less' : 'View details'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedId === job.id ? 'rotate-90' : ''}`} />
                  </button>
                  <Link
                    href="/register?role=tutor"
                    className="bg-[#0f3460] hover:bg-[#16213e] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post a Job CTA */}
        <div className="mt-12 nexora-gradient rounded-2xl p-8 text-white text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-black mb-2">Are You a School or Employer?</h3>
          <p className="text-white/80 mb-6">Post your teaching vacancies and reach hundreds of qualified, verified educators across Nigeria.</p>
          <Link
            href="/register?role=school"
            className="inline-block bg-white text-[#0f3460] font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
