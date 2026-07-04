import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    if (error) throw error
    const parents = (data.users ?? [])
      .filter(u => u.user_metadata?.role === 'parent')
      .map(u => ({
        id: u.id,
        email: u.email ?? '',
        full_name: u.user_metadata?.full_name ?? '',
        phone: u.user_metadata?.phone ?? '',
        created_at: u.created_at,
      }))
    return NextResponse.json({ parents })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch parents' }, { status: 500 })
  }
}
