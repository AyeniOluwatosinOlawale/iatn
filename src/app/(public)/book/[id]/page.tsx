import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import BookingForm from './BookingForm'

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirectTo=/book/${id}`)

  const { data: tutorRaw } = await supabase
    .from('tutors')
    .select('id, full_name, city, state, overall_rating, is_verified, hourly_rate_ngn, photo_url, teaching_mode, offers_trial_lesson')
    .eq('id', id)
    .maybeSingle()

  if (!tutorRaw) notFound()

  const { data: subjectsRaw } = await supabase
    .from('tutor_subjects')
    .select('subject, curriculum')
    .eq('tutor_id', id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tutor = tutorRaw as any
  const subjects = (subjectsRaw ?? []) as { subject: string; curriculum: string }[]

  const initials = (tutor.full_name as string).split(' ').map((n: string) => n[0]).join('').slice(0, 2)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="nexora-gradient text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href={`/tutors/${id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to tutors
          </Link>
          <h1 className="text-3xl font-black">Book a Lesson</h1>
          <p className="text-white/70 mt-1 text-sm">Complete the form below to request a lesson with {tutor.full_name}</p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Tutor card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-5">
                {tutor.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tutor.photo_url} alt={tutor.full_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl nexora-gradient flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-slate-900 text-lg leading-tight">{tutor.full_name}</h2>
                    {tutor.is_verified && <span className="badge-verified text-xs">✓ Verified</span>}
                  </div>
                  {tutor.city && tutor.state && (
                    <div className="text-xs text-slate-500 mt-1">{tutor.city}, {tutor.state}</div>
                  )}
                  {tutor.overall_rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-sm font-semibold text-slate-900">{Number(tutor.overall_rating).toFixed(1)}</span>
                      <span className="text-xs text-slate-400">/ 5.0</span>
                    </div>
                  )}
                </div>
              </div>

              {subjects.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subjects taught</h3>
                  <div className="flex flex-col gap-1.5">
                    {subjects.map((s) => (
                      <div key={`${s.subject}-${s.curriculum}`} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="text-emerald-500">✓</span>
                        {s.subject} {s.curriculum?.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tutor.hourly_rate_ngn && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Rate</span>
                    <span className="font-black text-[#0f3460]">₦{Number(tutor.hourly_rate_ngn).toLocaleString()} / hr</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking form (client component) */}
          <div className="lg:col-span-3">
            <BookingForm
              tutorId={id}
              tutorName={tutor.full_name}
              subjects={subjects}
              offersTrialLesson={tutor.offers_trial_lesson ?? false}
              teachingMode={tutor.teaching_mode ?? 'both'}
              hourlyRateNgn={tutor.hourly_rate_ngn ?? 0}
              userId={user.id}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
