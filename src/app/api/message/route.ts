import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { tutor_email, tutor_name, sender_name, sender_email, sender_phone, message } = await req.json()

    if (!tutor_email || !sender_name || !sender_email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    await Promise.all([
      // Email to tutor
      resend.emails.send({
        from: 'Nexora Academic <notifications@nexora-academic.com>',
        to: tutor_email,
        replyTo: sender_email,
        subject: `New message from ${sender_name} on Nexora`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">New Message on Nexora</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 8px;color:#0f172a;font-size:15px;font-weight:700;">Hi ${tutor_name.split(' ')[0]},</p>
            <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
              You have a new message from <strong>${sender_name}</strong> via your Nexora Academic profile.
            </p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px;">
              <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
                <span style="color:#64748b;font-size:12px;">From</span><br>
                <span style="color:#0f172a;font-size:14px;font-weight:500;">${sender_name}</span>
              </td></tr>
              <tr><td style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
                <span style="color:#64748b;font-size:12px;">Email</span><br>
                <a href="mailto:${sender_email}" style="color:#7c3aed;font-size:14px;font-weight:500;">${sender_email}</a>
              </td></tr>
              ${sender_phone ? `<tr><td style="padding:6px 0;">
                <span style="color:#64748b;font-size:12px;">Phone</span><br>
                <span style="color:#0f172a;font-size:14px;font-weight:500;">${sender_phone}</span>
              </td></tr>` : ''}
            </table>
            <p style="margin:20px 0 0;color:#94a3b8;font-size:12px;">
              Reply directly to this email to respond to ${sender_name}.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:11px;">Nexora Academic · nexora-academic.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),

      // Confirmation to sender
      resend.emails.send({
        from: 'Nexora Academic <notifications@nexora-academic.com>',
        to: sender_email,
        subject: `Your message to ${tutor_name} was sent`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#0f3460,#7c3aed);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">Message Sent!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;color:#0f172a;font-size:15px;font-weight:700;">Hi ${sender_name.split(' ')[0]},</p>
            <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">
              Your message has been delivered to <strong>${tutor_name}</strong>. They will typically respond within 24 hours.
            </p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;">
              <p style="margin:0;color:#166534;font-size:13px;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:11px;">Nexora Academic · nexora-academic.com</p>
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
    console.error('Message send error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
