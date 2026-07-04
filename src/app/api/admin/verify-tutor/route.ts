import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify caller is admin
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle() as { data: { role: string } | null }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { tutor_id, verified } = await req.json()
    if (!tutor_id) return NextResponse.json({ error: 'Missing tutor_id' }, { status: 400 })

    const { error } = await serviceClient
      .from('tutors')
      .update({
        is_verified: verified,
        verification_status: verified ? 'verified' : 'pending',
      })
      .eq('id', tutor_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('verify-tutor error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
