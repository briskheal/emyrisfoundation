import nodemailer from 'nodemailer';

/**
 * Zoho Mail SMTP transporter
 * Uses environment variables set in Coolify
 */
// Transporters are now initialized dynamically inside each function

/**
 * Secondary Zoho Mail SMTP transporter for Career emails
 * Uses ZOHO_CAREER_USER and ZOHO_CAREER_PASS if available
 */
// Transporters are now initialized dynamically inside each function

/**
 * Send a contact form email to contact@emyrisfoundation.com
 */
export async function sendContactEmail({ firstName, lastName, email, phone, subject, message }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });
  // 1. Send to Admin
  const adminPromise = transporter.sendMail({
    from: `"Emyris Foundation" <${process.env.ZOHO_USER}>`,
    to: 'contact@emyrisfoundation.com',
    replyTo: email,
    subject: `[Contact Form] ${subject || 'New Enquiry'} - ${firstName} ${lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Subject</td><td style="padding: 8px 0;">${subject || 'N/A'}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #f97316; border-radius: 4px;">
            <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 16px; color: #999; font-size: 0.85rem;">Sent from emyrisfoundation.com</p>
        </div>
      </div>`,
  });

  // 2. Send Auto-reply to User
  const userPromise = transporter.sendMail({
    from: `"Emyris Foundation" <${process.env.ZOHO_USER}>`,
    to: email,
    subject: `Thank you for contacting Emyris Foundation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <p>Dear ${firstName},</p>
        <p>Thank you for reaching out to Emyris Foundation! We have successfully received your message regarding "${subject || 'your enquiry'}".</p>
        <p>Our team will review your message and get back to you as soon as possible.</p>
        <p>Best Regards,<br><strong>Emyris Foundation Team</strong></p>
      </div>`,
  });

  return Promise.allSettled([adminPromise, userPromise]);
}

/**
 * Send a career/internship/volunteer application email to career@emyrisfoundation.com
 */
export async function sendCareerEmail({ type, name, email, phone, position, details, attachment }) {
  const careerTransporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_CAREER_USER || process.env.ZOHO_CARRER_USER || process.env.ZOHO_USER,
      pass: process.env.ZOHO_CAREER_PASS || process.env.ZOHO_CARRER_PASS || process.env.ZOHO_PASS,
    },
  });
  const typeLabel = { job: 'Job Application', internship: 'Internship Application', volunteer: 'Volunteer Registration' }[type] || type;
  
  const senderEmail = process.env.ZOHO_CAREER_USER || process.env.ZOHO_CARRER_USER || process.env.ZOHO_USER;

  const mailOptions = {
    from: `"Emyris Careers" <${senderEmail}>`,
    to: 'career@emyrisfoundation.com',
    replyTo: email,
    subject: `[${typeLabel}] ${position || type} - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15F5BA, #059669); padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New ${typeLabel}</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || 'N/A'}</td></tr>
            ${position ? `<tr><td style="padding: 8px 0; color: #666;">Position</td><td style="padding: 8px 0;">${position}</td></tr>` : ''}
          </table>
          ${details ? `<div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #059669; border-radius: 4px; white-space: pre-wrap; color: #333; line-height: 1.6;">${details}</div>` : ''}
          <p style="margin-top: 16px; color: #999; font-size: 0.85rem;">Sent from emyrisfoundation.com</p>
        </div>
      </div>`,
  };

  if (attachment) {
    mailOptions.attachments = [attachment];
  }

  const adminPromise = careerTransporter.sendMail(mailOptions);

  // 2. Send Auto-reply to Applicant
  const userPromise = careerTransporter.sendMail({
    from: `"Emyris Careers" <${senderEmail}>`,
    to: email,
    subject: `Your ${typeLabel} has been received!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <p>Dear ${name},</p>
        <p>Thank you for expressing your interest in joining Emyris Foundation! We have successfully received your ${typeLabel}.</p>
        <p>Our team will carefully review your application. If your profile matches our current requirements, we will get back to you with the next steps.</p>
        <p>We appreciate your desire to make an impact!</p>
        <br>
        <p>Warm Regards,<br><strong>Emyris Foundation Team</strong></p>
      </div>`,
  });

  return Promise.allSettled([adminPromise, userPromise]);
}

/**
 * Send a campaign consent registration email
 */
export async function sendCampaignEmail({ campaign, name, email, phone }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });
  // 1. Send to Admin
  const adminPromise = transporter.sendMail({
    from: `"Emyris Foundation" <${process.env.ZOHO_USER}>`,
    to: 'contact@emyrisfoundation.com',
    replyTo: email || undefined,
    subject: `[Campaign Registration] ${campaign} - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">Campaign Registration</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 130px;">Campaign</td><td style="padding: 8px 0; font-weight: bold;">${campaign}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || 'N/A'}</td></tr>
          </table>
          <p style="margin-top: 16px; color: #999; font-size: 0.85rem;">Sent from emyrisfoundation.com</p>
        </div>
      </div>`,
  });

  // 2. Send Auto-reply to User (if email provided)
  let userPromise = Promise.resolve();
  if (email) {
    userPromise = transporter.sendMail({
      from: `"Emyris Foundation" <${process.env.ZOHO_USER}>`,
      to: email,
      subject: `Thank you for registering for ${campaign}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <p>Dear ${name},</p>
          <p>Thank you for expressing your interest and registering for the <strong>${campaign}</strong> campaign.</p>
          <p>We have safely received your details and our team will keep you updated.</p>
          <p>Best Regards,<br><strong>Emyris Foundation Team</strong></p>
        </div>`,
    });
  }

  return Promise.allSettled([adminPromise, userPromise]);
}
