const nodemailer = require('nodemailer');

// ─── TRANSPORTER ─────────────────────────────────────────────
const createTransporter = () => {
  const port = Number(process.env.EMAIL_PORT);
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465, // Resend SMTP uses port 465 with TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send an email
 * @param {Object} options - { to, subject, html, attachments? }
 */
const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    ...(attachments && { attachments }),
  });
};

// ─── BASE LAYOUT ─────────────────────────────────────────────
const emailLayout = (body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif; background: #F4F6F8; }
    .container { max-width: 560px; margin: 40px auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .header { background: #1D9E75; padding: 28px 32px; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .body { padding: 32px; color: #1F2937; font-size: 15px; line-height: 1.7; }
    .card { background: #F4F6F8; border-radius: 8px; padding: 20px 24px; margin: 20px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .card-label { color: #6B7280; }
    .card-value { color: #085041; font-weight: 600; }
    .btn { display: inline-block; background: #1D9E75; color: #FFFFFF; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .btn:hover { background: #0F6E56; }
    .footer { padding: 20px 32px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
    .footer a { color: #1D9E75; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CareLink</h1>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      This is an automated email from <a href="#">CareLink</a>. Please do not reply.
    </div>
  </div>
</body>
</html>
`;

// ─── EMAIL TEMPLATES ─────────────────────────────────────────

/**
 * Appointment confirmed email
 */
const appointmentConfirmedEmail = ({ patientName, doctorName, date, timeSlot }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return emailLayout(`
    <p>Hi <strong>${patientName}</strong>,</p>
    <p>Great news! Your appointment has been <strong style="color: #1D9E75;">confirmed</strong>.</p>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Doctor</span>
        <span class="card-value">Dr. ${doctorName}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Date</span>
        <span class="card-value">${formattedDate}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Time</span>
        <span class="card-value">${timeSlot}</span>
      </div>
    </div>

    <p>Please be on time. You can view or manage your appointment from your dashboard.</p>
  `);
};

/**
 * Prescription ready email
 */
const prescriptionReadyEmail = ({ patientName, doctorName, pdfUrl }) => {
  return emailLayout(`
    <p>Hi <strong>${patientName}</strong>,</p>
    <p>Dr. <strong>${doctorName}</strong> has issued a prescription for your recent appointment.</p>
    <p>You can download the prescription PDF using the button below:</p>

    <div style="text-align: center;">
      <a href="${pdfUrl}" class="btn">Download Prescription</a>
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: #6B7280;">
      This prescription is also available in your dashboard under <strong>My Prescriptions</strong>.
    </p>
  `);
};

/**
 * Doctor approval / rejection email
 */
const doctorApprovalEmail = ({ doctorName, status }) => {
  const isApproved = status === 'approved' || status === 'verified';

  const body = isApproved
    ? `
      <p>Hello Dr. <strong>${doctorName}</strong>,</p>
      <p>Congratulations! Your doctor profile has been <strong style="color: #1D9E75;">approved</strong>.</p>
      <p>You can now:</p>
      <ul>
        <li>Accept appointment requests from patients</li>
        <li>Write and issue digital prescriptions</li>
        <li>Manage your availability and time slots</li>
      </ul>
      <p>Log in to your dashboard to get started.</p>
    `
    : `
      <p>Hello Dr. <strong>${doctorName}</strong>,</p>
      <p>We regret to inform you that your doctor application has been <strong style="color: #EF4444;">rejected</strong>.</p>
      <p>This may be due to incomplete credentials or unverifiable qualifications. If you believe this is an error, please contact our support team with updated documents.</p>
    `;

  return emailLayout(body);
};

module.exports = {
  sendEmail,
  appointmentConfirmedEmail,
  prescriptionReadyEmail,
  doctorApprovalEmail,
};
