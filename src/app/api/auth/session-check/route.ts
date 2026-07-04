import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const ALLOWED_ROLES = ['student', 'tutor', 'parent', 'school', 'admin']

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ ok: false })

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: profile } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle() as { data: { role: string } | null }

    if (!profile || !ALLOWED_ROLES.includes(profile.role)) {
      return NextResponse.json({ ok: false })
    }

    return NextResponse.json({ ok: true, role: profile.role })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
