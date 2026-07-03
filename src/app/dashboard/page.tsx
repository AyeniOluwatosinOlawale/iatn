import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const DASHBOARD_MAP: Record<string, string> = {
  tutor:   '/tutor-dashboard/dashboard',
  school:  '/school-dashboard/dashboard',
  parent:  '/parent-dashboard/dashboard',
  student: '/student-dashboard/dashboard',
  admin:   '/admin/dashboard',
}

export default async function DashboardRedirectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const role = user.user_metadata?.role ?? 'student'
  redirect(DASHBOARD_MAP[role] ?? '/student-dashboard/dashboard')
}
