const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer (configured for Resend SMTP)
 * @param {Object} options - { to, subject, text, html, attachments }
 */
const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465, // Resend uses port 465 with TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Attach files if provided
  if (options.attachments) {
    mailOptions.attachments = options.attachments;
  }

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
