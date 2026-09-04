import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { booking } = await req.json();
    const smtpEmail = process.env.SMTP_EMAIL || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = booking?.customer?.email;
    if (!smtpEmail || !smtpPass) return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
    if (!toEmail) return NextResponse.json({ error: 'Customer email is missing' }, { status: 400 });
    const esc = (value: unknown) => String(value ?? '—').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: smtpEmail.replace(/"/g, ''), pass: smtpPass.replace(/"/g, '') } });
    const fare = booking.quote?.result?.finalPrice || booking.quote?.result?.finalFare || 0;
    const rows = [['Pickup', booking.journey?.origin], ['Drop-off', booking.journey?.destination], ['Date', booking.journey?.departureDate], ['Passengers', booking.journey?.passengers]].map(([label, value]) => `<tr><td style="padding:13px 16px;color:#68778a;border-top:1px solid #edf0f3;width:32%">${label}</td><td style="padding:13px 16px;font-weight:700;border-top:1px solid #edf0f3">${esc(value)}</td></tr>`).join('');
    await transporter.sendMail({
      from: { name: 'Carolean Coaches', address: smtpEmail.replace(/"/g, '') }, to: toEmail,
      subject: `Your Quotation from Carolean Coaches (${booking.id})`,
      html: `<div style="margin:0;background:#f3f5f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#172b4d"><div style="max-width:680px;margin:auto;background:#fff;border:1px solid #dfe4ea;box-shadow:0 4px 18px rgba(23,43,77,.08)"><div style="background:#172b4d;padding:24px 32px;border-bottom:5px solid #b42332"><div style="font-size:24px;font-weight:800;letter-spacing:1px;color:#fff">CAROLEAN</div><div style="font-size:11px;letter-spacing:2px;color:#dbe5ef;margin-top:4px">EXECUTIVE COACH TRAVEL</div></div><div style="padding:32px"><div style="border-bottom:1px solid #e5e7eb;padding-bottom:18px"><div style="font-size:11px;color:#68778a;letter-spacing:1px;text-transform:uppercase">Quotation · Reference ${esc(booking.id)}</div><h1 style="font-size:25px;margin:7px 0 0;color:#172b4d">Your journey quotation</h1></div><p style="font-size:15px;margin:26px 0 8px">Dear ${esc(booking.customer?.name)},</p><p style="font-size:14px;line-height:1.6;color:#4b5d73">Thank you for requesting a quotation from Carolean Coaches. Please find your journey details below.</p><div style="border:1px solid #dfe4ea;margin:24px 0"><div style="background:#f5f7fa;padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#68778a">Journey details</div><table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table></div><div style="background:#f8e9eb;border-left:5px solid #b42332;padding:20px 24px;margin:26px 0"><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#68778a">Estimated quotation</div><div style="font-size:34px;font-weight:800;color:#b42332;margin-top:5px">&pound;${Number(fare).toFixed(2)}</div></div><p style="font-size:14px;line-height:1.6;color:#4b5d73">This quotation is subject to availability and final confirmation. Please reply to this email if you have any questions or would like to proceed.</p><p style="font-size:14px;line-height:1.6">Kind regards,<br/><strong>Carolean Coaches Team</strong></p></div><div style="background:#f5f7fa;border-top:1px solid #e5e7eb;padding:18px 32px;font-size:11px;line-height:1.6;color:#68778a">Carolean Coaches · Professional executive travel<br/>Please keep your quotation reference for future correspondence.</div></div></div>`
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send customer quote:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
