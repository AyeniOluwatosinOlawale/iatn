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

    // Get tutor record
    const { data: tutor } = await serviceClient
      .from('tutors')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle() as { data: { id: string } | null }

    if (!tutor) return NextResponse.json({ error: 'Tutor profile not found.' }, { status: 403 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() ?? ''
    const resource_type = formData.get('resource_type') as string
    const subject = formData.get('subject') as string
    const curriculum = formData.get('curriculum') as string
    const price_ngn = parseInt(formData.get('price_ngn') as string) || 0

    if (!file || !title) return NextResponse.json({ error: 'Title and file are required.' }, { status: 400 })
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 20MB).' }, { status: 400 })

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop() ?? 'pdf'
    const path = `resources/${tutor.id}/${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await serviceClient.storage
      .from('resources')
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'File upload failed. Please try again.' }, { status: 500 })
    }

    const { data: { publicUrl } } = serviceClient.storage.from('resources').getPublicUrl(path)

    // Save resource record
    const { error: dbError } = await serviceClient.from('resources').insert({
      tutor_id: tutor.id,
      title,
      description,
      resource_type,
      subject,
      curriculum: curriculum.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_'),
      price_ngn,
      file_url: publicUrl,
      file_name: file.name,
      is_published: false,
    })

    if (dbError) {
      console.error('Resource DB insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save resource. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('resource upload error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
