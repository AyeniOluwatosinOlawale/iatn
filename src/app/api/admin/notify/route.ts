import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

// Role labels for readable emails
const ROLE_LABELS: Record<string, string> = {
  student:  'Student',
  tutor:    'Tutor',
  parent:   'Parent',
  school:   'School',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Lagos',
  })
}

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const payload = await req.json()

    // Accept both Supabase webhook format { record: {...} } and direct format { email, role, full_name }
    const record = payload.record ?? payload
    const meta   = record.raw_user_meta_data ?? record

    const email     = record.email ?? 'Unknown'
    const role      = ROLE_LABELS[meta.role] ?? meta.role ?? 'Unknown'
    const fullName  = meta.full_name ?? meta.name ?? 'Not provided'
    const joinedAt  = record.created_at ? formatDate(record.created_at) : 'Unknown'
    const userId    = record.id ?? 'N/A'

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('ADMIN_EMAIL not set')
      return NextResponse.json({ error: 'ADMIN_EMAIL not configured' }, { status: 500 })
    }

    await resend.emails.send({
      from:    'Nexora Notifications <notifications@nexora-academic.com>',
      to:      adminEmail,
      subject: `🎉 New ${role} registered on Nexora Academic`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:32px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🎓</div>
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">New Registration</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Nexora Academic Platform</p>
          </td>
        </tr>

        <!-- Role badge -->
        <tr>
          <td style="padding:24px 32px 0;text-align:center;">
            <span style="display:inline-block;background:#ede9fe;color:#5b21b6;font-weight:700;font-size:13px;padding:6px 16px;border-radius:999px;letter-spacing:0.5px;">
              ${role.toUpperCase()}
            </span>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ['Full Name', fullName],
                ['Email Address', email],
                ['Role', role],
                ['Registered', joinedAt],
                ['User ID', userId],
              ].map(([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
                  <br>
                  <span style="color:#0f172a;font-size:14px;font-weight:500;margin-top:2px;display:block;">${value}</span>
                </td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 32px;">
            <a href="https://supabase.com/dashboard/project/qpllfkmqtcdaveljibgk/auth/users"
               style="display:block;text-align:center;background:linear-gradient(135deg,#0f3460,#7c3aed);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 24px;border-radius:12px;">
              View in Supabase Dashboard →
            </a>
            <p style="text-align:center;margin:12px 0 0;font-size:11px;color:#94a3b8;">
              This is an automated alert from Nexora Academic
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin notify error:', err)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
