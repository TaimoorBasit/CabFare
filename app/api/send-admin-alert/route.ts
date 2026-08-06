import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { booking } = await req.json();

    const smtpEmail = process.env.SMTP_EMAIL || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpEmail;

    if (!smtpEmail || !smtpPass) {
      console.error('SMTP credentials missing in environment variables.');
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

    const fromEmail = (smtpFrom || smtpEmail).replace(/^"|"$/g, '');
    const adminEmail = smtpEmail.replace(/"/g, ''); // default admin notification email

    const subject = `New Quotation Request: ${booking.customer?.name} (${booking.id})`;
    const html = `
      <h2>New Quotation Request</h2>
      <p>A new quotation request has been submitted.</p>
      <ul>
        <li><strong>Ref ID:</strong> ${booking.id}</li>
        <li><strong>Customer:</strong> ${booking.customer?.name} (${booking.customer?.email} - ${booking.customer?.phone})</li>
        <li><strong>Origin:</strong> ${booking.journey?.origin}</li>
        <li><strong>Destination:</strong> ${booking.journey?.destination}</li>
        <li><strong>Date:</strong> ${booking.journey?.departureDate}</li>
        <li><strong>Passengers:</strong> ${booking.journey?.passengers}</li>
      </ul>
      <p>Log in to the Admin Dashboard to review and send the quote.</p>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send admin notification:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
