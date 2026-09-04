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

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: smtpEmail.replace(/"/g, ''), pass: smtpPass.replace(/"/g, '') }
    });
    const fare = booking.quote?.result?.finalPrice || booking.quote?.result?.finalFare || 0;
    await transporter.sendMail({
      from: { name: 'Carolean Coaches', address: smtpEmail.replace(/"/g, '') },
      to: toEmail,
      subject: `Your Quotation from Carolean Coaches (${booking.id})`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px"><h2 style="color:#1e293b">Your Quotation Request</h2><p>Dear ${booking.customer?.name},</p><p>Thank you for requesting a quotation from Carolean Coaches.</p><ul><li><strong>Reference:</strong> ${booking.id}</li><li><strong>Pickup:</strong> ${booking.journey?.origin}</li><li><strong>Drop-off:</strong> ${booking.journey?.destination}</li><li><strong>Date:</strong> ${booking.journey?.departureDate}</li><li><strong>Passengers:</strong> ${booking.journey?.passengers}</li><li><strong>Quotation:</strong> £${Number(fare).toFixed(2)}</li></ul><p>Best regards,<br/>Carolean Coaches Team</p></div>`
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send customer quote:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
