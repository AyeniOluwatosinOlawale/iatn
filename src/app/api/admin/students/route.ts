import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data, error } = await supabase
      .from('students')
      .select('id, user_id, full_name, email, phone, state, city, current_school, year_group, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ students: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}
