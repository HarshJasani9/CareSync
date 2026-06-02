const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
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

  // Attach file if provided
  if (options.attachments) {
    mailOptions.attachments = options.attachments;
  }

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
