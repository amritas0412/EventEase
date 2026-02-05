const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "EventEase <no-reply@college.com>",
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
