'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen, Download, FileText, ChevronRight, Search, Star,
  ExternalLink, Upload, Filter, X, Globe, Award, Play,
  Calculator, FlaskConical, Atom, Leaf, TrendingUp, Briefcase,
  Monitor, BookMarked, Languages, Map, Clock,
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DualVideoHero from '@/components/shared/DualVideoHero'

// ─── Types ──────────────────────────────────────────────────────────────────

type ResourceType = 'Past Papers' | 'Syllabuses' | 'Study Notes' | 'Video Lessons' | 'Practice Tests' | 'Revision Guides'
type CurriculumKey = 'A-Level' | 'IGCSE' | 'JAMB' | 'WAEC' | 'NECO' | 'IB' | 'SAT' | 'Edexcel'

interface Resource {
  id: string
  title: string
  type: ResourceType
  curriculum: CurriculumKey
  subject: string
  source: string
  source_url: string
  description: string
  is_official: boolean
  is_free: boolean
  badge: string
  icon: React.ElementType
}

// ─── Data ────────────────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  // Cambridge A-Level Official
  {
    id: '1', title: 'Cambridge A-Level Mathematics — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'A-Level', subject: 'Mathematics', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/',
    description: 'Official Cambridge A-Level Mathematics (9709) syllabus, specimen papers, and mark schemes. Free from Cambridge International.',
    is_official: true, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Calculator,
  },
  {
    id: '2', title: 'Cambridge A-Level Physics — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'A-Level', subject: 'Physics', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-physics-9702/',
    description: 'Official Cambridge A-Level Physics (9702) syllabus, specimen papers, practical guidance, and mark schemes.',
    is_official: true, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Atom,
  },
  {
    id: '3', title: 'Cambridge A-Level Chemistry — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'A-Level', subject: 'Chemistry', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-chemistry-9701/',
    description: 'Official Cambridge A-Level Chemistry (9701) syllabus with practical coursework guide and specimen assessment materials.',
    is_official: true, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: FlaskConical,
  },
  {
    id: '4', title: 'Cambridge A-Level Biology — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'A-Level', subject: 'Biology', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-biology-9700/',
    description: 'Official Cambridge A-Level Biology (9700) syllabus, specimen papers, and practical assessment details.',
    is_official: true, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Leaf,
  },
  {
    id: '5', title: 'Cambridge A-Level Economics — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'A-Level', subject: 'Economics', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-economics-9708/',
    description: 'Official Cambridge A-Level Economics (9708) syllabus with full specimen assessment materials.',
    is_official: true, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: TrendingUp,
  },
  {
    id: '6', title: 'Cambridge A-Level Computer Science — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'A-Level', subject: 'Computer Science', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-computer-science-9618/',
    description: 'Official Cambridge A-Level Computer Science (9618) syllabus including pre-release materials and specimen papers.',
    is_official: true, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Monitor,
  },
  // Cambridge IGCSE Official
  {
    id: '7', title: 'Cambridge IGCSE Mathematics — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'IGCSE', subject: 'Mathematics', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/',
    description: 'Official Cambridge IGCSE Mathematics (0580) syllabus, specimen papers for Core and Extended tiers, and mark schemes.',
    is_official: true, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Calculator,
  },
  {
    id: '8', title: 'Cambridge IGCSE Physics — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'IGCSE', subject: 'Physics', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-physics-0625/',
    description: 'Official Cambridge IGCSE Physics (0625) syllabus with specimen papers and practical paper guidance.',
    is_official: true, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Atom,
  },
  {
    id: '9', title: 'Cambridge IGCSE Chemistry — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'IGCSE', subject: 'Chemistry', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-chemistry-0620/',
    description: 'Official Cambridge IGCSE Chemistry (0620) syllabus, specimen papers, and practical booklet.',
    is_official: true, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: FlaskConical,
  },
  {
    id: '10', title: 'Cambridge IGCSE Biology — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'IGCSE', subject: 'Biology', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-biology-0610/',
    description: 'Official Cambridge IGCSE Biology (0610) syllabus with specimen assessment materials and practical assessment.',
    is_official: true, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Leaf,
  },
  {
    id: '11', title: 'Cambridge IGCSE English Language — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'IGCSE', subject: 'English Language', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-english-first-language-0500/',
    description: 'Official Cambridge IGCSE English First Language (0500) syllabus including directed writing and composition guidance.',
    is_official: true, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Languages,
  },
  {
    id: '12', title: 'Cambridge IGCSE Geography — Syllabus & Specimen Papers', type: 'Syllabuses',
    curriculum: 'IGCSE', subject: 'Geography', source: 'Cambridge International (Official)',
    source_url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-geography-0460/',
    description: 'Official Cambridge IGCSE Geography (0460) syllabus with coursework guidance and specimen papers.',
    is_official: true, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Map,
  },
  // PapaCambridge — Past Papers
  {
    id: '13', title: 'A-Level Mathematics Past Papers (2000–2024)', type: 'Past Papers',
    curriculum: 'A-Level', subject: 'Mathematics', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/a-as-level/mathematics-9709/',
    description: 'Full archive of Cambridge A-Level Mathematics past papers and mark schemes from 2000 to 2024. Free access.',
    is_official: false, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Calculator,
  },
  {
    id: '14', title: 'A-Level Physics Past Papers (2000–2024)', type: 'Past Papers',
    curriculum: 'A-Level', subject: 'Physics', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/a-as-level/physics-9702/',
    description: 'Complete Cambridge A-Level Physics past paper archive including Paper 1, 2, 3, 4 and 5 with mark schemes.',
    is_official: false, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Atom,
  },
  {
    id: '15', title: 'A-Level Chemistry Past Papers (2000–2024)', type: 'Past Papers',
    curriculum: 'A-Level', subject: 'Chemistry', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/a-as-level/chemistry-9701/',
    description: 'Full Cambridge A-Level Chemistry past paper archive with mark schemes and examiner reports.',
    is_official: false, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: FlaskConical,
  },
  {
    id: '16', title: 'IGCSE Mathematics Past Papers (2003–2024)', type: 'Past Papers',
    curriculum: 'IGCSE', subject: 'Mathematics', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/igcse/mathematics-0580/',
    description: 'Extensive IGCSE Mathematics (0580) past paper collection covering Core and Extended tiers with full mark schemes.',
    is_official: false, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Calculator,
  },
  {
    id: '17', title: 'IGCSE Physics Past Papers (2003–2024)', type: 'Past Papers',
    curriculum: 'IGCSE', subject: 'Physics', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/igcse/physics-0625/',
    description: 'Full IGCSE Physics (0625) past paper archive with Papers 1, 2, 3, 4, 5, 6 and mark schemes.',
    is_official: false, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Atom,
  },
  {
    id: '18', title: 'IGCSE Chemistry Past Papers (2003–2024)', type: 'Past Papers',
    curriculum: 'IGCSE', subject: 'Chemistry', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/igcse/chemistry-0620/',
    description: 'Complete IGCSE Chemistry (0620) past paper collection with mark schemes and examiner notes.',
    is_official: false, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: FlaskConical,
  },
  {
    id: '19', title: 'IGCSE Biology Past Papers (2003–2024)', type: 'Past Papers',
    curriculum: 'IGCSE', subject: 'Biology', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/igcse/biology-0610/',
    description: 'IGCSE Biology (0610) past papers covering all three papers with mark schemes.',
    is_official: false, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Leaf,
  },
  // Video Resources
  {
    id: '20', title: 'A-Level Mathematics Video Lessons (Pure, Mech, Stats)', type: 'Video Lessons',
    curriculum: 'A-Level', subject: 'Mathematics', source: 'ExamSolutions (YouTube)',
    source_url: 'https://www.youtube.com/@ExamSolutions_Maths',
    description: 'Thousands of free A-Level Maths tutorial videos covering Pure Mathematics, Mechanics, and Statistics. Highly rated by Nigerian A-Level students.',
    is_official: false, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Play,
  },
  {
    id: '21', title: 'IGCSE & A-Level Science Video Lessons', type: 'Video Lessons',
    curriculum: 'IGCSE', subject: 'Physics', source: 'Science With Hazel (YouTube)',
    source_url: 'https://www.youtube.com/@ScienceWithHazel',
    description: 'Free IGCSE and A-Level Physics and Chemistry video lessons with worked exam questions and exam technique tips.',
    is_official: false, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: Play,
  },
  {
    id: '22', title: 'JAMB / UTME Past Questions (All Subjects 2000–2024)', type: 'Past Papers',
    curriculum: 'JAMB', subject: 'All Subjects', source: 'JAMB Official Portal',
    source_url: 'https://www.jamb.gov.ng/',
    description: 'Official JAMB CBT Practice portal. Free access to UTME past questions for English, Mathematics, Physics, Chemistry, Biology, Economics, and more.',
    is_official: true, is_free: true, badge: 'bg-teal-100 text-teal-800', icon: BookMarked,
  },
  {
    id: '23', title: 'WAEC Past Questions & Answers (2010–2024)', type: 'Past Papers',
    curriculum: 'WAEC', subject: 'All Subjects', source: 'WAEC Official',
    source_url: 'https://waeconline.org.ng/',
    description: 'Official WAEC portal for checking results and accessing past questions. Covers all WASSCE subjects with grade distributions.',
    is_official: true, is_free: true, badge: 'bg-orange-100 text-orange-800', icon: BookMarked,
  },
  {
    id: '24', title: 'IB Diploma — Subject Guides & Past Papers', type: 'Syllabuses',
    curriculum: 'IB', subject: 'All Subjects', source: 'IBO Official',
    source_url: 'https://www.ibo.org/programmes/diploma-programme/curriculum/',
    description: 'Official IB Diploma Programme subject guides, assessment criteria, and sample materials across all six subject groups.',
    is_official: true, is_free: true, badge: 'bg-purple-100 text-purple-800', icon: Globe,
  },
  {
    id: '25', title: 'SAT Official Practice Tests (8 Full Tests)', type: 'Practice Tests',
    curriculum: 'SAT', subject: 'Mathematics & Reading/Writing', source: 'College Board (Official)',
    source_url: 'https://satsuite.collegeboard.org/digital/digital-practice-preparation/practice-tests',
    description: 'Eight official full-length Digital SAT practice tests with answer keys and score reports. Completely free from College Board.',
    is_official: true, is_free: true, badge: 'bg-rose-100 text-rose-800', icon: Award,
  },
  {
    id: '26', title: 'SAT Prep — Khan Academy (Free Official Course)', type: 'Study Notes',
    curriculum: 'SAT', subject: 'Mathematics & Reading/Writing', source: 'Khan Academy',
    source_url: 'https://www.khanacademy.org/SAT',
    description: 'Official College Board–backed SAT prep on Khan Academy. Personalized practice, video lessons, full tests. Completely free.',
    is_official: true, is_free: true, badge: 'bg-rose-100 text-rose-800', icon: Play,
  },
  {
    id: '27', title: 'Edexcel A-Level Past Papers & Mark Schemes', type: 'Past Papers',
    curriculum: 'Edexcel', subject: 'All Subjects', source: 'Pearson Qualifications (Official)',
    source_url: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels.html',
    description: 'Official Pearson Edexcel A-Level past papers, mark schemes, and examiner reports across all subjects.',
    is_official: true, is_free: true, badge: 'bg-emerald-100 text-emerald-800', icon: FileText,
  },
  {
    id: '28', title: 'CIE Notes — A-Level & IGCSE Revision Notes', type: 'Revision Guides',
    curriculum: 'A-Level', subject: 'All Subjects', source: 'CIE Notes',
    source_url: 'https://www.cienotes.com/',
    description: 'Free, student-written Cambridge A-Level and IGCSE revision notes covering all major subjects. Popular among Nigerian international school students.',
    is_official: false, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: BookOpen,
  },
  {
    id: '29', title: 'A-Level & IGCSE Topical Past Papers', type: 'Past Papers',
    curriculum: 'A-Level', subject: 'All Subjects', source: 'SaveMyExams',
    source_url: 'https://www.savemyexams.com/',
    description: 'Topic-by-topic past paper questions for Cambridge IGCSE and A-Levels, with model answers and worked solutions. Free tier available.',
    is_official: false, is_free: false, badge: 'bg-indigo-100 text-indigo-800', icon: FileText,
  },
  {
    id: '30', title: 'Business Studies A-Level Past Papers (9609)', type: 'Past Papers',
    curriculum: 'A-Level', subject: 'Business Studies', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/a-as-level/business-9609/',
    description: 'Cambridge A-Level Business Studies (9609) past papers with mark schemes and examiner reports.',
    is_official: false, is_free: true, badge: 'bg-indigo-100 text-indigo-800', icon: Briefcase,
  },
  {
    id: '31', title: 'IGCSE Economics Past Papers (0455)', type: 'Past Papers',
    curriculum: 'IGCSE', subject: 'Economics', source: 'PapaCambridge',
    source_url: 'https://pastpapers.papacambridge.com/cambridge-international-examinations/igcse/economics-0455/',
    description: 'Full IGCSE Economics (0455) past paper archive with mark schemes.',
    is_official: false, is_free: true, badge: 'bg-blue-100 text-blue-800', icon: TrendingUp,
  },
  {
    id: '32', title: 'NECO Past Questions (2010–2024)', type: 'Past Papers',
    curriculum: 'NECO', subject: 'All Subjects', source: 'NECO Official',
    source_url: 'https://www.neco.gov.ng/',
    description: 'Official NECO portal for results checking and exam information. Access past question guidance and timetables.',
    is_official: true, is_free: true, badge: 'bg-lime-100 text-lime-800', icon: BookMarked,
  },
]

