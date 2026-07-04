import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import TutorsClient from './TutorsClient'

export default async function TutorsSearchPage() {
  const supabase = await createClient()

  // Fetch all tutors with their subjects and badges
  const { data: tutorsRaw } = await supabase
    .from('tutors')
    .select(`
      id, full_name, city, state, years_experience, teaching_mode,
      hourly_rate_ngn, overall_rating, review_count, is_verified,
      offers_trial_lesson, bio, photo_url, registration_number
    `)
    .order('overall_rating', { ascending: false })

  const tutors = tutorsRaw ?? []
  const tutorIds = tutors.map((t: { id: string }) => t.id)

  // Fetch subjects and badges for all tutors
  const [subjectsRes, badgesRes] = await Promise.all([
    tutorIds.length > 0
      ? supabase.from('tutor_subjects').select('tutor_id, subject, curriculum').in('tutor_id', tutorIds)
      : { data: [] },
    tutorIds.length > 0
      ? supabase.from('tutor_badges').select('tutor_id, badge_type').in('tutor_id', tutorIds)
      : { data: [] },
  ])

  const subjects = subjectsRes.data ?? []
  const badges = badgesRes.data ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = tutors.map((t: any) => ({
    ...t,
    subjects: subjects.filter((s: { tutor_id: string }) => s.tutor_id === t.id),
    badges: badges.filter((b: { tutor_id: string }) => b.tutor_id === t.id),
    // If no badges but verified, add default badge
    effectiveBadges: badges.filter((b: { tutor_id: string }) => b.tutor_id === t.id).length > 0
      ? badges.filter((b: { tutor_id: string }) => b.tutor_id === t.id).map((b: { badge_type: string }) => b.badge_type)
      : t.is_verified ? ['verified_tutor'] : [],
  }))

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <TutorsClient tutors={enriched} />
      <Footer />
    </div>
  )
}
