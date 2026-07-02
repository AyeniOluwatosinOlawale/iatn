import Link from 'next/link'
import { MapPin, Star, Users, BookOpen, CheckCircle2, Award, ArrowLeft, Phone, Mail, Globe, Calendar, Building2, GraduationCap, ChevronRight, ExternalLink } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { formatNgn } from '@/lib/utils'

const SCHOOL_DATA: Record<string, {
  id: string
  registration_number: string
  school_name: string
  logo_initial: string
  state: string
  city: string
  address: string
  school_type: string
  curricula: string[]
  founded_year: number
  student_count: number
  fee_range_ngn_min: number
  fee_range_ngn_max: number
  is_verified: boolean
  overall_rating: number
  review_count: number
  a_star_a_rate: number
  university_placement_rate: number
  about: string
  tags: string[]
  email: string
  phone: string
  website: string
  facilities: string[]
  university_destinations: string[]
  open_days: { date: string; description: string }[]
  reviews: { name: string; role: string; rating: number; comment: string; date: string }[]
  subjects_offered: string[]
}> = {
  '1': {
    id: '1',
    registration_number: 'IATN-SCH-2026-0001',
    school_name: 'Greensprings School',
    logo_initial: 'GS',
    state: 'Lagos', city: 'Anthony Village',
    address: '1 Sylvester Abiodun Pathway, Anthony Village, Lagos',
    school_type: 'private',
    curricula: ['igcse', 'a_level'],
    founded_year: 1999,
    student_count: 2800,
    fee_range_ngn_min: 2500000,
    fee_range_ngn_max: 4500000,
    is_verified: true,
    overall_rating: 4.9,
    review_count: 214,
    a_star_a_rate: 87.3,
    university_placement_rate: 96,
    about: 'Greensprings School is one of Nigeria\'s foremost international schools, delivering world-class education through the Cambridge IGCSE and A-Level curricula since 1999. Our 27-year track record of academic excellence has seen thousands of students go on to study at the world\'s best universities — Oxford, Cambridge, Imperial, UCL, Harvard, Yale, MIT, and more.\n\nOur approach blends rigorous academic preparation with holistic development. We invest in outstanding teachers, modern facilities, and a nurturing environment that allows every student to discover and develop their unique potential. Our Cambridge International Centre status and consistent A*/A pass rates above 85% place us consistently among Nigeria\'s top-performing international schools.',
    tags: ['Cambridge Centre', 'Boarding Available', 'University Guidance', 'Sports Excellence'],
    email: 'admissions@greensprings.edu.ng',
    phone: '+234 802 345 6789',
    website: 'greensprings.edu.ng',
    facilities: ['Modern Science Labs', 'Olympic-Size Swimming Pool', 'Indoor Sports Hall', 'School Farm', 'Library & Resource Centre', 'ICT Lab', 'Music & Arts Studio', 'Boarding House'],
    university_destinations: ['Oxford', 'Cambridge', 'Imperial College', 'UCL', 'LSE', 'Harvard', 'MIT', 'Yale', 'University of Toronto', 'Covenant University'],
    open_days: [
      { date: 'Saturday 15 Feb 2026', description: 'Annual Open Day — tours, subject taster sessions, parent Q&A with the Principal' },
      { date: 'Saturday 19 Apr 2026', description: 'A-Level Information Evening — subject choices, UCAS, scholarships' },
    ],
    reviews: [
      { name: 'Mrs. Chidinma Obi', role: 'Parent of IGCSE Student', rating: 5, comment: 'Greensprings gave my son the foundation that got him into LSE. The teachers are exceptional and the pastoral care is second to none. Worth every penny.', date: 'November 2025' },
      { name: 'Adebayo Afolabi', role: 'A-Level Alumni (2024)', rating: 5, comment: 'I got A*AA in my A-Levels and an offer from Imperial College. The A-Level programme here is genuinely world-class. My Physics teacher was one of the best I have ever had.', date: 'September 2024' },
      { name: 'Mr. Emeka Eze', role: 'Parent of Two Students', rating: 5, comment: 'Both my children attend Greensprings and the consistency is remarkable. The school has a culture of excellence that is rare to find in Nigeria.', date: 'January 2026' },
    ],
    subjects_offered: ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science', 'English Language', 'Literature', 'Geography', 'History', 'Art & Design', 'Music'],
  },
  '2': {
    id: '2',
    registration_number: 'IATN-SCH-2026-0002',
    school_name: 'Corona Secondary School',
    logo_initial: 'CS',
    state: 'Lagos', city: 'Lekki',
    address: 'Lekki Phase 1, Lagos',
    school_type: 'private',
    curricula: ['igcse', 'a_level', 'edexcel'],
    founded_year: 1989,
    student_count: 1500,
    fee_range_ngn_min: 3000000,
    fee_range_ngn_max: 5000000,
    is_verified: true,
    overall_rating: 4.8,
    review_count: 178,
    a_star_a_rate: 82.1,
    university_placement_rate: 94,
    about: 'Corona Secondary School Lekki is a premier international school offering Cambridge IGCSE, Cambridge A-Levels, and Pearson Edexcel curricula. Since 1989, Corona has produced some of Nigeria\'s finest graduates who now lead in medicine, law, technology, finance, and government across the world.\n\nOur Lekki campus features state-of-the-art facilities and a faculty of highly qualified international curriculum specialists. We pride ourselves on small class sizes that enable personalised attention, and our university guidance programme has an unmatched track record of UK and US university admissions.',
    tags: ['Cambridge Centre', 'Edexcel Centre', 'Sports Programme', 'Small Class Sizes'],
    email: 'admissions@coronaschools.edu.ng',
    phone: '+234 803 456 7890',
    website: 'coronaschools.edu.ng',
    facilities: ['Science Laboratories', 'Sports Complex', 'Library', 'ICT Centre', 'Cafeteria', 'Music Room', 'Art Studio'],
    university_destinations: ['King\'s College London', 'Exeter', 'Birmingham', 'Manchester', 'Warwick', 'Queen Mary', 'Penn State', 'McGill', 'University of Lagos'],
    open_days: [
      { date: 'Saturday 8 Mar 2026', description: 'Spring Open Day — campus tours and subject information sessions' },
    ],
    reviews: [
      { name: 'Dr. Ngozi Iheme', role: 'Parent', rating: 5, comment: 'My daughter was accepted to King\'s College London after completing her A-Levels at Corona. The school\'s university guidance team is truly outstanding.', date: 'October 2025' },
      { name: 'Tunde Fashola Jr.', role: 'A-Level Alumni', rating: 4, comment: 'Great school with excellent teachers. The Edexcel programme is particularly strong. I wish they had a wider range of A-Level subjects though.', date: 'August 2025' },
    ],
    subjects_offered: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'English Language', 'Geography', 'Computer Science'],
  },
}

