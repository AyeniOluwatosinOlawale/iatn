import Link from 'next/link'
import { Calendar, Clock, ChevronRight, Award, FileText, AlertCircle } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const EXAMS = [
  {
    id: 'igcse',
    name: 'Cambridge IGCSE',
    body: 'Cambridge Assessment International Education (CAIE)',
    color: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-100 text-blue-800',
    description: 'The International General Certificate of Secondary Education (IGCSE) is the world\'s most popular international qualification for 14–16 year olds. Taken in Year 10/11.',
    next_series: 'May/June 2026',
    registration_deadline: 'January 2026',
    subjects_count: '70+',
    grading: 'A* – G (9 grades)',
    recognized_by: ['UK Universities', 'US Universities', 'Nigerian Universities', 'Canadian Universities'],
    key_dates: [
      { label: 'Registration opens', date: 'October 2025' },
      { label: 'Registration closes', date: 'January 2026' },
      { label: 'Exams begin', date: '28 April 2026' },
      { label: 'Results day', date: 'August 2026' },
    ],
    tips: ['Start past papers at least 6 months before the exam', 'Focus on mark schemes to understand examiner expectations', 'Practice time management — most IGCSE papers are 1–2 hours'],
  },
  {
    id: 'a_level',
    name: 'Cambridge AS & A Level',
    body: 'Cambridge Assessment International Education (CAIE)',
    color: 'from-indigo-500 to-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800',
    description: 'Cambridge A Levels are globally recognised university entrance qualifications taken in Year 12/13. Essential for UK, US, and top Nigerian university admissions.',
    next_series: 'May/June 2026',
    registration_deadline: 'January 2026',
    subjects_count: '55+',
    grading: 'A* – E (AS Level: A – E)',
    recognized_by: ['Oxford & Cambridge', 'US Ivy League', 'All UK Universities', 'Nigerian Universities'],
    key_dates: [
      { label: 'Registration opens', date: 'October 2025' },
      { label: 'Registration closes', date: 'January 2026' },
      { label: 'AS Level exams', date: 'April–May 2026' },
      { label: 'A Level exams', date: 'May–June 2026' },
      { label: 'Results day', date: 'August 2026' },
    ],
    tips: ['Choose subjects aligned with your intended university course', 'Use Cambridge past papers from 2015 onwards', 'Target 3 A-Levels minimum for UK university entry'],
  },
  {
    id: 'jamb',
    name: 'JAMB / UTME',
    body: 'Joint Admissions and Matriculation Board (JAMB)',
    color: 'from-teal-500 to-teal-700',
    badge: 'bg-teal-100 text-teal-800',
    description: 'The Unified Tertiary Matriculation Examination (UTME) is the mandatory entrance exam for all Nigerian federal and state universities. Required for all undergraduate admissions.',
    next_series: 'March/April 2026',
    registration_deadline: 'February 2026',
    subjects_count: '4 subjects per candidate',
    grading: 'Score out of 400',
    recognized_by: ['All Nigerian Federal Universities', 'Nigerian State Universities', 'Polytechnics', 'Colleges of Education'],
    key_dates: [
      { label: 'Registration opens', date: 'January 2026' },
      { label: 'Registration closes', date: 'February 2026' },
      { label: 'UTME exams', date: 'March–April 2026' },
      { label: 'Results released', date: 'May 2026' },
      { label: 'Post-UTME screening', date: 'June–July 2026' },
    ],
    tips: ['Use English Language + 3 relevant subjects', 'Aim for 250+ for competitive courses like Medicine and Law', 'Practice with JAMB CBT past questions daily'],
  },
  {
    id: 'waec',
    name: 'WAEC / WASSCE',
    body: 'West African Examinations Council (WAEC)',
    color: 'from-orange-500 to-orange-700',
    badge: 'bg-orange-100 text-orange-800',
    description: 'The West African Senior School Certificate Examination (WASSCE) is the primary secondary school leaving certificate in Nigeria, Ghana, Sierra Leone, Gambia, and Liberia.',
    next_series: 'May/June 2026',
    registration_deadline: 'March 2026',
    subjects_count: '8–9 subjects',
    grading: 'A1, B2, B3, C4, C5, C6, D7, E8, F9',
    recognized_by: ['All Nigerian Universities', 'West African Universities', 'UK Some Universities', 'NYSC Requirements'],
    key_dates: [
      { label: 'School registration', date: 'March 2026' },
      { label: 'Practical exams', date: 'April 2026' },
      { label: 'Written exams begin', date: 'May 2026' },
      { label: 'Exams end', date: 'June 2026' },
      { label: 'Results released', date: 'August 2026' },
    ],
    tips: ['Target minimum 5 credits including English and Maths', 'Use WAEC past questions (last 10 years)', 'Don\'t neglect practical components — they carry significant marks'],
  },
  {
    id: 'neco',
    name: 'NECO / SSCE',
    body: 'National Examinations Council (NECO)',
    color: 'from-lime-600 to-green-700',
    badge: 'bg-lime-100 text-lime-800',
    description: 'The National Examinations Council Senior Secondary Certificate Examination is an alternative to WAEC, conducted by the Nigerian government for public secondary school students.',
    next_series: 'June/July 2026',
    registration_deadline: 'April 2026',
    subjects_count: '8–9 subjects',
    grading: 'A1, B2, B3, C4, C5, C6, D7, E8, F9',
    recognized_by: ['All Nigerian Universities', 'Polytechnics', 'Colleges of Education', 'NYSC'],
    key_dates: [
      { label: 'Registration opens', date: 'April 2026' },
      { label: 'Exams begin', date: 'June 2026' },
      { label: 'Exams end', date: 'July 2026' },
      { label: 'Results released', date: 'September 2026' },
    ],
    tips: ['Accepted by all Nigerian universities — equivalent to WAEC', 'Strong in core science and arts subjects', 'Some prefer WAEC for international recognition'],
  },
  {
    id: 'ib',
    name: 'IB Diploma',
    body: 'International Baccalaureate Organization (IBO)',
    color: 'from-purple-500 to-purple-700',
    badge: 'bg-purple-100 text-purple-800',
    description: 'The International Baccalaureate Diploma Programme is a rigorous two-year curriculum for students aged 16–19. Highly regarded by universities worldwide.',
    next_series: 'May 2026',
    registration_deadline: 'November 2025',
    subjects_count: '6 subjects + core',
    grading: '1–7 per subject (max 45 points)',
    recognized_by: ['Top US Universities', 'UK Russell Group', 'All EU Universities', 'World\'s Top 100 Universities'],
    key_dates: [
      { label: 'Registration deadline', date: 'November 2025' },
      { label: 'Internal Assessments due', date: 'March 2026' },
      { label: 'Exams begin', date: 'April 2026' },
      { label: 'Results day', date: 'July 2026' },
    ],
    tips: ['Target 38+ points for top universities', 'Extended Essay counts — choose a topic you\'re passionate about', 'CAS (Creativity, Activity, Service) is mandatory'],
  },
  {
    id: 'sat',
    name: 'SAT',
    body: 'College Board (USA)',
    color: 'from-rose-500 to-rose-700',
    badge: 'bg-rose-100 text-rose-800',
    description: 'The SAT is the primary US college admissions test. Required or recommended by most American universities. Tests evidence-based reading, writing, and mathematics.',
    next_series: 'March 2026',
    registration_deadline: 'February 2026',
    subjects_count: '2 sections: Reading/Writing + Maths',
    grading: '400–1600 total score',
    recognized_by: ['All US Universities', 'Many Canadian Universities', 'Some UK Universities'],
    key_dates: [
      { label: 'March SAT', date: '14 March 2026' },
      { label: 'May SAT', date: '2 May 2026' },
      { label: 'June SAT', date: '6 June 2026' },
      { label: 'August SAT', date: '29 August 2026' },
    ],
    tips: ['Target 1400+ for competitive US universities', 'You can take SAT multiple times — colleges often superscore', 'Khan Academy offers free official SAT prep'],
  },
]

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="iatn-gradient text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Exams</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Examination Hub</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Everything you need to know about IGCSE, A-Level, JAMB, WAEC, NECO, IB, SAT and more — key dates, entry requirements, grading, and exam tips.
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMS.map((exam) => (
              <a key={exam.id} href={`#${exam.id}`} className={`text-xs font-bold px-3 py-1.5 rounded-full ${exam.badge} hover:opacity-80 transition-opacity`}>
                {exam.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Exam cards */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {EXAMS.map((exam) => (
          <div key={exam.id} id={exam.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className={`bg-gradient-to-r ${exam.color} p-6 text-white`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black mb-1">{exam.name}</h2>
                  <p className="text-white/75 text-sm">{exam.body}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-white/60 mb-0.5">Next series</div>
                  <div className="font-bold text-sm">{exam.next_series}</div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main info */}
              <div className="lg:col-span-2 space-y-5">
                <p className="text-slate-700 text-sm leading-relaxed">{exam.description}</p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <FileText className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{exam.subjects_count}</div>
                    <div className="text-xs text-slate-500">Subjects</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Award className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{exam.grading}</div>
                    <div className="text-xs text-slate-500">Grading</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{exam.registration_deadline}</div>
                    <div className="text-xs text-slate-500">Reg. deadline</div>
                  </div>
                </div>

                {/* Key dates */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3">Key Dates 2026</h3>
                  <div className="space-y-2">
                    {exam.key_dates.map((d) => (
                      <div key={d.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {d.label}
                        </div>
                        <span className="font-semibold text-slate-900">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3">Exam Tips</h3>
                  <div className="space-y-2">
                    {exam.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Recognised by */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">Recognised by</h3>
                  <div className="space-y-2">
                    {exam.recognized_by.map((r) => (
                      <div key={r} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/tutors?curriculum=${exam.id}`}
                  className="block w-full text-center text-sm font-bold text-white iatn-gradient py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Find {exam.name} Tutors
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