const RESOURCE_TYPES: ResourceType[] = ['Past Papers', 'Syllabuses', 'Study Notes', 'Video Lessons', 'Practice Tests', 'Revision Guides']
const CURRICULA: CurriculumKey[] = ['A-Level', 'IGCSE', 'JAMB', 'WAEC', 'NECO', 'IB', 'SAT', 'Edexcel']
const SUBJECTS_LIST = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science', 'English Language', 'Geography', 'All Subjects']

const SOURCE_COLORS: Record<string, string> = {
  'Cambridge International (Official)': 'bg-blue-50 text-blue-700 border-blue-200',
  'PapaCambridge': 'bg-slate-50 text-slate-600 border-slate-200',
  'JAMB Official Portal': 'bg-teal-50 text-teal-700 border-teal-200',
  'WAEC Official': 'bg-orange-50 text-orange-700 border-orange-200',
  'IBO Official': 'bg-purple-50 text-purple-700 border-purple-200',
  'College Board (Official)': 'bg-rose-50 text-rose-700 border-rose-200',
  'Khan Academy': 'bg-green-50 text-green-700 border-green-200',
  'Pearson Qualifications (Official)': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'CIE Notes': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'SaveMyExams': 'bg-amber-50 text-amber-700 border-amber-200',
  'ExamSolutions (YouTube)': 'bg-red-50 text-red-700 border-red-200',
  'Science With Hazel (YouTube)': 'bg-red-50 text-red-700 border-red-200',
  'NECO Official': 'bg-lime-50 text-lime-700 border-lime-200',
}

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  'Past Papers': FileText,
  'Syllabuses': BookOpen,
  'Study Notes': BookMarked,
  'Video Lessons': Play,
  'Practice Tests': Award,
  'Revision Guides': Star,
}

