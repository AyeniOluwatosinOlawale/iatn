import Link from 'next/link'
import { MapPin, Clock, Star, Award, CheckCircle2, BookOpen, Users, Calendar, MessageSquare, Shield, ChevronRight, Phone, Mail } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { CURRICULA } from '@/lib/utils'

// Sample data for a tutor profile page
const TUTOR = {
  id: '1',
  registration_number: 'NXR-2026-000001',
  full_name: 'Dr. Adaeze Obi',
  photo_url: null,
  email: 'adaeze@example.com',
  phone: '+234 801 234 5678',
  state: 'Lagos', city: 'Victoria Island',
  current_institution: 'Greenwood International School',
  years_experience: 12,
  teaching_mode: 'both' as const,
  languages: ['English', 'Igbo'],
  bio: `I am a Cambridge examiner and A-Level Mathematics specialist with 12 years of experience teaching at top international schools in Lagos. My students consistently achieve A* and A grades in Cambridge IGCSE and A-Level Mathematics.

My approach combines rigorous problem-solving practice with conceptual understanding, ensuring students can tackle any question style. I have prepared over 300 students for Cambridge examinations and hold a PhD in Applied Mathematics from the University of Lagos.

I offer both online and in-person lessons and provide detailed progress reports after every session.`,
  hourly_rate_ngn: 25000,
  time_zone: 'Africa/Lagos',
  max_class_size: 1,
  offers_group_classes: true,
  offers_trial_lesson: true,
  response_time_hours: 1,
  tools: ['Zoom', 'Google Classroom', 'Digital Whiteboard', 'Interactive Assessments'],
  is_verified: true,
  overall_rating: 4.9,
  review_count: 87,
  total_teaching_hours: 3600,
  profile_views: 12450,
  subjects: [
    { subject: 'Mathematics', curriculum: 'a_level', proficiency: 'expert' },
    { subject: 'Further Mathematics', curriculum: 'a_level', proficiency: 'expert' },
    { subject: 'Mathematics', curriculum: 'igcse', proficiency: 'expert' },
    { subject: 'Further Mathematics', curriculum: 'igcse', proficiency: 'expert' },
  ],
  qualifications: [
    { qualification_type: 'PhD', institution: 'University of Lagos', field_of_study: 'Applied Mathematics', year_obtained: 2012, is_verified: true },
    { qualification_type: "Bachelor's Degree", institution: 'Obafemi Awolowo University', field_of_study: 'Mathematics', year_obtained: 2007, is_verified: true },
    { qualification_type: 'PGDE', institution: 'University of Lagos', field_of_study: 'Education', year_obtained: 2013, is_verified: true },
  ],
  cambridge_metrics: {
    total_students_taught: 312,
    total_exam_sittings: 580,
    a_star_a_percentage: 91.2,
    pass_rate: 99.5,
    outstanding_learner_awards: 4,
    top_achievements: 'Four students awarded Cambridge Outstanding Learner Award in 2022–2025. Top student scored 100% in A-Level Mathematics Paper 3.',
    is_admin_verified: true,
  },
  badges: ['verified_tutor', 'cambridge_expert', 'identity_verified', 'qualification_verified'],
}

const REVIEWS = [
  { name: 'Chioma A.', rating: 5, date: '3 months ago', comment: 'Dr. Adaeze is exceptional. My daughter moved from a C to A* in A-Level Maths in just one term. Highly recommend!' },
  { name: 'Tunde B.', rating: 5, date: '5 months ago', comment: 'Best A-Level tutor in Lagos. Her explanations are crystal clear and she makes complex topics easy to understand.' },
  { name: 'Blessing O.', rating: 5, date: '6 months ago', comment: 'My son achieved an Outstanding Learner Award thanks to Dr. Adaeze. She goes above and beyond for her students.' },
]

const badgeLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  verified_tutor: { label: 'Verified Tutor', color: 'badge-verified', icon: CheckCircle2 },
  cambridge_expert: { label: 'Cambridge Expert', color: 'badge-cambridge', icon: Award },
  top_tutor: { label: 'Top Tutor', color: 'badge-top', icon: Star },
  identity_verified: { label: 'ID Verified', color: 'badge-verified', icon: Shield },
  qualification_verified: { label: 'Qual. Verified', color: 'badge-cambridge', icon: BookOpen },
  background_verified: { label: 'BG Checked', color: 'badge-cambridge', icon: Shield },
}

