import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { user_id, role } = await req.json()
    if (!user_id || !role) return NextResponse.json({ error: 'Missing user_id or role' }, { status: 400 })

    const validRoles = ['student', 'parent', 'school', 'tutor', 'admin']
    if (!validRoles.includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { error } = await supabase.from('profiles').insert({ id: user_id, role }).select().single()

    if (error && error.code !== '23505') { // 23505 = unique violation (already exists)
      console.error('Profile create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Profile create exception:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
