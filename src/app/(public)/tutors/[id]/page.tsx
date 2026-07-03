import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Clock, Star, Award, CheckCircle2, BookOpen, Users, Calendar, Shield, ChevronRight, Phone, Mail } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import SendMessageModal from '@/components/shared/SendMessageModal'
import { CURRICULA } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const badgeLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  verified_tutor:        { label: 'Verified Tutor',   color: 'badge-verified',   icon: CheckCircle2 },
  cambridge_expert:      { label: 'Cambridge Expert',  color: 'badge-cambridge',  icon: Award },
  top_tutor:             { label: 'Top Tutor',         color: 'badge-top',        icon: Star },
  identity_verified:     { label: 'ID Verified',       color: 'badge-verified',   icon: Shield },
  qualification_verified:{ label: 'Qual. Verified',    color: 'badge-cambridge',  icon: BookOpen },
  background_verified:   { label: 'BG Checked',        color: 'badge-cambridge',  icon: Shield },
}

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch tutor core data
  const { data: tutor } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!tutor) notFound()

  // Fetch related data in parallel
  const [subjectsRes, qualsRes, metricsRes, badgesRes, reviewsRes] = await Promise.all([
    supabase.from('tutor_subjects').select('*').eq('tutor_id', id),
    supabase.from('tutor_qualifications').select('*').eq('tutor_id', id),
    supabase.from('tutor_cambridge_metrics').select('*').eq('tutor_id', id).maybeSingle(),
    supabase.from('tutor_badges').select('badge_type').eq('tutor_id', id),
    supabase.from('reviews').select('*').eq('tutor_id', id).order('created_at', { ascending: false }).limit(5),
  ])

  // Record profile view (fire and forget — don't block render)
  const { data: { user } } = await supabase.auth.getUser()
  if (user && user.id !== (tutor as { user_id?: string }).user_id) {
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    serviceClient.from('profile_views').insert({
      tutor_id: id,
      viewer_id: user.id,
      viewer_role: user.user_metadata?.role ?? 'unknown',
      viewer_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    }).then(() => {})
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = tutor as any
  const subjects = (subjectsRes.data ?? []) as { subject: string; curriculum: string; proficiency_level: string }[]
  const qualifications = (qualsRes.data ?? []) as { qualification_type: string; institution: string; field_of_study: string; year_obtained: number; is_verified: boolean }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metrics = (metricsRes.data ?? null) as any
  const badges = (badgesRes.data ?? []).map((b: { badge_type: string }) => b.badge_type)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = (reviewsRes.data ?? []) as any[]

  // Build badges from verification status if no badge records
  const effectiveBadges = badges.length > 0 ? badges : [
    t.is_verified && 'verified_tutor',
    t.is_verified && 'identity_verified',
  ].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-[#0f3460]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tutors" className="hover:text-[#0f3460]">Tutors</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium">{t.full_name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex gap-5">
                {t.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photo_url} alt={t.full_name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl nexora-gradient flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                    {t.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">{t.full_name}</h1>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 flex-wrap">
                        {t.city && t.state && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t.city}, {t.state}</span>}
                        {t.years_experience && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.years_experience} yrs experience</span>}
                        {metrics?.total_students_taught && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {metrics.total_students_taught} students</span>}
                      </div>
                    </div>
                    {t.registration_number && (
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-mono">{t.registration_number}</div>
                      </div>
                    )}
                  </div>

                  {effectiveBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {effectiveBadges.map((b) => {
                        const config = badgeLabels[b]
                        if (!config) return null
                        return (
                          <span key={b} className={config.color}>
                            <config.icon className="w-3 h-3" /> {config.label}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    {t.overall_rating > 0 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(t.overall_rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                        <span className="ml-1 font-bold text-slate-900">{Number(t.overall_rating).toFixed(1)}</span>
                        <span className="text-slate-500 text-sm">({t.review_count} reviews)</span>
                      </div>
                    )}
                    {t.total_teaching_hours > 0 && (
                      <span className="text-sm text-slate-600">{Number(t.total_teaching_hours).toLocaleString()} teaching hours</span>
                    )}
                  </div>
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                  {subjects.map((s) => (
                    <span key={`${s.subject}-${s.curriculum}`} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                      {s.subject} · {CURRICULA.find((c) => c.value === s.curriculum)?.label ?? s.curriculum}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            {t.bio && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">About {t.full_name}</h2>
                <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                  {t.bio.split('\n\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
              </div>
            )}

            {/* Cambridge Results */}
            {metrics && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="font-bold text-slate-900">Cambridge & Exam Results</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {metrics.total_students_taught > 0 && <MetricCard value={metrics.total_students_taught.toString()} label="Students Taught" />}
                  {metrics.total_exam_sittings > 0 && <MetricCard value={metrics.total_exam_sittings.toString()} label="Exam Sittings" />}
                  {metrics.a_star_a_percentage > 0 && <MetricCard value={`${metrics.a_star_a_percentage}%`} label="A*/A Rate" highlight />}
                  {metrics.pass_rate > 0 && <MetricCard value={`${metrics.pass_rate}%`} label="Pass Rate" highlight />}
                </div>
                {metrics.outstanding_learner_awards > 0 && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-amber-800">{metrics.outstanding_learner_awards} Outstanding Learner Awards</div>
                      {metrics.top_achievements && <div className="text-xs text-amber-700 mt-0.5">{metrics.top_achievements}</div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Qualifications */}
            {qualifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Qualifications</h2>
                <div className="space-y-3">
                  {qualifications.map((q, i) => (
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
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Student Reviews ({t.review_count ?? 0})</h2>
                {t.overall_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">{Number(t.overall_rating).toFixed(1)}</span>
                  </div>
                )}
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="py-4 border-b border-slate-100 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {(r.reviewer_name ?? 'A')[0]}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{r.reviewer_name ?? 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: r.rating ?? 5 }).map((_: unknown, j: number) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                          </div>
                          <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('en-NG')}</span>
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-slate-700 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                {t.hourly_rate_ngn && (
                  <div className="text-center mb-4">
                    <span className="text-2xl font-black text-[#0f3460]">₦{Number(t.hourly_rate_ngn).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm"> / hour</span>
                  </div>
                )}
                <div className="space-y-3 mb-5 text-sm">
                  {t.response_time_hours && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Response time</span>
                      <span className="font-medium text-slate-900">Under {t.response_time_hours}h</span>
                    </div>
                  )}
                  {t.teaching_mode && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Teaching mode</span>
                      <span className="font-medium text-slate-900 capitalize">{t.teaching_mode}</span>
                    </div>
                  )}
                  {t.languages?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Languages</span>
                      <span className="font-medium text-slate-900">{(t.languages as string[]).join(', ')}</span>
                    </div>
                  )}
                  {t.offers_trial_lesson && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trial lesson</span>
                      <span className="font-medium text-emerald-600">Available</span>
                    </div>
                  )}
                </div>

                <Link href={`/book/${id}`} className="block w-full nexora-gradient text-white text-center font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Book a Lesson
                </Link>
                <SendMessageModal
                  tutorName={t.full_name}
                  tutorEmail={t.email}
                  senderName={user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ''}
                  senderEmail={user?.email ?? ''}
                />

                <div className="pt-3 border-t border-slate-100 space-y-2 mt-3">
                  {t.phone && (
                    <a href={`tel:${t.phone}`} className="flex items-center gap-2 text-sm text-[#0f3460] font-medium hover:underline">
                      <Phone className="w-4 h-4 flex-shrink-0" />{t.phone}
                    </a>
                  )}
                  {t.email && (
                    <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-sm text-[#0f3460] font-medium hover:underline">
                      <Mail className="w-4 h-4 flex-shrink-0" />{t.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Profile stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Profile Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Profile views</span><span className="font-medium">{Number(t.profile_views ?? 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Teaching hours</span><span className="font-medium">{Number(t.total_teaching_hours ?? 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Reviews</span><span className="font-medium">{t.review_count ?? 0}</span></div>
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
