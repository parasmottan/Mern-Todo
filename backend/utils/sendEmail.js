const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,          // e.g. your@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD,  // 16-digit app password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Email not sent");
  }
};

module.exports = sendEmail; 

