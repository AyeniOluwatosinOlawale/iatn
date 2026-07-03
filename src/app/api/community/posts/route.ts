import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('community_posts')
      .select('id, author_name, title, body, subject, curriculum, reply_count, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({ posts: data ?? [] })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}
