import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Star, Users, BookOpen, CheckCircle2, Award, ArrowLeft, Phone, Mail, Globe, Calendar, Building2, GraduationCap, ChevronRight } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'

const CURRICULUM_LABELS: Record<string, string> = {
  igcse: 'Cambridge IGCSE', a_level: 'Cambridge A-Level', edexcel: 'Pearson Edexcel',
  oxfordaqa: 'OxfordAQA', ib: 'IB Diploma', sat: 'SAT', act: 'ACT',
  jamb: 'JAMB', neco: 'NECO', jupeb: 'JUPEB',
}

const CURRICULUM_COLORS: Record<string, string> = {
  igcse: 'bg-blue-100 text-blue-800', a_level: 'bg-indigo-100 text-indigo-800',
  edexcel: 'bg-emerald-100 text-emerald-800', oxfordaqa: 'bg-amber-100 text-amber-800',
  ib: 'bg-purple-100 text-purple-800', sat: 'bg-rose-100 text-rose-800',
  act: 'bg-orange-100 text-orange-800', jamb: 'bg-teal-100 text-teal-800',
  neco: 'bg-lime-100 text-lime-800', jupeb: 'bg-cyan-100 text-cyan-800',
}

type SchoolRow = {
  id: string
  registration_number: string | null
  school_name: string
  logo_url: string | null
  email: string
  phone: string | null
  website: string | null
  state: string
  city: string | null
  address: string | null
  school_type: string | null
  curricula: string[] | null
  founded_year: number | null
  student_count: number | null
  fee_range_ngn_min: number | null
  fee_range_ngn_max: number | null
  a_star_a_rate: number | null
  university_placement_rate: number | null
  about: string | null
  is_verified: boolean
  overall_rating: number | null
  review_count: number | null
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default async function SchoolProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('schools')
    .select('id, registration_number, school_name, logo_url, email, phone, website, state, city, address, school_type, curricula, founded_year, student_count, fee_range_ngn_min, fee_range_ngn_max, a_star_a_rate, university_placement_rate, about, is_verified, overall_rating, review_count')
    .eq('id', id)
    .maybeSingle() as { data: SchoolRow | null }

  if (!data) notFound()

  const school = data
  const curricula = school.curricula ?? []
  const initials = getInitials(school.school_name)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

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
            {school.logo_url ? (
              <Image src={school.logo_url} alt={school.school_name} width={96} height={96} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black text-white" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{school.school_name}</h1>
                {school.is_verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Nexora Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mb-3">
                {(school.city || school.state) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {school.city ? `${school.city}, ` : ''}{school.state}
                  </span>
                )}
                {school.school_type && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {school.school_type.charAt(0).toUpperCase() + school.school_type.slice(1)} School
                  </span>
                )}
                {school.founded_year && (
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" />Est. {school.founded_year}</span>
                )}
                {school.student_count && (
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" />{school.student_count.toLocaleString()} Students</span>
                )}
              </div>

              {curricula.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {curricula.map(c => (
                    <span key={c} className={`text-xs font-bold px-2.5 py-1 rounded-full ${CURRICULUM_COLORS[c] ?? 'bg-slate-100 text-slate-700'}`}>
                      {CURRICULUM_LABELS[c] ?? c.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {(school.overall_rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-black text-slate-900">{Number(school.overall_rating).toFixed(1)}</span>
                    <span className="text-slate-500 text-sm">({school.review_count} reviews)</span>
                  </div>
                )}
                {school.a_star_a_rate && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Award className="w-4 h-4 text-[#533483]" />
                    <span className="font-bold text-slate-800">{Number(school.a_star_a_rate).toFixed(1)}%</span>
                    <span className="text-slate-500">A*/A rate</span>
                  </div>
                )}
                {school.university_placement_rate && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">{Number(school.university_placement_rate).toFixed(0)}%</span>
                    <span className="text-slate-500">uni placement</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {school.about && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">About the School</h2>
              <div className="space-y-3">
                {school.about.split('\n\n').map((para, i) => (
                  <p key={i} className="text-slate-700 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          )}

          {curricula.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">Curricula Offered</h2>
              <div className="flex flex-wrap gap-2">
                {curricula.map(c => (
                  <span key={c} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full ${CURRICULUM_COLORS[c] ?? 'bg-slate-100 text-slate-700'}`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    {CURRICULUM_LABELS[c] ?? c.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(school.fee_range_ngn_min || school.fee_range_ngn_max) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">Fee Range</h2>
              <p className="text-slate-700 text-sm">
                ₦{school.fee_range_ngn_min ? Number(school.fee_range_ngn_min).toLocaleString() : '—'}
                {school.fee_range_ngn_max ? ` – ₦${Number(school.fee_range_ngn_max).toLocaleString()}` : ''} per year
              </p>
            </div>
          )}

          {/* Empty state if very little info */}
          {!school.about && curricula.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">This school is still completing their profile. Check back soon.</p>
            </div>
          )}
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">

          {/* CTA card */}
          <div className="bg-white rounded-2xl border-2 border-[#533483] p-6 text-center sticky top-24">
            {school.logo_url ? (
              <Image src={school.logo_url} alt={school.school_name} width={64} height={64} className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #533483 0%, #0f3460 100%)' }}>
                {initials}
              </div>
            )}
            <h3 className="font-black text-slate-900 text-lg mb-1">{school.school_name}</h3>
            <p className="text-slate-600 text-sm mb-4">{school.city ? `${school.city}, ` : ''}{school.state}</p>

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
          {(school.address || school.phone || school.email || school.website) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="font-bold text-slate-900">Contact Information</h3>
              <div className="space-y-3 text-sm">
                {school.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{school.address}</span>
                  </div>
                )}
                {school.phone && (
                  <a href={`tel:${school.phone}`} className="flex items-center gap-3 text-[#533483] font-medium hover:underline">
                    <Phone className="w-4 h-4 flex-shrink-0" />{school.phone}
                  </a>
                )}
                {school.email && (
                  <a href={`mailto:${school.email}`} className="flex items-center gap-3 text-[#533483] font-medium hover:underline">
                    <Mail className="w-4 h-4 flex-shrink-0" />{school.email}
                  </a>
                )}
                {school.website && (
                  <a href={school.website.startsWith('http') ? school.website : `https://${school.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#533483] font-medium hover:underline">
                    <Globe className="w-4 h-4 flex-shrink-0" />{school.website}
                  </a>
                )}
              </div>
            </div>
          )}

          {school.registration_number && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Nexora Registration</div>
              <div className="font-mono font-bold text-slate-700 text-sm">{school.registration_number}</div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-3">Explore More</h3>
            <div className="space-y-2">
              {[
                { label: 'All A-Level Schools', href: '/schools' },
                { label: 'Find an A-Level Tutor', href: '/tutors' },
              ].map(link => (
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
