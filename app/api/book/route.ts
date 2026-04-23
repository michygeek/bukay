import { NextRequest, NextResponse } from "next/server";
import {
  transporter,
  FROM,
  COMPANY_EMAIL,
  bookingToCompanyHtml,
  bookingConfirmationHtml,
} from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, date, time, name, email, phone, notes } = body as {
      service: string;
      date: string;
      time: string;
      name: string;
      email: string;
      phone: string;
      notes?: string;
    };

    // Basic validation
    if (!service || !date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Format date for display
    const formatted = new Date(date).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const data = { service, date: formatted, time, name, email, phone, notes };

    // Send both emails concurrently
    await Promise.all([
      // Notify the company
      transporter.sendMail({
        from: FROM,
        to: COMPANY_EMAIL,
        replyTo: email,
        subject: `📅 New Appointment Request — ${service} (${formatted}, ${time})`,
        html: bookingToCompanyHtml(data),
      }),
      // Confirm to the client
      transporter.sendMail({
        from: FROM,
        to: email,
        subject: "Appointment Request Received — Bukay Global Services",
        html: bookingConfirmationHtml(data),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/book]", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
