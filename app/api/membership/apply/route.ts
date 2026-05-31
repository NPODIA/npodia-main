export const runtime = "edge";

const RESEND_API = "https://api.resend.com/emails";
const ADMIN_EMAIL = "info@npodia.org";
const FROM = "Drive Forward Immigrant Alliance <info@npodia.org>";

function hasCJK(s: string) {
  return /[一-鿿㐀-䶿]/.test(s);
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

function tierLabel(tier: string, lang: "zh" | "en") {
  if (lang === "zh") return tier === "standard" ? "标准会员（$12/年）" : "援助会员（$1/年）";
  return tier === "standard" ? "Standard Membership ($12/yr)" : "Subsidized Membership ($1/yr)";
}

function adminHtml(data: {
  firstName: string; lastName: string; email: string;
  phone?: string; wechatId?: string; tier: string; message?: string; time: string;
}) {
  const rows = [
    ["姓名", `${data.firstName} ${data.lastName}`],
    ["邮件", data.email],
    ["电话", data.phone || "—"],
    ["微信", data.wechatId || "—"],
    ["申请类型", tierLabel(data.tier, "zh")],
    ["留言 / 说明", data.message || "—"],
  ];
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  <p style="color:#C8923D;font-size:12px;letter-spacing:2px;margin:0 0 4px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
  <p style="color:white;font-size:18px;font-weight:600;margin:0">新会员申请</p>
</div>
<div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#6b7280;width:90px;vertical-align:top">${k}</td><td style="padding:8px 0;font-weight:${k === "姓名" ? 600 : 400};white-space:pre-wrap">${v}</td></tr>`).join("")}
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
  <p style="color:#9ca3af;font-size:12px;margin:0">提交时间 · ${data.time}</p>
</div>
</body></html>`;
}

function confirmHtmlZh(firstName: string, tier: string, time: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  <p style="color:#C8923D;font-size:12px;letter-spacing:2px;margin:0 0 4px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
  <p style="color:white;font-size:18px;font-weight:600;margin:0">已收到您的会员申请</p>
</div>
<div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
  <p style="font-size:15px;line-height:1.7">${firstName} 您好，</p>
  <p style="font-size:15px;line-height:1.7">感谢您申请成为 DIA 会员！我们已收到您的 <strong>${tierLabel(tier, "zh")}</strong> 申请，管理员将在 3-5 个工作日内审核并通过本邮件与您联系。</p>
  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;font-size:14px;color:#4A5468">
    <p style="margin:0">审核通过后，您将收到付款说明（Zelle）及账号激活链接。</p>
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

function confirmHtmlEn(firstName: string, tier: string, time: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1F2E;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#0F2447;padding:20px 24px;border-radius:8px 8px 0 0">
  <p style="color:#C8923D;font-size:12px;letter-spacing:2px;margin:0 0 4px">DRIVE FORWARD IMMIGRANT ALLIANCE</p>
  <p style="color:white;font-size:18px;font-weight:600;margin:0">We've received your membership application</p>
</div>
<div style="background:white;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
  <p style="font-size:15px;line-height:1.7">Hi ${firstName},</p>
  <p style="font-size:15px;line-height:1.7">Thank you for applying for DIA membership! We've received your <strong>${tierLabel(tier, "en")}</strong> application. Our team will review it within 3–5 business days and follow up via email.</p>
  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;font-size:14px;color:#4A5468">
    <p style="margin:0">Once approved, you'll receive payment instructions (Zelle) and an account activation link.</p>
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

async function sendEmail(apiKey: string, payload: {
  from: string; to: string[]; subject: string; html: string;
}) {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function POST(request: Request) {
  const body = await request.json() as {
    firstName: string; lastName: string; email: string;
    phone?: string; wechatId?: string; tier: string; message?: string;
  };

  const { firstName, lastName, email, tier } = body;
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !["standard", "aid"].includes(tier)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.error("[membership/apply] missing env vars");
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const time = formatPT();

  try {
    // Insert into Supabase
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/membership_applications`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        wechat_id: body.wechatId?.trim() || null,
        membership_tier: tier,
        message: body.message?.trim() || null,
      }),
    });
    if (!dbRes.ok) {
      const err = await dbRes.text();
      throw new Error(`Supabase ${dbRes.status}: ${err}`);
    }

    // Admin notification
    await sendEmail(resendKey, {
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `[DIA 会员申请] ${firstName.trim()} ${lastName.trim()} — ${tierLabel(tier, "zh")}`,
      html: adminHtml({ ...body, firstName: firstName.trim(), lastName: lastName.trim(), time }),
    });

    // Applicant confirmation
    const isZh = hasCJK(firstName) || hasCJK(lastName) || hasCJK(body.message ?? "");
    await sendEmail(resendKey, {
      from: FROM,
      to: [email.trim().toLowerCase()],
      subject: isZh
        ? `已收到您的会员申请 · Drive Forward Immigrant Alliance`
        : `Membership Application Received · Drive Forward Immigrant Alliance`,
      html: isZh
        ? confirmHtmlZh(firstName.trim(), tier, time)
        : confirmHtmlEn(firstName.trim(), tier, time),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[membership/apply] error:", err);
    return Response.json({ error: "Application failed" }, { status: 500 });
  }
}
