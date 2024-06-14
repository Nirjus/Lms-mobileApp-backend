import nodemailer from "nodemailer";
import { smtpPassword, smtpUserName } from "../secret/secret.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: smtpUserName,
    pass: smtpPassword,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (emailData) => {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: smtpUserName, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject + "✔", // Subject line
      html: emailData.html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {
    console.log("Error occured while sending mail", error);
    throw error;
  }
};
