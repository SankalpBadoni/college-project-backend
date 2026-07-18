import { Resend } from "resend";

const getResendInstance = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const resend = getResendInstance();
    if (!resend) {
      console.warn("WARNING: Email not sent because RESEND_API_KEY is not configured in .env");
      return { success: false, message: "Email not configured" };
    }

    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL || "no-reply@employu.com",
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