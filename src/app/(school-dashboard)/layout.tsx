import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNavbar from '@/components/shared/DashboardNavbar'

export default async function SchoolDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const userName = meta.school_name ?? meta.full_name ?? 'School'

  return (
    <>
      <DashboardNavbar role="school" userName={userName} />
      <main>{children}</main>
    </>
  )
}
