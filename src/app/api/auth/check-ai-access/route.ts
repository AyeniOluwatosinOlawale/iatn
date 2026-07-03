import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const ALLOWED_ROLES = ['student', 'tutor', 'parent', 'school']

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Sign in to verify credentials
    const { createClient: createBrowserClient } = await import('@supabase/supabase-js')
    const authClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({ email, password })
    if (signInError || !signInData.user) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    }

    const userId = signInData.user.id

    // Check role in profiles table (source of truth)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle() as { data: { role: string } | null; error: unknown }

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 403 })
    }

    if (!ALLOWED_ROLES.includes(profile.role)) {
      return NextResponse.json({
        error: `AI Tutor is only available to registered students, tutors, parents, and schools. Your account type (${profile.role}) does not have access.`,
      }, { status: 403 })
    }

    return NextResponse.json({ ok: true, role: profile.role })
  } catch (err) {
    console.error('AI access check error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
