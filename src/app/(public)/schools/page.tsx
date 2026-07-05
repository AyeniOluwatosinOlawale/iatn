import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import SchoolsClient from './SchoolsClient'
import type { SchoolRow } from './SchoolsClient'

export const revalidate = 0

export default async function SchoolsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('schools')
    .select('id, registration_number, school_name, logo_url, state, city, school_type, curricula, founded_year, student_count, a_star_a_rate, university_placement_rate, about, is_verified, overall_rating, review_count')
    .order('overall_rating', { ascending: false }) as { data: SchoolRow[] | null }

  const schools = data ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <SchoolsClient schools={schools} />
      </div>
      <Footer />
    </div>
  )
}
