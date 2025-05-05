import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import Mail from 'nodemailer/lib/mailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { readCsvFile } from './readcsv';

dotenv.config();

const transporter: Mail = nodemailer.createTransport({
   service:"gmail",
   host:process.env.MAIL_HOST,
   // port:process.env.MAIL_PORT,
   secure:false,
   auth:{
      user:process.env.MAIL_USER,
      pass:process.env.MAIL_PASS,
   }
});

const mailOptions:MailOptions = {
   from:"tilesh162003@gmail.com",
   to:"gojomoc753@firain.com",
   subject:"This is a test Mail",
   text:"this is a text",
   attachments:[
    {
      filename:'readcsv.ts',
      path:"./src/service/readcsv.ts"
    }
   ]
}

function sendMail(mailoptions:MailOptions){
   transporter.sendMail(mailoptions,(error,info)=>{
      if(error){
         console.error(error);
      } else{
         console.log(info);
      }
   });   
}

export = sendMail;

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
