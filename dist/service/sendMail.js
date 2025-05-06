"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: process.env.MAIL_HOST,
    // port:process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
module.exports = transporter;
// async function sendTestEmail() {
//   // Create a test SMTP account
//   let testAccount = await nodemailer.createTestAccount();
//   // Create a transporter using the test account
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });
//   // Send email
//   let info = await transporter.sendMail({
//     from: '"Test Sender 👻" <test@example.com>',
//     to: "recipient@example.com",
//     subject: "Hello from Nodemailer",
//     text: "This is a test email",
//     html: "<br><hr><b>This is a test email</b>",
//   });
//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }
// sendTestEmail().catch(console.error);
