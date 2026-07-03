import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const CURRICULUM_MAP: Record<string, string> = {
  'Cambridge IGCSE': 'igcse',
  'Cambridge A-Level': 'a_level',
  'Edexcel': 'edexcel',
  'IB Diploma': 'ib',
  'JAMB / UTME': 'jamb',
  'WAEC / WASSCE': 'neco',
  'SAT': 'sat',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, body, subject, curriculum } = await req.json() as {
    title?: string
    body?: string
    subject?: string
    curriculum?: string
  }
  if (!title || !body) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const author_name = (user.user_metadata?.full_name as string | undefined) ?? user.email?.split('@')[0] ?? 'Anonymous'
  const curriculumValue = curriculum ? (CURRICULUM_MAP[curriculum] ?? null) : null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase as any).from('community_posts').insert({
    author_id: user.id,
    author_name,
    title,
    body,
    subject: subject || null,
    curriculum: curriculumValue,
    is_published: true,
  }).select('id').single()) as { data: { id: string } | null; error: unknown }

  if (error) return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  return NextResponse.json({ id: data!.id })
}
