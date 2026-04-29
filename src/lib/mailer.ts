import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const FROM_NAME = "VisaGuru";
const FROM_EMAIL = process.env.SMTP_USER || "VisaHelper@visaguru.live";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@visaguru.live";

function isConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** Send OTP email to user */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  if (!isConfigured()) {
    console.log(`[MAILER] OTP for ${to}: ${code} (SMTP not configured, email skipped)`);
    return;
  }

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `Your VisaGuru Login Code: ${code}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a2a44; font-size: 24px; margin: 0;">VisaGuru</h1>
          <p style="color: #8896a9; font-size: 13px; margin: 4px 0 0;">Secure Login Verification</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; text-align: center; border: 1px solid #e8ecf0;">
          <p style="color: #5a6a7e; font-size: 14px; margin: 0 0 16px;">Your one-time login code is:</p>
          <div style="background: linear-gradient(135deg, #1a2a44, #2a3a54); color: white; font-size: 32px; letter-spacing: 8px; padding: 16px 24px; border-radius: 12px; font-family: monospace; display: inline-block;">
            ${code}
          </div>
          <p style="color: #8896a9; font-size: 13px; margin: 20px 0 0;">This code expires in <strong>5 minutes</strong>.</p>
          <p style="color: #8896a9; font-size: 12px; margin: 12px 0 0;">If you did not request this code, please ignore this email.</p>
        </div>
        <p style="text-align: center; color: #b0bec5; font-size: 11px; margin: 20px 0 0;">© ${new Date().getFullYear()} VisaGuru · Premium Visa Recovery</p>
      </div>
    `,
  });
}

/** Send notification to admin when a new submission comes in */
export async function sendAdminNotification(submission: {
  email: string;
  visaType: string;
  message?: string;
  whatsapp?: string;
}): Promise<void> {
  if (!isConfigured()) {
    console.log(`[MAILER] Admin notification for ${submission.email} (SMTP not configured, email skipped)`);
    return;
  }

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🆕 New Visa Case Submitted — ${submission.visaType}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8f9fc; border-radius: 16px;">
        <h2 style="color: #1a2a44; font-size: 20px; margin: 0 0 16px;">New Visa Case Submitted</h2>
        <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #e8ecf0;">
          <table style="width: 100%; font-size: 14px; color: #333;">
            <tr><td style="padding: 8px 0; color: #8896a9; width: 120px;">Email</td><td style="padding: 8px 0; font-weight: 600;">${submission.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #8896a9;">Visa Type</td><td style="padding: 8px 0; font-weight: 600;">${submission.visaType}</td></tr>
            ${submission.whatsapp ? `<tr><td style="padding: 8px 0; color: #8896a9;">WhatsApp</td><td style="padding: 8px 0;">${submission.whatsapp}</td></tr>` : ""}
            ${submission.message ? `<tr><td style="padding: 8px 0; color: #8896a9;">Message</td><td style="padding: 8px 0;">${submission.message}</td></tr>` : ""}
          </table>
        </div>
        <p style="color: #8896a9; font-size: 12px; margin: 16px 0 0;">Review this case in the <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard" style="color: #c49b2c;">admin dashboard</a>.</p>
      </div>
    `,
  });
}

/** Send confirmation email to the user after form submission */
export async function sendUserConfirmation(to: string, visaType: string): Promise<void> {
  if (!isConfigured()) {
    console.log(`[MAILER] User confirmation for ${to} (SMTP not configured, email skipped)`);
    return;
  }

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: "We received your visa analysis request — VisaGuru",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a2a44; font-size: 24px; margin: 0;">VisaGuru</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e8ecf0;">
          <h2 style="color: #1a2a44; font-size: 18px; margin: 0 0 12px;">We received your request! ✅</h2>
          <p style="color: #5a6a7e; font-size: 14px; line-height: 1.6;">
            Thank you for choosing VisaGuru. Our consultant will analyze your <strong>${visaType}</strong> visa case and send you a detailed strategy within <strong>2 hours</strong>.
          </p>
          <div style="margin: 20px 0; padding: 16px; background: #eff9f4; border-radius: 10px; border: 1px solid #d6efe5;">
            <p style="color: #1a7a4f; font-size: 13px; margin: 0;"><strong>What happens next?</strong></p>
            <ul style="color: #5a6a7e; font-size: 13px; margin: 8px 0 0; padding-left: 18px; line-height: 1.8;">
              <li>Our expert will review your case details</li>
              <li>You'll receive a personalized recovery strategy</li>
              <li>We'll suggest next steps for your reapplication</li>
            </ul>
          </div>
          <p style="color: #5a6a7e; font-size: 14px;">
            Need faster help? <a href="https://wa.me/919887678900?text=Hi%20VisaGuru,%20I%20submitted%20a%20case" style="color: #25D366; font-weight: 600;">Chat on WhatsApp →</a>
          </p>
        </div>
        <p style="text-align: center; color: #b0bec5; font-size: 11px; margin: 20px 0 0;">© ${new Date().getFullYear()} VisaGuru · Premium Visa Recovery</p>
      </div>
    `,
  });
}
