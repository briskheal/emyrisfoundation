import nodemailer from 'nodemailer';

/**
 * Zoho Mail SMTP transporter
 * Uses environment variables set in Coolify
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',         // Zoho India server (use smtp.zoho.com for global)
  port: 465,
  secure: true,                  // SSL
  auth: {
    user: process.env.ZOHO_USER, // e.g. contact@emyrisfoundation.com
    pass: process.env.ZOHO_PASS, // App-specific password from Zoho
  },
});

/**
 * Send a contact form email to contact@emyrisfoundation.com
 */
export async function sendContactEmail({ firstName, lastName, email, phone, subject, message }) {
  return transporter.sendMail({
    from: `"Emyris Foundation Website" <${process.env.ZOHO_USER}>`,
    to: 'contact@emyrisfoundation.com',
    replyTo: email,
    subject: `[Contact Form] ${subject || 'New Enquiry'} — ${firstName} ${lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">📬 New Contact Form Submission</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Subject</td><td style="padding: 8px 0;">${subject || '—'}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #f97316; border-radius: 4px;">
            <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 16px; color: #999; font-size: 0.85rem;">Sent from emyrisfoundation.com Contact Form</p>
        </div>
      </div>`,
  });
}

/**
 * Send a career/internship/volunteer application email to career@emyrisfoundation.com
 */
export async function sendCareerEmail({ type, name, email, phone, position, details }) {
  const typeLabel = { job: 'Job Application', internship: 'Internship Application', volunteer: 'Volunteer Registration' }[type] || type;
  return transporter.sendMail({
    from: `"Emyris Foundation Website" <${process.env.ZOHO_USER}>`,
    to: 'career@emyrisfoundation.com',
    replyTo: email,
    subject: `[${typeLabel}] ${position || type} — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15F5BA, #059669); padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">🎯 New ${typeLabel}</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || '—'}</td></tr>
            ${position ? `<tr><td style="padding: 8px 0; color: #666;">Position</td><td style="padding: 8px 0;">${position}</td></tr>` : ''}
          </table>
          ${details ? `<div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #059669; border-radius: 4px; white-space: pre-wrap; color: #333; line-height: 1.6;">${details}</div>` : ''}
          <p style="margin-top: 16px; color: #999; font-size: 0.85rem;">Sent from emyrisfoundation.com</p>
        </div>
      </div>`,
  });
}

/**
 * Send a campaign consent registration email
 */
export async function sendCampaignEmail({ campaign, name, email, phone }) {
  return transporter.sendMail({
    from: `"Emyris Foundation Website" <${process.env.ZOHO_USER}>`,
    to: 'contact@emyrisfoundation.com',
    replyTo: email || undefined,
    subject: `[Campaign Registration] ${campaign} — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">📋 Campaign Registration</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 130px;">Campaign</td><td style="padding: 8px 0; font-weight: bold;">${campaign}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || '—'}</td></tr>
          </table>
          <p style="margin-top: 16px; color: #999; font-size: 0.85rem;">Sent from emyrisfoundation.com</p>
        </div>
      </div>`,
  });
}
