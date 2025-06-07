const nodemailer = require("nodemailer");
require("dotenv").config();

// Define a type for the parameter object
interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

//  Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.USER, // sender Gmail address
    pass: process.env.APP_PASSWORD, // app-specific password
  },
});

// Dynamic send mail function with typed parameters
const sendMail = async ({ to, subject, text, html }: MailOptions) => {
  const mailOptions = {
    from: {
      name: "StudentsAdda",
      address: process.env.USER,
    },
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};


export { sendMail,transporter }