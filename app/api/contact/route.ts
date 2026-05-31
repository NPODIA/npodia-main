import { Resend } from "resend";

export const runtime = "edge";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const ADMIN_EMAIL = "info@npodia.org";
const FROM = "Drive Forward Immigrant Alliance <info@npodia.org>";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function formatPT() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")} ${g("hour")}:${g("minute")} PT`;
}

function adminHtml(name: string, contact: string, subject: string, message: string, time: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  <p style="color:#C8923D;font-size:12px;letter-spacing:2px;margin:0 0 4px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
  <p style="color:white;font-size:18px;font-weight:600;margin:0">新留言通知</p>
</div>
<div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:80px">姓名</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">联系方式</td><td style="padding:8px 0">${contact}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">事由</td><td style="padding:8px 0"><span style="background:#FEF3C7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:12px">${subject}</span></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">留言</td><td style="padding:8px 0;line-height:1.6;white-space:pre-wrap">${message}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
  <p style="color:#9ca3af;font-size:12px;margin:0">提交时间 · ${time}</p>
</div>
</body></html>`;
}

function userHtmlZh(name: string, subject: string, message: string, time: string) {
  const firstName = name.trim().split(/\s+/)[0];
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  <p style="color:#C8923D;font-size:12px;letter-spacing:2px;margin:0 0 4px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
  <p style="color:white;font-size:18px;font-weight:600;margin:0">已收到您的留言</p>
</div>
<div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
  <p style="font-size:15px;line-height:1.7">${firstName} 您好，</p>
  <p style="font-size:15px;line-height:1.7">我们已收到您的留言，将在 2 个工作日内回复。</p>
  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;font-size:14px">
    <p style="margin:0 0 8px;color:#6b7280;font-size:12px">您的留言摘要</p>
    <p style="margin:0 0 4px"><strong>事由：</strong>${subject}</p>
    <p style="margin:0;white-space:pre-wrap;line-height:1.6">${message}</p>
  </div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
  <p style="margin:0;font-size:14px;line-height:1.6">
    <strong>DIA 团队</strong><br>
    移路前行联盟 · Drive Forward Immigrant Alliance<br>
    <a href="mailto:info@npodia.org" style="color:#C8923D;text-decoration:none">info@npodia.org</a>
  </p>
  <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">提交时间 · ${time}</p>
</div>
</body></html>`;
}

function userHtmlEn(name: string, subject: string, message: string, time: string) {
  const firstName = name.trim().split(/\s+/)[0];
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  <p style="color:#C8923D;font-size:12px;letter-spacing:2px;margin:0 0 4px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
  <p style="color:white;font-size:18px;font-weight:600;margin:0">We've received your message</p>
</div>
<div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
  <p style="font-size:15px;line-height:1.7">Hi ${firstName},</p>
  <p style="font-size:15px;line-height:1.7">Thank you for reaching out. We'll get back to you within 2 business days.</p>
  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;font-size:14px">
    <p style="margin:0 0 8px;color:#6b7280;font-size:12px">YOUR MESSAGE</p>
    <p style="margin:0 0 4px"><strong>Subject:</strong> ${subject}</p>
    <p style="margin:0;white-space:pre-wrap;line-height:1.6">${message}</p>
  </div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
  <p style="margin:0;font-size:14px;line-height:1.6">
    <strong>DIA Team</strong><br>
    Drive Forward Immigrant Alliance<br>
    <a href="mailto:info@npodia.org" style="color:#C8923D;text-decoration:none">info@npodia.org</a>
  </p>
  <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">Submitted · ${time}</p>
</div>
</body></html>`;
}

function hasCJK(s: string) {
  return /[一-鿿㐀-䶿]/.test(s);
}

export async function POST(request: Request) {
  const { name, contact, subject, message } = await request.json() as {
    name: string; contact: string; subject: string; message: string;
  };

  if (!name?.trim() || !contact?.trim() || !subject?.trim() || !message?.trim()) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const time = formatPT();

  const resend = getResend();

  try {
    // Admin notification
    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `[DIA 留言] ${subject} — ${name}`,
      html: adminHtml(name, contact, subject, message, time),
    });

    // User confirmation (only if contact is an email address)
    if (isEmail(contact)) {
      const isZh = hasCJK(name) || hasCJK(message);
      await resend.emails.send({
        from: FROM,
        to: [contact.trim()],
        subject: isZh
          ? `已收到您的留言 · Drive Forward Immigrant Alliance`
          : `We've received your message · Drive Forward Immigrant Alliance`,
        html: isZh
          ? userHtmlZh(name, subject, message, time)
          : userHtmlEn(name, subject, message, time),
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] resend error:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
