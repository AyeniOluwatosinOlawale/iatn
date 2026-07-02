'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Link from 'next/link'
import { Award, BookOpen, Clock, CheckCircle, Star, TrendingUp, Calendar, ChevronRight } from 'lucide-react'

const CPD_COURSES = [
  {
    id: '1',
    title: 'Cambridge IGCSE Assessment for Learning',
    provider: 'Cambridge Assessment International Education',
    hours: 6,
    category: 'Pedagogy',
    level: 'Intermediate',
    format: 'Online',
    description: 'Learn how to use formative assessment effectively in Cambridge IGCSE classrooms to improve student outcomes.',
    badge: 'Certified',
  },
  {
    id: '2',
    title: 'Differentiated Instruction for Mixed-Ability Classes',
    provider: 'Nexora CPD Centre',
    hours: 4,
    category: 'Teaching Skills',
    level: 'All Levels',
    format: 'Online',
    description: 'Practical strategies for teaching students with different learning styles and ability levels in one classroom.',
    badge: 'Popular',
  },
  {
    id: '3',
    title: 'IB Theory of Knowledge for Teachers',
    provider: 'International Baccalaureate Organisation',
    hours: 8,
    category: 'Curriculum',
    level: 'Advanced',
    format: 'Online',
    description: 'A deep dive into the IB TOK framework, helping teachers guide students through interdisciplinary inquiry.',
    badge: null,
  },
  {
    id: '4',
    title: 'Digital Tools for Modern Educators',
    provider: 'Nexora CPD Centre',
    hours: 3,
    category: 'EdTech',
    level: 'Beginner',
    format: 'Online',
    description: 'Explore Google Classroom, Kahoot, Desmos, and other digital tools that enhance student engagement.',
    badge: 'New',
  },
  {
    id: '5',
    title: 'Safeguarding Children in Educational Settings',
    provider: 'Nigerian Child Protection Alliance',
    hours: 2,
    category: 'Welfare',
    level: 'All Levels',
    format: 'Online',
    description: 'Mandatory training for all educators on recognising and responding to child safeguarding concerns.',
    badge: 'Required',
  },
  {
    id: '6',
    title: 'A-Level Mathematics: Common Misconceptions',
    provider: 'Nexora CPD Centre',
    hours: 5,
    category: 'Subject Knowledge',
    level: 'Intermediate',
    format: 'Online',
    description: 'Address the most common student errors in A-Level Pure Mathematics, Statistics and Mechanics.',
    badge: null,
  },
]

const CATEGORIES = ['All', 'Pedagogy', 'Teaching Skills', 'Curriculum', 'EdTech', 'Welfare', 'Subject Knowledge']

const badgeColors: Record<string, string> = {
  Certified: 'bg-green-100 text-green-700',
  Popular: 'bg-blue-100 text-blue-700',
  New: 'bg-purple-100 text-purple-700',
  Required: 'bg-red-100 text-red-700',
}

export default function CPDPage() {
  const [category, setCategory] = useState('All')

  const filtered = CPD_COURSES.filter(c => category === 'All' || c.category === category)
  const totalHours = CPD_COURSES.reduce((sum, c) => sum + c.hours, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="nexora-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-3 py-1 rounded-full mb-4">
              <Award className="w-4 h-4" />
              Continuing Professional Development
            </div>
            <h1 className="text-4xl font-black mb-3">CPD Tracker & Courses</h1>
            <p className="text-white/80 text-lg">
              Stay ahead as an educator. Log your CPD hours, earn certificates, and access courses designed for international curriculum teachers in Nigeria.
            </p>
          </div>
          <div className="flex gap-8 mt-8">
            <div><div className="text-2xl font-black">{CPD_COURSES.length}+</div><div className="text-white/70 text-sm">Courses Available</div></div>
            <div><div className="text-2xl font-black">{totalHours}+</div><div className="text-white/70 text-sm">CPD Hours</div></div>
            <div><div className="text-2xl font-black">100%</div><div className="text-white/70 text-sm">Online & Flexible</div></div>
          </div>
        </div>
      </section>

      {/* CPD Log Banner */}
      <section className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-semibold text-amber-900 text-sm">Track your CPD hours</div>
              <div className="text-amber-700 text-xs">Register as a tutor to log your CPD hours, earn Nexora badges, and build your verified teaching profile.</div>
            </div>
          </div>
          <Link href="/register?role=tutor" className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap transition-colors">
            Start Tracking
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-[#0f3460] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-5 text-sm text-gray-500">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  {course.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[course.badge] || 'bg-gray-100 text-gray-600'}`}>
                      {course.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 leading-snug">{course.title}</h3>
                <p className="text-xs text-blue-700 font-medium mb-3">{course.provider}</p>
                <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.hours} CPD hours</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{course.level}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{course.format}</span>
                </div>
              </div>
              <div className="px-6 pb-5 border-t border-gray-50 pt-4 flex items-center justify-between">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{course.category}</span>
                <Link
                  href="/register?role=tutor"
                  className="flex items-center gap-1 text-sm text-[#0f3460] hover:text-blue-800 font-semibold"
                >
                  Enrol <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="mt-14 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Why CPD Matters for Nexora Tutors
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Verified Badge', desc: 'Complete 20+ CPD hours to earn a Nexora Verified Educator badge on your profile.', icon: Award },
              { title: 'Higher Rankings', desc: 'Tutors with active CPD records rank higher in search results and get more bookings.', icon: TrendingUp },
              { title: 'TRCN Points', desc: 'Some courses qualify for TRCN Continuous Professional Development points.', icon: Star },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 bg-[#0f3460]/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#0f3460]" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
