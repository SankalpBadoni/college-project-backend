import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Resend Response:", response);
    return response;
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};