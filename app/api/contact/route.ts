// 收信地址：info@npodia.org 暂收不了信，管理员通知改投 DIA 的 Gmail（永久可靠）。发信 FROM 仍用已验证的 info@npodia.org。
const ADMIN_EMAIL = "driveforwardimmigrantalliance@gmail.com";
const FROM = "Drive Forward Immigrant Alliance <info@npodia.org>";
const RESEND_API = "https://api.resend.com/emails";
const LOGO = "https://www.npodia.org/logo.png";

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

function emailHeader(title: string) {
  return `<table style="width:100%;border-collapse:collapse"><tr>
  <td style="width:60px;vertical-align:middle">
    <img src="${LOGO}" alt="DIA" width="52" height="52" style="display:block;border-radius:6px">
  </td>
  <td style="vertical-align:middle;padding-left:16px">
    <p style="color:#C8923D;font-size:11px;letter-spacing:2px;margin:0 0 2px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
    <p style="color:rgba(255,255,255,0.65);font-size:11px;margin:0 0 5px">移路前行联盟</p>
    <p style="color:white;font-size:18px;font-weight:600;margin:0">${title}</p>
  </td>
</tr></table>`;
}

function adminHtml(name: string, contact: string, subject: string, message: string, time: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  ${emailHeader("新留言通知")}
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
  ${emailHeader("已收到您的留言")}
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
    <a href="mailto:info@npodia.org" style="color:#996B1D;text-decoration:none">info@npodia.org</a>
  </p>
  <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">提交时间 · ${time}</p>
</div>
</body></html>`;
}

function userHtmlEn(name: string, subject: string, message: string, time: string) {
  const firstName = name.trim().split(/\s+/)[0];
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  ${emailHeader("We&#39;ve received your message")}
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
    Drive Forward Immigrant Alliance · 移路前行联盟<br>
    <a href="mailto:info@npodia.org" style="color:#996B1D;text-decoration:none">info@npodia.org</a>
  </p>
  <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">Submitted · ${time}</p>
</div>
</body></html>`;
}

function hasCJK(s: string) {
  return /[一-鿿㐀-䶿]/.test(s);
}

async function sendEmail(apiKey: string, payload: {
  from: string; to: string[]; subject: string; html: string;
}) {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

export async function POST(request: Request) {
  const { name, contact, subject, message, lang } = await request.json() as {
    name: string; contact: string; subject: string; message: string; lang?: string;
  };

  if (!name?.trim() || !contact?.trim() || !subject?.trim() || !message?.trim()) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY not set");
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const time = formatPT();

  try {
    await sendEmail(apiKey, {
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `[DIA 留言] ${subject} — ${name}`,
      html: adminHtml(name, contact, subject, message, time),
    });

    if (isEmail(contact)) {
      const isZh = lang === "zh" || (!lang && (hasCJK(name) || hasCJK(message)));
      await sendEmail(apiKey, {
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
    console.error("[contact] send error:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
