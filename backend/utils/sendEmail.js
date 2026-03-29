const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
  user: process.env.EMAIL,
  pass: process.env.PASSWORD,
}
  });

  const mailOptions = {
    from: `EventEase <${process.env.EMAIL}>`,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
