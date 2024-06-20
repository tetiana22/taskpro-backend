import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

if (!GMAIL_EMAIL || !GMAIL_PASSWORD) {
  console.error(
    "GMAIL_EMAIL or GMAIL_PASSWORD is not defined in the environment variables."
  );
  process.exit(1);
}

const nodemailerConfig = {
  host: "smtp.mail.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: GMAIL_EMAIL };
  try {
    await transport.sendMail(email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
