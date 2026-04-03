'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(leadId: string, leadName: string, leadEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'admin@empathymanor.com',
      to: [leadEmail],
      subject: 'Your Account at Empathy Manor is Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #1a1a1a;">Welcome to Empathy Manor, ${leadName}</h2>
          <p>We are pleased to inform you that your application for our real estate arbitrage program has been approved.</p>
          <p>As a valued partner, you now have full access to our exclusive deal room and high-ticket real estate opportunities.</p>
          <p>You can access your personalized dashboard and review available properties using your secure portal link below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://empathymanor.com/portal/${leadId}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Your Portal</a>
          </div>
          <p>If the button above does not work, please copy and paste this URL into your browser:</p>
          <p><a href="https://empathymanor.com/portal/${leadId}" style="color: #0066cc;">https://empathymanor.com/portal/${leadId}</a></p>
          <p>We look forward to a successful partnership.</p>
          <br/>
          <p>Warm regards,<br/>
          <strong>Managing Partner</strong><br/>
          Empathy Manor</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending approval email via Resend:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send approval email:', error);
    throw error;
  }
}
