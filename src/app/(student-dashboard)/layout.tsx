import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNavbar from '@/components/shared/DashboardNavbar'

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const userName = meta.full_name ?? meta.name ?? 'Student'

  return (
    <>
      <DashboardNavbar role="student" userName={userName} />
      <main>{children}</main>
    </>
  )
}
