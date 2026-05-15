import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`⚠️ SMTP not configured. Email to ${to} queued (simulated).`);
      return true;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to,
      subject: "Salam Kenal!",
      text: "Hi Salam kenal",
      html: "<h2>Hi Salam kenal</h2>",
    });

    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    return false;
  }
};
