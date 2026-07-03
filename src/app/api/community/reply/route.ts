import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { post_id, body } = await req.json() as {
    post_id?: string
    body?: string
  }
  if (!post_id || !body) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (body.trim().length < 5) return NextResponse.json({ error: 'Reply too short' }, { status: 400 })

  const author_name = (user.user_metadata?.full_name as string | undefined) ?? user.email?.split('@')[0] ?? 'Anonymous'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase as any).from('community_replies').insert({
    post_id,
    author_id: user.id,
    author_name,
    body: body.trim(),
    is_published: true,
  }).select('id').single()) as { data: { id: string } | null; error: unknown }

  if (error) return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 })
  return NextResponse.json({ id: data!.id })
}
