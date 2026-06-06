import { Resend } from "resend";

export async function sendNotificationEmail(input: {
  subject: string;
  text: string;
  to?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    input.to ??
    process.env.MEETING_REQUEST_TO_EMAIL ??
    process.env.DAILY_SUMMARY_TO_EMAIL ??
    "";

  if (!apiKey || !to) {
    return { sent: false, error: "RESEND_API_KEY or recipient email not set" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ??
        "Portfolio <onboarding@resend.dev>",
      to,
      subject: input.subject,
      text: input.text,
    });
    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "send failed",
    };
  }
}
