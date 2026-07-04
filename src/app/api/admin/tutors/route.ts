import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET() {
  try {
    const supabase = serviceClient()

    const { data: tutors, error } = await supabase
      .from('tutors')
      .select('id, user_id, full_name, email, phone, city, state, bio, years_experience, teaching_mode, current_institution, is_verified, verification_status, registration_number, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    const ids = (tutors ?? []).map((t: { id: string }) => t.id)

    const [subjectsRes, qualsRes] = await Promise.all([
      ids.length > 0
        ? supabase.from('tutor_subjects').select('tutor_id, subject, curriculum, proficiency_level').in('tutor_id', ids)
        : { data: [] },
      ids.length > 0
        ? supabase.from('tutor_qualifications').select('tutor_id, qualification_type, institution, field_of_study, year_obtained').in('tutor_id', ids)
        : { data: [] },
    ])

    const subjects = subjectsRes.data ?? []
    const quals = qualsRes.data ?? []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enriched = (tutors ?? []).map((t: any) => ({
      ...t,
      subjects: subjects.filter((s: { tutor_id: string }) => s.tutor_id === t.id),
      qualifications: quals.filter((q: { tutor_id: string }) => q.tutor_id === t.id),
    }))

    return NextResponse.json({ tutors: enriched })
  } catch (err) {
    console.error('Admin tutors error:', err)
    return NextResponse.json({ error: 'Failed to fetch tutors' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { tutor_id, verified, password, email, name } = await req.json()
    if (password !== process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = serviceClient()

    const { error } = await supabase
      .from('tutors')
      .update({ is_verified: verified, verification_status: verified ? 'verified' : 'pending' })
      .eq('id', tutor_id)

    if (error) throw error

    // Send approval email
    if (verified && email) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const firstName = (name ?? 'Tutor').split(' ')[0]
      await resend.emails.send({
        from: 'Nexora Academic <welcome@nexora-academic.com>',
        to: email,
        subject: `🎉 Your Nexora Tutor Profile is Verified!`,
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:40px 32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🎉</div>
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;">You're Verified!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Nexora Academic Tutor</p>
        </td></tr>
        <tr><td style="padding:36px 32px;">
          <p style="margin:0 0 16px;color:#0f172a;font-size:18px;font-weight:700;">Hi ${firstName},</p>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
            Great news! Your Nexora tutor profile has been <strong style="color:#059669;">verified</strong> by our team.
          </p>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
            You now have a <strong>✓ Verified Tutor</strong> badge on your profile and will appear in search results for students and parents looking for tutors.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">What's next:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
              <li>Your profile is now live in the tutor directory</li>
              <li>Students can find and book sessions with you</li>
              <li>Complete your profile to attract more students</li>
            </ul>
          </div>
          <a href="https://nexora-acedamic.com/tutor-dashboard/dashboard"
             style="display:block;text-align:center;background:linear-gradient(135deg,#0f3460,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 24px;border-radius:12px;">
            Go to My Dashboard →
          </a>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:12px;">Nexora Academic · nexora-acedamic.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
      }).catch(e => console.error('Approval email error:', e))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin verify tutor error:', err)
    return NextResponse.json({ error: 'Failed to update tutor' }, { status: 500 })
  }
}
