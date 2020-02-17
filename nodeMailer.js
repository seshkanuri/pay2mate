const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport(
{
  host: "mail.pay2mate.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@pay2mate.com",
    pass: "Pay2Mate9477#"
  },
  requireTLS: false,
  tls: {
    rejectUnauthorized: false
  },
}
);

module.exports = transporter;
