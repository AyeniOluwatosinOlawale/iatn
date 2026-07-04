import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: users, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    if (error) throw error

    const all = users.users ?? []
    const count = (role: string) => all.filter(u => u.user_metadata?.role === role).length

    const mapUser = (u: typeof all[0]) => ({
      id: u.id,
      email: u.email ?? 'unknown',
      role: u.user_metadata?.role ?? 'unknown',
      full_name: u.user_metadata?.full_name ?? '',
      phone: u.user_metadata?.phone ?? '',
      created_at: u.created_at,
    })

    const sorted = [...all].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      total: all.length,
      students: count('student'),
      tutors: count('tutor'),
      parents: count('parent'),
      schools: count('school'),
      recent: sorted.slice(0, 20).map(mapUser),
      all: sorted.map(mapUser),
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
