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

    const welcomeMessages: Record<string, string> = {
      Tutor:   'Your tutor profile is under review. Once verified, you\'ll receive your official Nexora registration number and start appearing in search results.',
      School:  'Your school profile is under review. Our team will issue your Nexora School Registration Number within 2–3 business days.',
      Student: 'You can now search for tutors, book lessons, and access study resources. Verify your email to unlock your full dashboard.',
      Parent:  'You can now search for tutors and schools for your child, and monitor their learning progress. Verify your email to get started.',
    }
    const welcomeMsg = welcomeMessages[role] ?? 'Your account is ready. Verify your email to get started.'

    // Send admin notification + welcome email in parallel
    await Promise.all([
      resend.emails.send({
        from:    'Nexora Notifications <notifications@nexora-academic.com>',
        to:      adminEmail,
        subject: `New ${role} registered — ${fullName}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:32px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🎓</div>
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">New Registration</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Nexora Academic Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;text-align:center;">
            <span style="display:inline-block;background:#ede9fe;color:#5b21b6;font-weight:700;font-size:13px;padding:6px 16px;border-radius:999px;letter-spacing:0.5px;">
              ${role.toUpperCase()}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[['Full Name', fullName], ['Email', email], ['Role', role], ['Registered', joinedAt], ['User ID', userId]]
                .map(([l, v]) => `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;"><span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">${l}</span><br><span style="color:#0f172a;font-size:14px;font-weight:500;margin-top:2px;display:block;">${v}</span></td></tr>`).join('')}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <a href="https://supabase.com/dashboard/project/qpllfkmqtcdaveljibgk/auth/users"
               style="display:block;text-align:center;background:linear-gradient(135deg,#0f3460,#7c3aed);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 24px;border-radius:12px;">
              View in Supabase →
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),

      resend.emails.send({
        from:    'Nexora Academic <welcome@nexora-academic.com>',
        to:      email,
        subject: `Welcome to Nexora Academic, ${fullName.split(' ')[0]}! 🎓`,
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
          <td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:40px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">Welcome to Nexora</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Nigeria's International Academic Platform</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 32px 24px;">
            <p style="margin:0 0 16px;color:#0f172a;font-size:18px;font-weight:700;">Hi ${fullName.split(' ')[0]},</p>
            <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
              Your <strong>${role}</strong> account on Nexora Academic has been created successfully.
            </p>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">${welcomeMsg}</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></td></tr>

        <!-- Next steps -->
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 16px;color:#0f172a;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Next Steps</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ['✅', 'Account created', 'Your Nexora account is live'],
                ['📧', 'Verify your email', 'Check your inbox for a confirmation link'],
                ['🚀', 'Get started', 'Log in to your dashboard at nexora-acedamic.com'],
              ].map(([icon, title, desc]) => `
              <tr>
                <td style="padding:10px 0;vertical-align:top;width:36px;font-size:18px;">${icon}</td>
                <td style="padding:10px 0;vertical-align:top;">
                  <strong style="color:#0f172a;font-size:14px;">${title}</strong><br>
                  <span style="color:#64748b;font-size:13px;">${desc}</span>
                </td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:8px 32px 36px;">
            <a href="https://nexora-acedamic.com/login"
               style="display:block;text-align:center;background:linear-gradient(135deg,#0f3460,#7c3aed);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 24px;border-radius:12px;">
              Go to Nexora Academic →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;">
              Nexora Academic · 8 Bode Ajayi Street, Ologuneru, Ibadan, Oyo State, Nigeria<br>
              <a href="https://nexora-acedamic.com" style="color:#7c3aed;text-decoration:none;">nexora-acedamic.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin notify error:', err)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
