import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const CURRICULUM_MAP: Record<string, string> = {
  'Cambridge IGCSE':  'igcse',
  'Cambridge A-Level':'a_level',
  'Edexcel IGCSE':    'edexcel',
  'Edexcel A-Level':  'edexcel',
  'IB Diploma':       'ib',
  'JAMB / UTME':      'jamb',
  'WAEC / WASSCE':    'neco',
  'NECO':             'neco',
  'SAT':              'sat',
  'OxfordAQA':        'oxfordaqa',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, role } = body
    if (!user_id || !role) return NextResponse.json({ error: 'Missing user_id or role' }, { status: 400 })

    const validRoles = ['student', 'parent', 'school', 'tutor', 'admin']
    if (!validRoles.includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user_id, role })
      .select()
      .single()

    if (profileError && profileError.code !== '23505') {
      console.error('Profile create error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // For school role: also create the schools table record
    if (role === 'school') {
      const { data: { user } } = await supabase.auth.admin.getUserById(user_id)
      const meta = user?.user_metadata ?? {}

      // Map display curricula labels to DB enum values, deduplicate
      const rawCurricula: string[] = Array.isArray(meta.curricula) ? meta.curricula : []
      const seen = new Set<string>()
      const mappedCurricula = rawCurricula
        .map(c => CURRICULUM_MAP[c] ?? null)
        .filter((v): v is string => v !== null && !seen.has(v) && seen.add(v) !== undefined)

      const schoolPayload = {
        user_id,
        school_name: meta.school_name ?? meta.full_name ?? 'Unknown School',
        email: user?.email ?? '',
        phone: meta.phone ?? null,
        state: meta.state ?? '',
        city: meta.city ?? null,
        address: meta.address ?? null,
        website: meta.website ?? null,
        school_type: (meta.school_type ?? 'private').toLowerCase(),
        curricula: mappedCurricula.length > 0 ? mappedCurricula : null,
        founded_year: meta.founded_year ? parseInt(meta.founded_year) : null,
        student_count: meta.student_count ? parseInt(meta.student_count) : null,
        about: meta.about ?? null,
      }

      const { error: schoolError } = await supabase
        .from('schools')
        .insert(schoolPayload)

      if (schoolError && schoolError.code !== '23505') {
        console.error('School record create error:', schoolError)
        // Don't fail the whole request — profile was created
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Profile create exception:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