export default function TutorProfilePage() {
  const tutor = TUTOR

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-[#0f3460]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tutors" className="hover:text-[#0f3460]">Tutors</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium">{tutor.full_name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex gap-5">
                <div className="w-20 h-20 rounded-2xl nexora-gradient flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                  {tutor.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">{tutor.full_name}</h1>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tutor.city}, {tutor.state}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {tutor.years_experience} yrs experience</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {tutor.cambridge_metrics.total_students_taught} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-mono">{tutor.registration_number}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tutor.badges.map((b) => {
                      const config = badgeLabels[b]
                      if (!config) return null
                      return (
                        <span key={b} className={config.color}>
                          <config.icon className="w-3 h-3" /> {config.label}
                        </span>
                      )
                    })}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(tutor.overall_rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                      ))}
                      <span className="ml-1 font-bold text-slate-900">{tutor.overall_rating.toFixed(1)}</span>
                      <span className="text-slate-500 text-sm">({tutor.review_count} reviews)</span>
                    </div>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-600">{tutor.total_teaching_hours.toLocaleString()} teaching hours</span>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {tutor.subjects.map((s) => (
                  <span key={`${s.subject}-${s.curriculum}`} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                    {s.subject} · {CURRICULA.find((c) => c.value === s.curriculum)?.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 mb-4">About {tutor.full_name}</h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                {tutor.bio.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            {/* Cambridge Results */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-bold text-slate-900">Cambridge & Exam Results</h2>
                {tutor.cambridge_metrics.is_admin_verified && (
                  <span className="badge-verified text-xs">✓ Admin Verified</span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard value={tutor.cambridge_metrics.total_students_taught.toString()} label="Students Taught" />
                <MetricCard value={tutor.cambridge_metrics.total_exam_sittings.toString()} label="Exam Sittings" />
                <MetricCard value={`${tutor.cambridge_metrics.a_star_a_percentage}%`} label="A*/A Rate" highlight />
                <MetricCard value={`${tutor.cambridge_metrics.pass_rate}%`} label="Pass Rate" highlight />
              </div>
              {tutor.cambridge_metrics.outstanding_learner_awards > 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-amber-800">{tutor.cambridge_metrics.outstanding_learner_awards} Outstanding Learner Awards</div>
                    <div className="text-xs text-amber-700 mt-0.5">{tutor.cambridge_metrics.top_achievements}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 mb-4">Qualifications</h2>
              <div className="space-y-3">
                {tutor.qualifications.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">{q.qualification_type} — {q.field_of_study}</div>
                      <div className="text-xs text-slate-500">{q.institution} · {q.year_obtained}</div>
                    </div>
                    {q.is_verified && <span className="badge-verified text-xs">✓ Verified</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Student Reviews ({tutor.review_count})</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">{tutor.overall_rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="space-y-4">
                {REVIEWS.map((r, i) => (
                  <div key={i} className="py-4 border-b border-slate-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {r.name[0]}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                        </div>
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="space-y-3 my-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Response time</span>
                    <span className="font-medium text-slate-900">Under {tutor.response_time_hours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Teaching mode</span>
                    <span className="font-medium text-slate-900 capitalize">{tutor.teaching_mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Languages</span>
                    <span className="font-medium text-slate-900">{tutor.languages.join(', ')}</span>
                  </div>
                  {tutor.offers_trial_lesson && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trial lesson</span>
                      <span className="font-medium text-emerald-600">Available</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/book/${tutor.id}`}
                  className="block w-full nexora-gradient text-white text-center font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity mb-3"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Book a Lesson
                </Link>
                <a
                  href={`mailto:${tutor.email}?subject=Lesson Enquiry — ${encodeURIComponent(tutor.full_name)}&body=Hi ${encodeURIComponent(tutor.full_name)},%0A%0AI found your profile on Nexora Academic and I'd like to enquire about lessons.%0A%0APlease let me know your availability.%0A%0AThank you.`}
                  className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 text-center font-semibold py-3 rounded-xl hover:border-[#0f3460] hover:text-[#0f3460] transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </a>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <a href={`tel:${tutor.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#0f3460] transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {tutor.phone}
                  </a>
                  <a href={`mailto:${tutor.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#0f3460] transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {tutor.email}
                  </a>
                </div>
              </div>

              {/* Tools */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Teaching Tools</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.tools.map((t) => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              {/* Profile stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Profile Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Profile views</span><span className="font-medium">{tutor.profile_views.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Teaching hours</span><span className="font-medium">{tutor.total_teaching_hours.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Reviews</span><span className="font-medium">{tutor.review_count}</span></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function MetricCard({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center ${highlight ? 'nexora-gradient text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`text-2xl font-black ${highlight ? 'text-white' : 'text-[#0f3460]'}`}>{value}</div>
      <div className={`text-xs mt-1 ${highlight ? 'text-white/70' : 'text-slate-500'}`}>{label}</div>
    </div>
  )
}