const CURRICULUM_LABELS: Record<string, string> = {
  igcse: 'Cambridge IGCSE',
  a_level: 'Cambridge A-Level',
  edexcel: 'Pearson Edexcel',
  oxfordaqa: 'OxfordAQA',
  ib: 'IB Diploma',
  sat: 'SAT',
  act: 'ACT',
  jamb: 'JAMB',
  neco: 'NECO',
  jupeb: 'JUPEB',
}

const CURRICULUM_COLORS: Record<string, string> = {
  igcse: 'bg-blue-100 text-blue-800',
  a_level: 'bg-indigo-100 text-indigo-800',
  edexcel: 'bg-emerald-100 text-emerald-800',
  oxfordaqa: 'bg-amber-100 text-amber-800',
  ib: 'bg-purple-100 text-purple-800',
  sat: 'bg-rose-100 text-rose-800',
  act: 'bg-orange-100 text-orange-800',
  jamb: 'bg-teal-100 text-teal-800',
  neco: 'bg-lime-100 text-lime-800',
  jupeb: 'bg-cyan-100 text-cyan-800',
}

export default function SchoolProfilePage({ params }: { params: { id: string } }) {
  const school = SCHOOL_DATA[params.id] ?? SCHOOL_DATA['1']

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Back navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/schools" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#533483] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Schools
        </Link>
      </div>

      {/* School header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black text-white" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
              {school.logo_initial}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{school.school_name}</h1>
                {school.is_verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> IATN Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mb-3">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />{school.city}, {school.state}</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" />{school.school_type.charAt(0).toUpperCase() + school.school_type.slice(1)} School</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" />Est. {school.founded_year}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" />{school.student_count.toLocaleString()} Students</span>
              </div>

              {/* Curricula */}
              <div className="flex flex-wrap gap-2 mb-4">
                {school.curricula.map((c) => (
                  <span key={c} className={`text-xs font-bold px-2.5 py-1 rounded-full ${CURRICULUM_COLORS[c] ?? 'bg-slate-100 text-slate-700'}`}>
                    {CURRICULUM_LABELS[c] ?? c.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-black text-slate-900">{school.overall_rating}</span>
                  <span className="text-slate-500 text-sm">({school.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Award className="w-4 h-4 text-[#533483]" />
                  <span className="font-bold text-slate-800">{school.a_star_a_rate}%</span>
                  <span className="text-slate-500">A*/A rate</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">{school.university_placement_rate}%</span>
                  <span className="text-slate-500">uni placement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">About the School</h2>
            <div className="space-y-3">
              {school.about.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700 text-sm leading-relaxed">{para}</p>
              ))}
            </div>
            {school.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {school.tags.map((tag) => (
                  <span key={tag} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Subjects Offered */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Subjects Offered</h2>
            <div className="flex flex-wrap gap-2">
              {school.subjects_offered.map((subject) => (
                <span key={subject} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm px-3 py-1.5 rounded-full">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4">Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {school.facilities.map((facility) => (
                <div key={facility} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {facility}
                </div>
              ))}
            </div>
          </div>

          {/* University Destinations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900">University Destinations</h2>
              <span className="text-sm text-slate-500">{school.university_placement_rate}% placement rate</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {school.university_destinations.map((uni) => (
                <span key={uni} className="inline-flex items-center gap-1.5 bg-[#533483]/8 border border-[#533483]/20 text-[#533483] text-sm font-medium px-3 py-1.5 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" /> {uni}
                </span>
              ))}
            </div>
          </div>

          {/* Open Days */}
          {school.open_days.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">Upcoming Open Days</h2>
              <div className="space-y-4">
                {school.open_days.map((day) => (
                  <div key={day.date} className="flex gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{day.date}</div>
                      <div className="text-slate-600 text-sm mt-0.5">{day.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Parent & Student Reviews</h2>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-black text-slate-900">{school.overall_rating}</span>
                <span className="text-slate-500 text-sm">({school.review_count} reviews)</span>
              </div>
            </div>
            <div className="space-y-5">
              {school.reviews.map((review, i) => (
                <div key={i} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{review.name}</div>
                      <div className="text-xs text-slate-500">{review.role} · {review.date}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">

          {/* Enquire CTA */}
          <div className="bg-white rounded-2xl border-2 border-[#533483] p-6 text-center sticky top-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
              {school.logo_initial}
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-1">{school.school_name}</h3>
            <p className="text-slate-600 text-sm mb-4">{school.city}, {school.state}</p>

            <div className="bg-slate-50 rounded-xl p-4 mb-5 text-left space-y-2">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Annual Fees</div>
              <div className="text-xl font-black text-slate-900">
                {formatNgn(school.fee_range_ngn_min)} – {formatNgn(school.fee_range_ngn_max)}
              </div>
              <div className="text-xs text-slate-500">per academic year</div>
            </div>

            <a
              href={`mailto:${school.email}?subject=Admission Enquiry — ${school.school_name}`}
              className="block w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 mb-3"
              style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}
            >
              Send Admission Enquiry
            </a>
            <Link
              href={`/tutors?school=${encodeURIComponent(school.school_name)}`}
              className="block w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:border-[#533483] hover:text-[#533483] transition-colors"
            >
              Find Tutors for This School
            </Link>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{school.address}</span>
              </div>
              <a href={`tel:${school.phone}`} className="flex items-center gap-3 text-slate-700 hover:text-[#533483] transition-colors">
                <Phone className="w-4 h-4 text-slate-400" />
                {school.phone}
              </a>
              <a href={`mailto:${school.email}`} className="flex items-center gap-3 text-slate-700 hover:text-[#533483] transition-colors">
                <Mail className="w-4 h-4 text-slate-400" />
                {school.email}
              </a>
              <div className="flex items-center gap-3 text-slate-700">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{school.website}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Registration number */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">IATN Registration</div>
            <div className="font-mono font-bold text-slate-700 text-sm">{school.registration_number}</div>
          </div>

          {/* Browse more */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-3">Explore More</h3>
            <div className="space-y-2">
              {[
                { label: 'All A-Level Schools', href: '/schools?curriculum=a_level' },
                { label: 'IGCSE Schools', href: '/schools?curriculum=igcse' },
                { label: 'Schools in Lagos', href: '/schools?state=Lagos' },
                { label: 'Find an A-Level Tutor', href: '/tutors?curriculum=a_level' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between text-sm text-slate-700 hover:text-[#533483] py-1.5 border-b border-slate-100 last:border-0 transition-colors">
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