export default function ResourcesPage() {
  const [query, setQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([])
  const [selectedCurricula, setSelectedCurricula] = useState<CurriculumKey[]>([])
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [freeOnly, setFreeOnly] = useState(false)
  const [officialOnly, setOfficialOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const toggleType = (t: ResourceType) =>
    setSelectedTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])
  const toggleCurriculum = (c: CurriculumKey) =>
    setSelectedCurricula(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])

  const filtered = useMemo(() => {
    return RESOURCES.filter(r => {
      if (query && !r.title.toLowerCase().includes(query.toLowerCase()) &&
        !r.subject.toLowerCase().includes(query.toLowerCase()) &&
        !r.description.toLowerCase().includes(query.toLowerCase())) return false
      if (selectedTypes.length && !selectedTypes.includes(r.type)) return false
      if (selectedCurricula.length && !selectedCurricula.includes(r.curriculum)) return false
      if (selectedSubject !== 'All' && r.subject !== selectedSubject && r.subject !== 'All Subjects') return false
      if (freeOnly && !r.is_free) return false
      if (officialOnly && !r.is_official) return false
      return true
    })
  }, [query, selectedTypes, selectedCurricula, selectedSubject, freeOnly, officialOnly])

  const hasFilters = query || selectedTypes.length || selectedCurricula.length || selectedSubject !== 'All' || freeOnly || officialOnly

  const clearAll = () => {
    setQuery('')
    setSelectedTypes([])
    setSelectedCurricula([])
    setSelectedSubject('All')
    setFreeOnly(false)
    setOfficialOnly(false)
  }

  // Counts by curriculum
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    RESOURCES.forEach(r => { c[r.curriculum] = (c[r.curriculum] || 0) + 1 })
    return c
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <DualVideoHero
        leftVideo="https://videos.pexels.com/video-files/4116598/4116598-hd_1920_1080_25fps.mp4"
        rightVideo="https://videos.pexels.com/video-files/7988010/7988010-hd_1920_1080_25fps.mp4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Resources</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Study Resources</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Official syllabuses, past papers, mark schemes, video lessons, and revision guides for IGCSE, A-Level, JAMB, WAEC, IB, SAT, and more — curated and linked from official sources.
          </p>

          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search past papers, syllabuses, notes..."
                className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 text-sm font-semibold text-[#0f3460] px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" /> Filters
              {(selectedTypes.length + selectedCurricula.length) > 0 && (
                <span className="bg-[#0f3460] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedTypes.length + selectedCurricula.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </DualVideoHero>

      {/* Stats */}
      <div className="bg-[#0f3460] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: `${RESOURCES.length}+`, label: 'Resources Listed' },
            { value: `${RESOURCES.filter(r => r.is_free).length}`, label: 'Free Resources' },
            { value: `${RESOURCES.filter(r => r.is_official).length}`, label: 'Official Sources' },
            { value: '8', label: 'Curricula Covered' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Filter Resources</h3>
              {hasFilters && (
                <button onClick={clearAll} className="text-sm text-[#0f3460] font-semibold hover:underline flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Resource Type</p>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_TYPES.map(t => {
                  const Icon = TYPE_ICONS[t]
                  return (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all ${selectedTypes.includes(t)
                        ? 'bg-[#0f3460] text-white border-[#0f3460]'
                        : 'border-slate-200 text-slate-700 hover:border-[#0f3460] hover:text-[#0f3460]'}`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {t}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Curriculum</p>
              <div className="flex flex-wrap gap-2">
                {CURRICULA.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleCurriculum(c)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all ${selectedCurricula.includes(c)
                      ? 'bg-[#0f3460] text-white border-[#0f3460]'
                      : 'border-slate-200 text-slate-700 hover:border-[#0f3460] hover:text-[#0f3460]'}`}
                  >
                    {c} {counts[c] ? <span className="opacity-60">({counts[c]})</span> : null}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subject</p>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              >
                {SUBJECTS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#0f3460]" />
                <span className="text-sm font-semibold text-slate-700">Free resources only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={officialOnly} onChange={e => setOfficialOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#0f3460]" />
                <span className="text-sm font-semibold text-slate-700">Official sources only</span>
              </label>
            </div>
          </div>
        )}

        {/* Quick curriculum pills */}
        {!showFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCurricula([])}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${selectedCurricula.length === 0 ? 'nexora-gradient text-white border-transparent' : 'border-slate-200 text-slate-700 hover:border-[#0f3460]'}`}
            >All</button>
            {CURRICULA.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCurricula([c])}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${selectedCurricula.includes(c) && selectedCurricula.length === 1
                  ? 'nexora-gradient text-white border-transparent'
                  : 'border-slate-200 text-slate-700 hover:border-[#0f3460]'}`}
              >
                {c} <span className="opacity-60">({counts[c] ?? 0})</span>
              </button>
            ))}
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-600">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> resources
            {hasFilters && (
              <button onClick={clearAll} className="ml-2 text-[#0f3460] font-semibold hover:underline text-xs">
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Resources grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((resource) => {
              const Icon = resource.icon
              return (
                <div key={resource.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0f3460] hover:shadow-md transition-all flex flex-col">
                  {/* Top badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${resource.badge}`}>{resource.curriculum}</span>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{resource.type}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {resource.is_official && (
                        <span title="Official Source" className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">✓ Official</span>
                      )}
                      {resource.is_free && (
                        <span className="text-xs font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full">Free</span>
                      )}
                    </div>
                  </div>

                  {/* Icon + title */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-slate-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{resource.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">{resource.description}</p>

                  {/* Subject */}
                  <div className="text-xs text-slate-500 mb-3">
                    <span className="font-semibold">Subject:</span> {resource.subject}
                  </div>

                  {/* Source badge */}
                  <div className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border mb-4 flex items-center gap-1.5 ${SOURCE_COLORS[resource.source] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {resource.source.includes('Official') || resource.source.includes('JAMB') || resource.source.includes('WAEC') || resource.source.includes('NECO') || resource.source.includes('College Board') || resource.source.includes('IBO') || resource.source.includes('Pearson')
                      ? <Globe className="w-3 h-3 flex-shrink-0" />
                      : <ExternalLink className="w-3 h-3 flex-shrink-0" />}
                    {resource.source}
                  </div>

                  {/* CTA */}
                  <a
                    href={resource.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm font-bold text-white nexora-gradient py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {resource.type === 'Video Lessons'
                        ? <><Play className="w-4 h-4" /> Watch Videos</>
                        : resource.type === 'Syllabuses'
                          ? <><Download className="w-4 h-4" /> Get Syllabus</>
                          : <><ExternalLink className="w-4 h-4" /> Access Resource</>
                      }
                    </span>
                  </a>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">No resources found</h3>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your filters or search query.</p>
            <button onClick={clearAll} className="text-sm font-semibold text-[#0f3460] hover:underline">Clear all filters</button>
          </div>
        )}

        {/* Official sources notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">About These Resources</h3>
              <p className="text-sm text-blue-700">
                All resources listed here link to their original official or third-party sources. Nexora Academic does not host or redistribute copyrighted materials. Official Cambridge syllabuses and specimen papers are free to download directly from Cambridge International. Past paper archives are hosted by established third-party platforms used widely by students globally.
              </p>
            </div>
          </div>
        </div>

        {/* Tutor upload CTA */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Are You a Tutor? Sell Your Study Materials</h2>
          <p className="text-slate-600 text-sm mb-5 max-w-md mx-auto">
            Upload your own original notes, practice tests, and revision guides. Earn money every time a student downloads your materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register?role=tutor" className="inline-flex items-center gap-2 text-white font-bold nexora-gradient px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" /> Start Selling Resources
            </Link>
            <Link href="/tutors" className="inline-flex items-center gap-2 text-[#0f3460] font-bold border border-[#0f3460] px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              <BookOpen className="w-4 h-4" /> Find a Tutor Instead
            </Link>
          </div>
        </div>

        {/* Curriculum quick links */}
        <div className="mt-10">
          <h2 className="text-xl font-black text-slate-900 mb-5">Browse by Curriculum</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Cambridge A-Level', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/', color: 'bg-indigo-50 border-indigo-200 text-indigo-800', key: 'A-Level' },
              { name: 'Cambridge IGCSE', url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/', color: 'bg-blue-50 border-blue-200 text-blue-800', key: 'IGCSE' },
              { name: 'JAMB / UTME', url: 'https://www.jamb.gov.ng/', color: 'bg-teal-50 border-teal-200 text-teal-800', key: 'JAMB' },
              { name: 'WAEC / WASSCE', url: 'https://waeconline.org.ng/', color: 'bg-orange-50 border-orange-200 text-orange-800', key: 'WAEC' },
              { name: 'IB Diploma', url: 'https://www.ibo.org/programmes/diploma-programme/', color: 'bg-purple-50 border-purple-200 text-purple-800', key: 'IB' },
              { name: 'SAT (College Board)', url: 'https://satsuite.collegeboard.org/', color: 'bg-rose-50 border-rose-200 text-rose-800', key: 'SAT' },
              { name: 'Pearson Edexcel', url: 'https://qualifications.pearson.com/', color: 'bg-emerald-50 border-emerald-200 text-emerald-800', key: 'Edexcel' },
              { name: 'NECO', url: 'https://www.neco.gov.ng/', color: 'bg-lime-50 border-lime-200 text-lime-800', key: 'NECO' },
            ].map(item => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`border rounded-xl p-4 text-center hover:shadow-md transition-all group ${item.color}`}
              >
                <div className="font-bold text-sm mb-1">{item.name}</div>
                <div className="text-xs opacity-60">{counts[item.key as CurriculumKey] ?? 0} resources</div>
                <ExternalLink className="w-3.5 h-3.5 mx-auto mt-2 opacity-40 group-hover:opacity-70 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Popular on YouTube */}
        <div className="mt-10">
          <h2 className="text-xl font-black text-slate-900 mb-2">Popular YouTube Channels for Nigerian Students</h2>
          <p className="text-sm text-slate-500 mb-5">Free video lessons trusted by IGCSE and A-Level students in Nigeria.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'ExamSolutions', subject: 'A-Level Mathematics', url: 'https://www.youtube.com/@ExamSolutions_Maths', subs: '490K subscribers' },
              { name: 'Science With Hazel', subject: 'IGCSE & A-Level Sciences', url: 'https://www.youtube.com/@ScienceWithHazel', subs: '280K subscribers' },
              { name: 'Physics Online', subject: 'A-Level Physics', url: 'https://www.youtube.com/@PhysicsOnline', subs: '220K subscribers' },
              { name: 'Cognito', subject: 'IGCSE All Subjects', url: 'https://www.youtube.com/@cognitoedu', subs: '870K subscribers' },
              { name: 'Khan Academy', subject: 'SAT + All Subjects', url: 'https://www.youtube.com/@khanacademy', subs: '8.5M subscribers' },
              { name: 'Revision Village', subject: 'IB Mathematics', url: 'https://www.youtube.com/@RevisionVillageIB', subs: '110K subscribers' },
            ].map(ch => (
              <a
                key={ch.name}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Play className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition-colors">{ch.name}</div>
                  <div className="text-xs text-slate-500">{ch.subject}</div>
                  <div className="text-xs text-slate-400">{ch.subs}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Exam timetable notice */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">2026 Exam Timetables</h3>
            <p className="text-sm text-amber-700 mb-3">
              Official timetables for Cambridge IGCSE, A-Level, WAEC, JAMB, NECO, and IB are now available for the 2026 series.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Cambridge Timetable', url: 'https://www.cambridgeinternational.org/exam-administration/cambridge-exams-officers-guide/phase-3-just-before-the-exams/timetables/' },
                { name: 'JAMB Timetable', url: 'https://www.jamb.gov.ng/' },
                { name: 'WAEC Timetable', url: 'https://waeconline.org.ng/' },
                { name: 'IB Exam Schedule', url: 'https://www.ibo.org/programmes/diploma-programme/assessment-and-exams/getting-results/' },
              ].map(t => (
                <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> {t.name}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
