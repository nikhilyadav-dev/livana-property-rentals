const nodeMailer = require("nodemailer");

const sendEmail = async ({ email, subject, emailMessage }) => {
  const transpoter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    secure: true,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const options = {
    from: process.env.SMTP_MAIL,
    to: process.env.SMTP_TO,
    subject,
    html: emailMessage,
    replyTo: email,
  };
  await transpoter.sendMail(options);
};
module.exports = sendEmail;
