import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Define a type for the parameter object
interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Create transporter object using nodemailer to send emails via Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",                         // using Gmail service
  host: "smtp.gmail.com",               // Gmail SMTP host
  port: 587,                              // port for TLS connection
  secure: false,                         // use TLS
  auth: {
    user: process.env.USER,             // sender Gmail address
    pass: process.env.APP_PASSWORD,         // gmail app-specific password
  },
});

// Dynamic function to send email, accepts MailOptions object with to, subject, text, html
const sendMail = async ({ to, subject, text, html }: MailOptions) => {
  const mailOptions = {
    from: {
      name: "StudentsAdda",         //sender name in email
      address: process.env.USER, //sender email
    },  
    to,                             //recipient email address
    subject,                        //subject line
    text,                           // plain text body
    html,                            // HTML body
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // On success, logs the server
    console.log("Email sent successfully:", info.response);
    return info;

    //this return the full information as a object which contains details about the sent email
    //information about sender , receiver 
    //text


  } catch (error) {
    // If sending fails, logs the error
    console.error("Error sending email:", error);
    throw error;
  }
};


//export both functions
export { sendMail,transporter }