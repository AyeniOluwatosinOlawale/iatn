import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function MyTutorProfileRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle() as { data: { id: string } | null; error: unknown }

  if (!data) redirect('/tutor-dashboard/dashboard')

  redirect(`/tutors/${data.id}`)
}
