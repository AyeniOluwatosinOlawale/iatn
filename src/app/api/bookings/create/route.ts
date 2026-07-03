import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const {
      tutor_id, student_user_id, subject, curriculum,
      lesson_type, start_time, end_time, notes, amount_ngn,
    } = await req.json()

    if (!tutor_id || !student_user_id || !subject || !start_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the student record id (students table) from user_id
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', student_user_id)
      .maybeSingle() as { data: { id: string } | null; error: unknown }

    const { error } = await supabase.from('bookings').insert({
      tutor_id,
      student_id: student?.id ?? null,
      subject,
      curriculum,
      lesson_type,
      start_time,
      end_time,
      notes: notes || null,
      amount_ngn: amount_ngn || null,
      status: 'pending',
      payment_status: 'unpaid',
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Booking create error:', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
