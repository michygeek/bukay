import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn(
    "[mailer] SMTP env vars not set. Emails will not be delivered. " +
      "Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local"
  );
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const FROM = `"Bukay Global Services" <${process.env.SMTP_USER}>`;
export const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? "info@bukayglobal.com";

// ─── Shared email wrapper ──────────────────────────────────────────────────────

function emailWrapper(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f2d54 0%,#1b4880 100%);padding:28px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="display:inline-block;background:#e8820c;color:#fff;font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:10px;">BUKAY GLOBAL SERVICES</span>
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;line-height:1.3;">${title}</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 36px;border-top:1px solid #e8ecf0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">
              Bukay Global Services Limited · Lagos, Nigeria · info@bukayglobal.com<br>
              NEMSA Certified — Category A · Cert No. A01175
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

function row(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:10px 14px;font-size:14px;color:#0f2d54;font-weight:600;border-left:2px solid #f1f5f9;">${value || "—"}</td>
  </tr>`;
}

function table(rows: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ecf0;border-radius:8px;overflow:hidden;margin:20px 0;">
    ${rows}
  </table>`;
}

// ─── Booking emails ───────────────────────────────────────────────────────────

interface BookingData {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export function bookingToCompanyHtml(d: BookingData): string {
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#374151;">
      A new appointment request has been submitted through the website.
    </p>
    ${table(
      row("Service", d.service) +
      row("Date", d.date) +
      row("Time", d.time) +
      row("Name", d.name) +
      row("Email", `<a href="mailto:${d.email}" style="color:#e8820c;">${d.email}</a>`) +
      row("Phone", d.phone) +
      row("Notes", d.notes || "—")
    )}
    <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;">
      Please confirm this appointment with the client within 24 hours.
    </p>`;
  return emailWrapper("New Appointment Request", body);
}

export function bookingConfirmationHtml(d: BookingData): string {
  const body = `
    <p style="margin:0 0 4px;font-size:15px;color:#374151;">Dear <strong>${d.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      Thank you for booking an appointment with Bukay Global Services Limited. We have received your request and will confirm within <strong>24 hours</strong>.
    </p>
    ${table(
      row("Service", d.service) +
      row("Requested Date", d.date) +
      row("Requested Time", d.time) +
      row("Contact", `${d.email} · ${d.phone}`)
    )}
    <div style="background:#fff8f0;border:1px solid #fde8cc;border-radius:8px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        <strong>What happens next?</strong> One of our team members will call or email you to confirm your appointment slot. If you need to make changes, please reply to this email or call us directly.
      </p>
    </div>
    <p style="margin:0;font-size:13px;color:#94a3b8;">
      We look forward to meeting with you.<br><br>
      <strong style="color:#0f2d54;">The Bukay Global Services Team</strong>
    </p>`;
  return emailWrapper("Appointment Request Received", body);
}

// ─── Contact emails ───────────────────────────────────────────────────────────

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

export function contactToCompanyHtml(d: ContactData): string {
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#374151;">
      A new project enquiry has been submitted via the contact form.
    </p>
    ${table(
      row("Name", d.name) +
      row("Email", `<a href="mailto:${d.email}" style="color:#e8820c;">${d.email}</a>`) +
      row("Phone", d.phone || "—") +
      row("Service", d.service)
    )}
    <div style="background:#f8fafc;border:1px solid #e8ecf0;border-radius:8px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Project Description</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${d.message}</p>
    </div>
    <p style="margin:0;font-size:13px;color:#94a3b8;">Please respond to this enquiry within 24 hours.</p>`;
  return emailWrapper("New Project Enquiry", body);
}

export function contactAutoReplyHtml(d: ContactData): string {
  const body = `
    <p style="margin:0 0 4px;font-size:15px;color:#374151;">Dear <strong>${d.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      Thank you for reaching out to Bukay Global Services Limited. We have received your enquiry regarding <strong>${d.service}</strong> and will get back to you within <strong>24 hours</strong>.
    </p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin:0 0 20px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.5px;">Your Message</p>
      <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">${d.message}</p>
    </div>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      In the meantime, feel free to explore our services or book a consultation on our website.
    </p>
    <p style="margin:0;font-size:13px;color:#94a3b8;">
      Warm regards,<br>
      <strong style="color:#0f2d54;">The Bukay Global Services Team</strong><br>
      Lagos, Nigeria · info@bukayglobal.com
    </p>`;
  return emailWrapper("We've Received Your Enquiry", body);
}
