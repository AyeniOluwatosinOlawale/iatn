import Link from 'next/link'
import { Calendar, Clock, ChevronRight, Award, FileText, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExamSeries {
  name: string
  months: string
  note?: string
}

interface Exam {
  id: string
  name: string
  body: string
  color: string
  badge: string
  description: string
  series_per_year: number
  series: ExamSeries[]
  subjects_count: string
  grading: string
  recognized_by: string[]
  timetable_url: string
  registration_url: string
  tips: string[]
  typical_registration: string
  typical_results: string
  typical_gap: string
}

// ─── Exam data ─────────────────────────────────────────────────────────────
// Dates/months shown are TYPICAL PATTERNS, not hardcoded years.
// Students always click through to the official timetable link for exact dates.

const EXAMS: Exam[] = [
  {
    id: 'igcse',
    name: 'Cambridge IGCSE',
    body: 'Cambridge Assessment International Education (CAIE)',
    color: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-100 text-blue-800',
    description: 'The International General Certificate of Secondary Education (IGCSE) is the world\'s most popular international qualification for 14–16 year olds, taken in Year 10/11. Cambridge runs TWO series per year.',
    series_per_year: 2,
    series: [
      { name: 'Series 1 — May/June', months: 'Exams: late April – June · Results: mid-August', note: 'Main sitting. Most Nigerian students register for this series.' },
      { name: 'Series 2 — October/November', months: 'Exams: October – November · Results: January', note: 'Available for re-sits or where the school timetable suits. Not all subjects available.' },
    ],
    subjects_count: '70+',
    grading: 'A* – G (9 grades, where A* is highest)',
    recognized_by: ['UK Universities (all)', 'US Universities', 'Nigerian Universities (Direct Entry)', 'Canadian Universities', 'Australian Universities'],
    timetable_url: 'https://www.cambridgeinternational.org/exam-administration/cambridge-exams-officers-guide/phase-3-just-before-the-exams/timetables/',
    registration_url: 'https://www.cambridgeinternational.org/exam-administration/getting-started/registering-learners/',
    typical_registration: 'Registration typically opens ~6 months before exams (Oct for May/June; May for Oct/Nov). Check with your registered Cambridge school — they submit entries on your behalf.',
    typical_results: 'May/June results: mid-August. Oct/Nov results: mid-January following year.',
    typical_gap: '~4 months from last paper to results',
    tips: [
      'Start past papers at least 6 months before your exam — use the official CAIE past papers archive',
      'Study mark schemes carefully — they reveal exactly what examiners award marks for',
      'Most IGCSE papers are 1–2 hours; practise strict time management',
      'For Science subjects, Paper 6 (Alternative to Practical) tests lab skills — don\'t neglect it',
      'Cambridge publishes Examiner Reports after each series — read them for insights on common mistakes',
    ],
  },
  {
    id: 'a_level',
    name: 'Cambridge AS & A Level',
    body: 'Cambridge Assessment International Education (CAIE)',
    color: 'from-indigo-500 to-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800',
    description: 'Cambridge AS & A Levels are globally recognised university entrance qualifications taken in Year 12/13. Essential for UK, US, and top Nigerian university admissions. TWO series per year.',
    series_per_year: 2,
    series: [
      { name: 'Series 1 — May/June', months: 'Exams: April – June · Results: mid-August', note: 'Primary sitting for Year 13 (A2) and Year 12 (AS Level) students.' },
      { name: 'Series 2 — October/November', months: 'Exams: October – November · Results: January', note: 'Re-sits and Year 12 AS Level sittings. Fewer subjects available than May/June.' },
    ],
    subjects_count: '55+',
    grading: 'A* – E (A Level) · A – E (AS Level)',
    recognized_by: ['Oxford & Cambridge (direct requirement)', 'All UK Russell Group Universities', 'US Ivy League (equivalent consideration)', 'Nigerian Universities (Direct Entry to 200 Level)', 'All EU Universities'],
    timetable_url: 'https://www.cambridgeinternational.org/exam-administration/cambridge-exams-officers-guide/phase-3-just-before-the-exams/timetables/',
    registration_url: 'https://www.cambridgeinternational.org/exam-administration/getting-started/registering-learners/',
    typical_registration: 'Entries submitted by your Cambridge centre typically 3–4 months before exams. Private candidates must find a registered Cambridge centre.',
    typical_results: 'May/June results: mid-August (critical for UCAS clearing). Oct/Nov results: mid-January.',
    typical_gap: '~2–3 months from last paper to results',
    tips: [
      'Aim for a minimum of 3 A-Levels for UK university entry (4 rarely needed)',
      'AS Level results contribute to university predictions — take Year 12 exams seriously',
      'Use Cambridge past papers from 2015 onwards (syllabus updates apply)',
      'For UK UCAS applications, predicted grades are based on mock exams — push for A/A* in mocks',
      'Cambridge Examiner Reports are free online — essential reading before your exam series',
    ],
  },
  {
    id: 'edexcel',
    name: 'Pearson Edexcel International A Level',
    body: 'Pearson Qualifications (UK)',
    color: 'from-emerald-500 to-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
    description: 'Pearson Edexcel offers an alternative to Cambridge for IGCSE and A-Level qualifications. Recognised globally and offered at many international schools in Nigeria. TWO series per year.',
    series_per_year: 2,
    series: [
      { name: 'Series 1 — January', months: 'Exams: January · Results: March', note: 'Early sitting — useful for re-sits or students on accelerated programmes.' },
      { name: 'Series 2 — May/June', months: 'Exams: May – June · Results: August', note: 'Main sitting. Most students take A2 exams in this series.' },
    ],
    subjects_count: '40+',
    grading: 'A* – E (A Level) · A – E (AS Level)',
    recognized_by: ['All UK Universities', 'US Universities', 'Nigerian Universities', 'All EU Universities', 'Australian Universities'],
    timetable_url: 'https://qualifications.pearson.com/en/support/support-topics/exams/exam-timetables.html',
    registration_url: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-a-levels.html',
    typical_registration: 'Registration via your Edexcel-registered school/centre. January series: register by October. May/June: register by February.',
    typical_results: 'January series: late March. May/June series: mid-August.',
    typical_gap: '~2–3 months from exams to results',
    tips: [
      'Edexcel has a unique January sitting — useful for re-sitting modules without waiting a full year',
      'Past papers from 2013 onwards match current Edexcel IAL syllabus',
      'Edexcel and Cambridge A-Levels are equally recognised by UK universities',
      'Nigeria has many Edexcel centres — check pearson.com for registered centres near you',
    ],
  },
  {
    id: 'jamb',
    name: 'JAMB / UTME',
    body: 'Joint Admissions and Matriculation Board (JAMB)',
    color: 'from-teal-500 to-teal-700',
    badge: 'bg-teal-100 text-teal-800',
    description: 'The Unified Tertiary Matriculation Examination (UTME) is the mandatory entrance exam for all Nigerian federal and state universities. Held ONCE per year, typically March–April.',
    series_per_year: 1,
    series: [
      { name: 'Annual UTME', months: 'Exams: March – April · Results: May', note: 'CBT-based examination. Usually one sitting per year. JAMB may announce supplementary dates — check jamb.gov.ng.' },
    ],
    subjects_count: '4 subjects per candidate (incl. Use of English)',
    grading: 'Score out of 400 (each subject 0–100)',
    recognized_by: ['All Nigerian Federal Universities', 'Nigerian State Universities', 'Polytechnics', 'Colleges of Education', 'Private Universities (most)'],
    timetable_url: 'https://www.jamb.gov.ng/',
    registration_url: 'https://www.jamb.gov.ng/Registration/',
    typical_registration: 'Registration opens January – February each year. Check jamb.gov.ng for exact dates. Register early — slots fill quickly at CBT centres.',
    typical_results: 'Scores released within 2–4 weeks of your exam date. Post-UTME screening by individual universities follows in May–July.',
    typical_gap: '2–4 weeks from exam to score release',
    tips: [
      'Use English Language is compulsory for all candidates + choose 3 relevant subjects',
      'Target 250+ for competitive courses (Medicine, Law); 220+ for Engineering; 200 minimum for most',
      'Practise on the official JAMB CBT platform: jamb.gov.ng/ExamCBT',
      'Post-UTME screening is separate — check each university\'s website after UTME results',
      'JAMB change-of-course and change-of-institution portals open after results — use them if needed',
    ],
  },
  {
    id: 'waec',
    name: 'WAEC / WASSCE',
    body: 'West African Examinations Council (WAEC)',
    color: 'from-orange-500 to-orange-700',
    badge: 'bg-orange-100 text-orange-800',
    description: 'The West African Senior School Certificate Examination (WASSCE) is the primary secondary school leaving certificate in Nigeria. Held TWICE per year — school candidates (May/June) and private candidates (Aug/Sept).',
    series_per_year: 2,
    series: [
      { name: 'School Candidates (WASSCE)', months: 'Exams: May – June · Results: August', note: 'For SS3 students in registered secondary schools. This is the main sitting.' },
      { name: 'Private Candidates (GCE)', months: 'Exams: August – September · Results: November', note: 'For private/repeat candidates not in school. Same certificate, widely accepted.' },
    ],
    subjects_count: '8–9 subjects (including compulsory English & Maths)',
    grading: 'A1 (highest) · B2 · B3 · C4 · C5 · C6 · D7 · E8 · F9 (fail)',
    recognized_by: ['All Nigerian Universities (5 credits required)', 'West African Universities', 'Some UK Universities', 'NYSC Requirements', 'Professional Bodies in Nigeria'],
    timetable_url: 'https://waeconline.org.ng/',
    registration_url: 'https://waeconline.org.ng/',
    typical_registration: 'School candidates: schools register students January–February. Private/GCE candidates: register April–May. Check waeconline.org.ng for annual dates.',
    typical_results: 'School WASSCE: released August. Private GCE: released November.',
    typical_gap: '~2–3 months from last paper to results',
    tips: [
      'You need minimum 5 credits (A1–C6) including English Language and Mathematics for most university admissions',
      'Use 10 years of WAEC past questions — patterns repeat frequently',
      'Don\'t neglect practical components (Sciences, Food & Nutrition) — they carry significant marks',
      'Check waeconline.org.ng for scratch card to verify your results digitally',
      'WAEC is more internationally recognised than NECO — useful if applying abroad',
    ],
  },
  {
    id: 'neco',
    name: 'NECO / SSCE',
    body: 'National Examinations Council (NECO)',
    color: 'from-lime-600 to-green-700',
    badge: 'bg-lime-100 text-lime-800',
    description: 'The NECO SSCE is the government alternative to WAEC for Nigerian secondary school students. Held TWICE per year — June/July for school candidates and December for internal.',
    series_per_year: 2,
    series: [
      { name: 'School Candidates (SSCE Internal)', months: 'Exams: June – July · Results: September', note: 'For SS3 students in schools registered with NECO.' },
      { name: 'SSCE External (GCE)', months: 'Exams: November – December · Results: February', note: 'For private/repeat candidates. Results are equally accepted by Nigerian universities.' },
    ],
    subjects_count: '8–9 subjects',
    grading: 'A1 · B2 · B3 · C4 · C5 · C6 · D7 · E8 · F9',
    recognized_by: ['All Nigerian Federal Universities', 'Nigerian State Universities', 'Polytechnics', 'Colleges of Education', 'NYSC'],
    timetable_url: 'https://www.neco.gov.ng/',
    registration_url: 'https://www.neco.gov.ng/',
    typical_registration: 'School candidates: registered by schools (April–May). Private: July–August for external sitting. Check neco.gov.ng annually.',
    typical_results: 'Internal SSCE: September. External: February of following year.',
    typical_gap: '~2–3 months',
    tips: [
      'NECO results are accepted equally to WAEC by all Nigerian universities',
      'Some international institutions and employers prefer WAEC — consider sitting both if possible',
      'NECO timetable is usually published in April/May on neco.gov.ng',
      'Strong in core science and arts subjects; use NECO past question booklets',
    ],
  },
  {
    id: 'ib',
    name: 'IB Diploma Programme',
    body: 'International Baccalaureate Organization (IBO)',
    color: 'from-purple-500 to-purple-700',
    badge: 'bg-purple-100 text-purple-800',
    description: 'The IB Diploma is a rigorous two-year curriculum for students aged 16–19, highly regarded by universities worldwide. Examinations are held TWICE per year — May and November.',
    series_per_year: 2,
    series: [
      { name: 'May Session', months: 'Internal Assessments due: March · Exams: April–May · Results: July', note: 'Main sitting for the Northern Hemisphere. Most Nigerian IB schools use this session.' },
      { name: 'November Session', months: 'Internal Assessments due: August · Exams: October–November · Results: January', note: 'Southern Hemisphere session — available to all schools but less common in Nigeria.' },
    ],
    subjects_count: '6 subjects + Core (TOK, EE, CAS)',
    grading: '1–7 per subject (max 45 points total including bonus points)',
    recognized_by: ['Top US Universities (Ivy League)', 'UK Russell Group (all)', 'All EU Universities', 'World\'s Top 100 Universities', 'Nigerian Universities (Direct Entry)'],
    timetable_url: 'https://www.ibo.org/programmes/diploma-programme/assessment-and-exams/getting-results/',
    registration_url: 'https://www.ibo.org/programmes/diploma-programme/',
    typical_registration: 'IB students are enrolled through their school (IB World Schools) — individuals cannot self-register. The two-year DP programme starts in Year 12.',
    typical_results: 'May session: results released in early July. November session: results in January.',
    typical_gap: '~6 weeks from last exam to results',
    tips: [
      'Target 38+ points for top UK/US universities; 32+ is the minimum pass with diploma',
      'Extended Essay (EE) counts toward your final score — choose a topic you\'re passionate about',
      'CAS (Creativity, Activity, Service) is mandatory and non-negotiable for the diploma',
      'TOK (Theory of Knowledge) is unique to IB — start engaging with it from Year 1',
      'Internal Assessments (IAs) count 20–30% of your final mark — submit them on time',
    ],
  },
  {
    id: 'sat',
    name: 'SAT (Digital SAT)',
    body: 'College Board (USA)',
    color: 'from-rose-500 to-rose-700',
    badge: 'bg-rose-100 text-rose-800',
    description: 'The SAT is the primary US college admissions test, now fully digital (dSAT). Available SEVEN times per year globally. Nigerian students can sit at registered test centres in Lagos, Abuja and Port Harcourt.',
    series_per_year: 7,
    series: [
      { name: 'August', months: 'Exams: late August · Scores: mid-September', note: 'First sitting of the academic year.' },
      { name: 'October', months: 'Exams: early October · Scores: late October', note: 'Popular for college application deadlines.' },
      { name: 'November', months: 'Exams: early November · Scores: late November', note: 'Last sitting for most Early Decision deadlines.' },
      { name: 'December', months: 'Exams: early December · Scores: late December', note: 'Good for January admissions deadlines.' },
      { name: 'March', months: 'Exams: early March · Scores: late March', note: 'No School Day version in March (international only).' },
      { name: 'May', months: 'Exams: early May · Scores: mid-May', note: 'Useful for students who want results before end of school year.' },
      { name: 'June', months: 'Exams: early June · Scores: mid-June', note: 'Final sitting of the academic year.' },
    ],
    subjects_count: '2 sections: Reading & Writing + Mathematics',
    grading: '400–1600 total (200–800 per section)',
    recognized_by: ['All US Universities', 'Many Canadian Universities', 'Some UK Universities', 'Some Australian Universities'],
    timetable_url: 'https://satsuite.collegeboard.org/sat/registration/dates-deadlines',
    registration_url: 'https://satsuite.collegeboard.org/sat/registration',
    typical_registration: 'Registration closes ~4–5 weeks before each test date. Book early — Nigerian test centres (Lagos, Abuja, PH) fill up fast. Register at collegeboard.org.',
    typical_results: 'Digital SAT scores released approximately 2–3 weeks after test date.',
    typical_gap: '2–3 weeks from test to scores',
    tips: [
      'Target 1400+ for competitive US universities; 1500+ for Ivy League consideration',
      'You can take SAT multiple times — colleges often superscore (take best section scores)',
      'Khan Academy offers free official SAT prep (College Board partnership)',
      'The Digital SAT is shorter (2h 14min) and adaptive — harder questions mean you\'re doing well',
      'Book Nigerian test centre early — spaces at Lagos/Abuja/PH fill months in advance',
    ],
  },
  {
    id: 'act',
    name: 'ACT',
    body: 'ACT Inc. (USA)',
    color: 'from-amber-500 to-amber-700',
    badge: 'bg-amber-100 text-amber-800',
    description: 'The ACT is the second major US college admissions test. Accepted by all US colleges alongside the SAT. Offered internationally up to FIVE times per year. Tests English, Maths, Reading, and Science.',
    series_per_year: 5,
    series: [
      { name: 'February', months: 'Exams: February · Scores: late March', note: 'International February sitting (not available in all countries — verify at act.org).' },
      { name: 'April', months: 'Exams: April · Scores: mid-May', note: 'International sitting.' },
      { name: 'June', months: 'Exams: June · Scores: mid-July', note: 'International sitting. Last before US college application season.' },
      { name: 'October', months: 'Exams: October · Scores: mid-November', note: 'International sitting. Good for Early Decision US applications.' },
      { name: 'December', months: 'Exams: December · Scores: late December', note: 'International sitting. Last for most Regular Decision US deadlines.' },
    ],
    subjects_count: '4 sections: English, Maths, Reading, Science (+ optional Writing)',
    grading: '1–36 composite score',
    recognized_by: ['All US Universities', 'Many Canadian Universities', 'Some UK Universities'],
    timetable_url: 'https://www.act.org/content/act/en/products-and-services/the-act/registration.html',
    registration_url: 'https://www.act.org/content/act/en/products-and-services/the-act/registration.html',
    typical_registration: 'Registration closes ~4 weeks before test date. International students register at act.org. Check if a test centre is available in Nigeria — availability varies.',
    typical_results: 'Scores available approximately 2–8 weeks after test depending on the sitting.',
    typical_gap: '2–8 weeks from test to scores',
    tips: [
      'ACT includes a Science section — it tests reasoning and data analysis, not memorised facts',
      'Many students find ACT Maths easier than SAT Maths — try both and see which suits you',
      'Target 33+ for Ivy League; 28+ for most strong US universities',
      'SAT and ACT are equally accepted — take both if unsure which suits you better',
      'PrepScholar and Magoosh offer good ACT prep for Nigerian students',
    ],
  },
  {
    id: 'ielts',
    name: 'IELTS Academic',
    body: 'British Council / IDP / Cambridge Assessment English',
    color: 'from-cyan-500 to-cyan-700',
    badge: 'bg-cyan-100 text-cyan-800',
    description: 'The International English Language Testing System (IELTS) is required by most UK, Australian, and Canadian universities for international applicants whose first language is not English. Available almost EVERY WEEK in Nigeria.',
    series_per_year: 48,
    series: [
      { name: 'Paper-based IELTS', months: 'Available ~4 Saturdays per month in Lagos and Abuja', note: 'Traditional paper test with a Speaking component on a separate day.' },
      { name: 'Computer-based IELTS', months: 'Available Monday–Saturday at registered test centres', note: 'Same exam content, faster results (3–5 days). Now available at multiple Nigerian centres.' },
    ],
    subjects_count: '4 components: Listening, Reading, Writing, Speaking',
    grading: 'Band 0–9 (most universities require 6.0–7.0)',
    recognized_by: ['All UK Universities', 'All Australian Universities', 'Canadian Universities', 'US Universities (many)', 'EU Universities', 'Professional Bodies Worldwide'],
    timetable_url: 'https://www.britishcouncil.org.ng/exam/ielts',
    registration_url: 'https://www.britishcouncil.org.ng/exam/ielts/test-dates',
    typical_registration: 'Book at least 4–8 weeks in advance. British Council Nigeria (Lagos, Abuja, Port Harcourt) and IDP are the main providers.',
    typical_results: 'Paper-based: 13 days. Computer-based: 3–5 days.',
    typical_gap: '3–13 days depending on test type',
    tips: [
      'Most UK universities require IELTS 6.0–6.5 overall (with no component below 5.5–6.0)',
      'Oxford/Cambridge/Imperial typically require 7.0+ overall',
      'IELTS is valid for 2 years from your test date',
      'Computer-based IELTS gives faster results — ideal if you have a tight deadline',
      'Cambridge and British Council publish official preparation materials — use them',
    ],
  },
]

export default function ExamsPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="nexora-gradient text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Exams</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Examination Hub</h1>
          <p className="text-white/75 max-w-xl mb-4">
            IGCSE, A-Level, JAMB, WAEC, NECO, IB, SAT, ACT, IELTS — series patterns, grading, exam tips, and direct links to official timetables (always up to date).
          </p>

          {/* Live notice */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <RefreshCw className="w-3.5 h-3.5" />
            Exact dates change each year — always click &ldquo;View Official Timetable&rdquo; for confirmed {currentYear}/{currentYear + 1} dates
          </div>

          <div className="flex flex-wrap gap-2">
            {EXAMS.map((exam) => (
              <a key={exam.id} href={`#${exam.id}`}
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${exam.badge} hover:opacity-80 transition-opacity`}>
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
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-black mb-1">{exam.name}</h2>
                  <p className="text-white/75 text-sm">{exam.body}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-white/60 mb-0.5">Series per year</div>
                  <div className="text-2xl font-black">{exam.series_per_year === 48 ? '~48' : exam.series_per_year}×</div>
                  <a href={exam.timetable_url} target="_blank" rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 border border-white/30 text-white px-3 py-1.5 rounded-full transition-colors">
                    <Calendar className="w-3 h-3" /> View Official Timetable <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main */}
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
                    <div className="text-xs font-bold text-slate-900 leading-tight">{exam.grading}</div>
                    <div className="text-xs text-slate-500">Grading</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{exam.typical_gap}</div>
                    <div className="text-xs text-slate-500">Exam → Results</div>
                  </div>
                </div>

                {/* Series breakdown */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0f3460]" />
                    Exam Series &amp; Typical Schedule
                    <span className="text-xs font-normal text-slate-400">(exact dates confirmed each year by the exam board)</span>
                  </h3>
                  <div className="space-y-3">
                    {exam.series.map((s, i) => (
                      <div key={i} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900">{s.name}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">Series {i + 1}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" /> {s.months}
                        </div>
                        {s.note && <p className="text-xs text-slate-500 italic">{s.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registration info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1.5">Registration</div>
                  <p className="text-sm text-blue-800">{exam.typical_registration}</p>
                  <a href={exam.registration_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 mt-2">
                    Official Registration Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Results info */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Results</div>
                  <p className="text-sm text-emerald-800">{exam.typical_results}</p>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Exam Tips
                  </h3>
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

                {/* Official timetable CTA */}
                <a href={exam.timetable_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-sm font-bold text-white nexora-gradient py-3 rounded-xl hover:opacity-90 transition-opacity">
                  <Calendar className="w-4 h-4" /> Official Timetable <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link href={`/tutors?curriculum=${exam.id}`}
                  className="block w-full text-center text-sm font-bold text-[#0f3460] border border-[#0f3460] py-3 rounded-xl hover:bg-blue-50 transition-colors">
                  Find {exam.name} Tutors
                </Link>

                {/* Series count badge */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-[#0f3460] mb-1">{exam.series_per_year === 48 ? '~48' : exam.series_per_year}</div>
                  <div className="text-xs text-slate-500">sittings per year</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {exam.series_per_year === 1 && 'Once annually'}
                    {exam.series_per_year === 2 && 'Twice annually'}
                    {exam.series_per_year >= 5 && exam.series_per_year < 10 && 'Multiple sittings'}
                    {exam.series_per_year >= 10 && 'Flexible scheduling'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <RefreshCw className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">About Exam Dates on Nexora Academic</h3>
            <p className="text-sm text-amber-800">
              Exam boards publish exact dates each academic year — typically 6–12 months in advance. The series patterns shown above (e.g., &quot;May/June&quot; and &quot;Oct/Nov&quot; for Cambridge) remain consistent year-on-year, but specific dates shift annually. Always click <strong>View Official Timetable</strong> on each card to get the confirmed dates for the current sitting from the official exam board website.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
