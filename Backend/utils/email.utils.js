const nodemailer = require("nodemailer");

/**
 * Creates a Nodemailer transporter.
 * Uses environment SMTP config if available, falls back to Ethereal (test) accounts.
 */
async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: create a one-time Ethereal test account for development
  const testAccount = await nodemailer.createTestAccount();
  console.log("[Email] Using Ethereal test account:", testAccount.user);

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Send an email with login credentials to a newly created Admin or HOD.
 * @param {object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.name - Recipient full name
 * @param {string} params.role - User role ("admin" | "hod" | "faculty")
 * @param {string} params.password - Plain-text password (before hashing)
 */
async function sendCredentialsEmail({ to, name, role, password }) {
  try {
    const transporter = await getTransporter();

    const mailOptions = {
      from: `"CEMS System" <${process.env.SMTP_USER || "noreply@cems.edu"}>`,
      to,
      subject: "Your CEMS Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #3b82f6;">Welcome to CEMS!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your account has been created on the <strong>College Events Management System (CEMS)</strong> with the role of <strong>${role.toUpperCase()}</strong>.</p>
          <p>Here are your login credentials:</p>
          <table style="width:100%; border-collapse:collapse; margin: 15px 0;">
            <tr style="background:#f3f4f6;">
              <td style="padding:8px 12px; font-weight:bold; border:1px solid #e0e0e0;">Email</td>
              <td style="padding:8px 12px; border:1px solid #e0e0e0;">${to}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px; font-weight:bold; border:1px solid #e0e0e0;">Password</td>
              <td style="padding:8px 12px; border:1px solid #e0e0e0;">${password}</td>
            </tr>
          </table>
          <p style="color: #ef4444;"><strong>⚠️ Please log in and change your password immediately.</strong></p>
          <p>Login at: <a href="${process.env.BASE_URL || "http://localhost:5173"}">${process.env.BASE_URL || "http://localhost:5173"}</a></p>
          <hr/>
          <p style="color:#6b7280; font-size:12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // In development, log the Ethereal preview URL
    if (!process.env.SMTP_HOST) {
      console.log("[Email] Preview URL:", nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`[Email] Credentials sent to ${to} — Message ID: ${info.messageId}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Non-fatal: log the error but don't crash the main request
    console.error("[Email] Failed to send credentials email:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendCredentialsEmail };
