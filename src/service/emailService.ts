import nodemailer from "nodemailer";

interface SendEmailParams {
  name: string;
  to: string;
  subject: string;
  body: string;
  cc?: string;
}

export async function sendEmail(params: SendEmailParams) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const email = {
      body: {
        greeting: "Dear",
        name: params?.name,
        outro: params?.body,
        signature: `Thank You!`,
      },
    };

    const mailOptions = {
      from: process.env.EMAIL_ID, // sender address
      to: params?.to,
      subject: params?.subject,
      text: params?.body,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}
