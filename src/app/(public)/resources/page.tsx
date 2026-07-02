import Link from 'next/link'
import { BookOpen, Download, FileText, ChevronRight, Search, Star, Lock } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const RESOURCES = [
  {
    id: '1', title: 'Cambridge A-Level Mathematics Past Papers (2015–2024)', type: 'Past Papers',
    curriculum: 'A-Level', subject: 'Mathematics', year: '2015–2024',
    downloads: 12400, rating: 4.9, is_free: true,
    description: 'Complete collection of Cambridge A-Level Pure Mathematics, Mechanics and Statistics past papers with mark schemes.',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: '2', title: 'IGCSE Physics Past Papers with Mark Schemes (2018–2024)', type: 'Past Papers',
    curriculum: 'IGCSE', subject: 'Physics', year: '2018–2024',
    downloads: 9800, rating: 4.8, is_free: true,
    description: 'Official Cambridge IGCSE Physics past papers (0625) including both Paper 1 (MCQ) and Paper 2, with full mark schemes.',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    id: '3', title: 'JAMB Past Questions 2010–2024 (All Subjects)', type: 'Past Questions',
    curriculum: 'JAMB', subject: 'All Subjects', year: '2010–2024',
    downloads: 45000, rating: 4.9, is_free: true,
    description: 'Complete JAMB/UTME past questions for English, Mathematics, Physics, Chemistry, Biology, Economics and more.',
    badge: 'bg-teal-100 text-teal-800',
  },
  {
    id: '4', title: 'WAEC Past Questions & Answers 2015–2024', type: 'Past Questions',
    curriculum: 'WAEC', subject: 'All Subjects', year: '2015–2024',
    downloads: 38000, rating: 4.8, is_free: true,
    description: 'West African Senior School Certificate past questions with detailed answers and explanations for all major subjects.',
    badge: 'bg-orange-100 text-orange-800',
  },
  {
    id: '5', title: 'A-Level Chemistry Complete Study Notes', type: 'Study Notes',
    curriculum: 'A-Level', subject: 'Chemistry', year: '2025',
    downloads: 7200, rating: 4.7, is_free: false,
    description: 'Comprehensive handwritten-style A-Level Chemistry notes covering all Cambridge syllabus topics. Includes worked examples.',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: '6', title: 'SAT Math Practice Tests — 8 Full Tests', type: 'Practice Tests',
    curriculum: 'SAT', subject: 'Mathematics', year: '2025',
    downloads: 5600, rating: 4.8, is_free: false,
    description: '8 full-length SAT Math practice tests with detailed answer explanations. Covers all Digital SAT Math topics.',
    badge: 'bg-rose-100 text-rose-800',
  },
  {
    id: '7', title: 'IB Biology SL/HL Revision Guide', type: 'Study Notes',
    curriculum: 'IB', subject: 'Biology', year: '2025',
    downloads: 3100, rating: 4.6, is_free: false,
    description: 'Structured IB Biology revision notes for both SL and HL covering all options. Includes Internal Assessment guide.',
    badge: 'bg-purple-100 text-purple-800',
  },
  {
    id: '8', title: 'IGCSE English Language Writing Techniques Guide', type: 'Study Notes',
    curriculum: 'IGCSE', subject: 'English Language', year: '2025',
    downloads: 6800, rating: 4.9, is_free: true,
    description: 'Master directed writing, summary writing, and narrative/descriptive composition for Cambridge IGCSE English.',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    id: '9', title: 'NECO Mathematics Past Questions 2015–2024', type: 'Past Questions',
    curriculum: 'NECO', subject: 'Mathematics', year: '2015–2024',
    downloads: 18000, rating: 4.7, is_free: true,
    description: 'Full NECO SSCE Mathematics past questions with worked solutions covering all topics on the syllabus.',
    badge: 'bg-lime-100 text-lime-800',
  },
]

const RESOURCE_TYPES = ['All', 'Past Papers', 'Past Questions', 'Study Notes', 'Practice Tests']
const CURRICULA = ['All', 'A-Level', 'IGCSE', 'JAMB', 'WAEC', 'NECO', 'IB', 'SAT']

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="iatn-gradient text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Resources</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Study Resources</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Free and premium past papers, mark schemes, study notes and practice tests for IGCSE, A-Level, JAMB, WAEC, NECO, IB, and SAT.
          </p>

          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search past papers, notes, practice tests..." className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent" />
            </div>
            <button className="iatn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">Search</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f3460] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '5,000+', label: 'Resources Available' },
            { value: '200,000+', label: 'Downloads' },
            { value: 'Free', label: 'Most Resources' },
            { value: '10', label: 'Curricula Covered' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_TYPES.map((t) => (
                <button key={t} className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${t === 'All' ? 'iatn-gradient text-white border-transparent' : 'border-slate-200 text-slate-700 hover:border-[#0f3460] hover:text-[#0f3460]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Curriculum</p>
            <div className="flex flex-wrap gap-2">
              {CURRICULA.map((c) => (
                <button key={c} className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${c === 'All' ? 'iatn-gradient text-white border-transparent' : 'border-slate-200 text-slate-700 hover:border-[#0f3460] hover:text-[#0f3460]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCES.map((resource) => (
            <div key={resource.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0f3460] hover:shadow-md transition-all flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${resource.badge}`}>{resource.curriculum}</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{resource.type}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2">{resource.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">{resource.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {resource.downloads.toLocaleString()} downloads
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {resource.rating}
                </span>
              </div>

              {resource.is_free ? (
                <a href="#" className="block text-center text-sm font-bold text-white iatn-gradient py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                  <span className="flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Free Download</span>
                </a>
              ) : (
                <div className="space-y-2">
                  <Link href="/register" className="block text-center text-sm font-bold text-white iatn-gradient py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <span className="flex items-center justify-center gap-2"><Lock className="w-4 h-4" /> Unlock — Sign Up Free</span>
                  </Link>
                  <p className="text-xs text-slate-500 text-center">Premium resource — free with IATN account</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upload CTA for tutors */}
        <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Are You a Tutor? Sell Your Study Materials</h2>
          <p className="text-slate-600 text-sm mb-5 max-w-md mx-auto">
            Upload your notes, practice tests, and revision guides. Earn money every time a student downloads your materials.
          </p>
          <Link href="/register?role=tutor" className="inline-flex items-center gap-2 text-white font-bold iatn-gradient px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
            <BookOpen className="w-4 h-4" /> Start Selling Resources
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
