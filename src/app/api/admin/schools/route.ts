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
    const { data, error } = await supabase
      .from('schools')
      .select('id, user_id, school_name, email, phone, city, state, address, school_type, curricula, founded_year, student_count, about, website, is_verified, verification_status, registration_number, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ schools: data ?? [] })
  } catch (err) {
    console.error('Admin schools error:', err)
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { school_id, verified, password, email, name } = await req.json()
    if (password !== process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = serviceClient()
    const { error } = await supabase
      .from('schools')
      .update({ is_verified: verified, verification_status: verified ? 'verified' : 'pending' })
      .eq('id', school_id)

    if (error) throw error

    if (verified && email) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const firstName = (name ?? 'School').split(' ')[0]
      await resend.emails.send({
        from: 'Nexora Academic <welcome@nexora-academic.com>',
        to: email,
        subject: `🎉 Your Nexora School Profile is Verified!`,
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:40px 32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🎉</div>
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;">School Verified!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Nexora Academic</p>
        </td></tr>
        <tr><td style="padding:36px 32px;">
          <p style="margin:0 0 16px;color:#0f172a;font-size:18px;font-weight:700;">Hi ${firstName},</p>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
            Your school profile on Nexora Academic has been <strong style="color:#059669;">verified</strong> by our team.
          </p>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
            Your school now appears in the Nexora schools directory with a <strong>✓ Verified School</strong> badge.
          </p>
          <a href="https://nexora-acedamic.com/school-dashboard/dashboard"
             style="display:block;text-align:center;background:linear-gradient(135deg,#0f3460,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 24px;border-radius:12px;">
            Go to School Dashboard →
          </a>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:12px;">Nexora Academic · nexora-acedamic.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
      }).catch(e => console.error('School approval email error:', e))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin verify school error:', err)
    return NextResponse.json({ error: 'Failed to update school' }, { status: 500 })
  }
}
