import { NextRequest, NextResponse } from "next/server";
import {
  transporter,
  FROM,
  COMPANY_EMAIL,
  contactToCompanyHtml,
  contactAutoReplyHtml,
} from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body as {
      name: string;
      email: string;
      phone?: string;
      service: string;
      message: string;
    };

    // Basic validation
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const data = { name, email, phone, service, message };

    console.log("[/api/contact] FROM:", FROM);
    console.log("[/api/contact] TO:", COMPANY_EMAIL);

    // Send both emails concurrently
    await Promise.all([
      // Notify the company
      transporter.sendMail({
        from: FROM,
        to: COMPANY_EMAIL,
        replyTo: email,
        subject: `📬 New Enquiry — ${service} from ${name}`,
        html: contactToCompanyHtml(data),
      }),
      // Auto-reply to the client
      transporter.sendMail({
        from: FROM,
        to: email,
        subject: "We've Received Your Enquiry — Bukay Global Services",
        html: contactAutoReplyHtml(data),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
