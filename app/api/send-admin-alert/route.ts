import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { booking } = await req.json();

    const smtpEmail = process.env.SMTP_EMAIL || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    console.log('[send-admin-alert] SMTP_EMAIL present:', !!smtpEmail);
    console.log('[send-admin-alert] SMTP_PASS present:', !!smtpPass);
    console.log('[send-admin-alert] Booking ID:', booking?.id);

    if (!smtpEmail || !smtpPass) {
      console.error('[send-admin-alert] SMTP credentials missing in environment variables.');
      return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpEmail.replace(/"/g, ''),
        pass: smtpPass.replace(/"/g, ''),
      },
    });

    const fromAddress = smtpEmail.replace(/"/g, '');
    const adminEmail = smtpEmail.replace(/"/g, ''); // default admin notification email
    const esc = (value: unknown) => String(value ?? '—').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

    const subject = `New Quotation Request: ${booking.customer?.name} (${booking.id})`;
    const html = `
      <div style="background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#172554">
        <div style="max-width:680px;margin:auto;background:#fff;border:1px solid #dbe3ef;border-top:4px solid #e21d2b">
          <div style="padding:22px 28px;border-bottom:1px solid #e5eaf1">
            <div style="font-size:25px;font-weight:800;letter-spacing:2px;color:#172554">CAROLEAN</div>
            <div style="font-size:11px;letter-spacing:2px;color:#e21d2b;font-weight:700;margin-top:4px">COACHES · EXECUTIVE TRAVEL</div>
          </div>
          <div style="padding:28px">
            <div style="font-size:11px;letter-spacing:1.5px;color:#e21d2b;font-weight:700">NEW QUOTATION REQUEST</div>
            <h1 style="font-size:25px;margin:8px 0 4px;color:#172554">Review a new booking</h1>
            <p style="color:#52627a;margin:0 0 22px">A customer has submitted a quotation request through the Carolean Coaches website.</p>
            <div style="background:#f4f7fb;border:1px solid #dbe3ef;padding:14px 16px;margin-bottom:18px"><span style="font-size:11px;color:#697993;letter-spacing:1px">BOOKING REFERENCE</span><br><strong style="font-size:20px;color:#172554">${esc(booking.id)}</strong></div>
            <table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:9px 0;border-bottom:1px solid #edf1f6;color:#697993">Customer</td><td style="padding:9px 0;border-bottom:1px solid #edf1f6;text-align:right;font-weight:700">${esc(booking.customer?.name)}</td></tr><tr><td style="padding:9px 0;border-bottom:1px solid #edf1f6;color:#697993">Email / phone</td><td style="padding:9px 0;border-bottom:1px solid #edf1f6;text-align:right">${esc(booking.customer?.email)}<br>${esc(booking.customer?.phone)}</td></tr><tr><td style="padding:9px 0;border-bottom:1px solid #edf1f6;color:#697993">Journey</td><td style="padding:9px 0;border-bottom:1px solid #edf1f6;text-align:right">${esc(booking.journey?.origin)} → ${esc(booking.journey?.destination)}</td></tr><tr><td style="padding:9px 0;color:#697993">Date / passengers</td><td style="padding:9px 0;text-align:right">${esc(booking.journey?.departureDate)}<br>${esc(booking.journey?.passengers)} passengers</td></tr></table>
            <p style="margin:24px 0 0;color:#52627a">Log in to the Admin Dashboard to review the route, calculate the fare, and send the customer quotation.</p>
          </div>
          <div style="padding:16px 28px;background:#172554;color:#dbe3ef;font-size:11px">Carolean Coaches · Premium travel solutions<br>This is an automated notification.</div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: {
        name: 'Carolean Coaches',
        address: fromAddress
      },
      to: adminEmail,
      subject,
      html,
    });

    console.log('[send-admin-alert] Email sent successfully to:', adminEmail);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send admin notification:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
