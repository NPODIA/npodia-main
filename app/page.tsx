"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Lang = "zh" | "en";
const t = (lang: Lang, zh: string, en: string) => (lang === "zh" ? zh : en);

const NAV_LINKS = [
  { id: "services", zh: "服务", en: "Services" },
  { id: "news", zh: "资讯", en: "News" },
  { id: "membership", zh: "会员", en: "Membership" },
  { id: "about", zh: "关于", en: "About" },
  { id: "contact", zh: "联系", en: "Contact" },
];

const SERVICES = [
  {
    icon: "🎓",
    zh: { title: "职业英语培训", desc: "专为卡车司机设计的实用英语课程，覆盖路政检查对话、货运术语、安全法规沟通，帮助您在工作中自信表达。" },
    en: { title: "Professional English", desc: "Practical English courses for truck drivers — covering DOT inspection dialogues, freight terminology, and safety communication." },
  },
  {
    icon: "📋",
    zh: { title: "DOT/FMCSA 合规教育", desc: "系统讲解联邦和州级货运法规，包括 HOS 规则、ELD 要求、车辆检查标准，让合规不再是负担。" },
    en: { title: "DOT/FMCSA Compliance", desc: "Systematic education on federal and state trucking regulations — HOS rules, ELD requirements, and vehicle inspection standards." },
  },
  {
    icon: "🤝",
    zh: { title: "行业资源与税务合规对接", desc: "连接优质会计、保险、法律等行业资源；税务合规指导帮助 Owner-Operator 正确申报，最大化合法抵扣。" },
    en: { title: "Industry Resources & Tax", desc: "Connect with trusted accountants, insurers, and attorneys. Tax guidance helps Owner-Operators maximize legal deductions." },
  },
];

const NEWS = [
  {
    image: "/news/dot-inspection.jpg",
    date: "2026-05",
    href: "https://www.cvsa.org/news-entries/international-roadcheck/",
    zh: { tag: "安全检查", title: "CVSA Roadcheck 5/13–15：刹车 & HOS 重点执法", excerpt: "全美执法人员将在 72 小时内集中检查商用车，本年度重点针对刹车系统缺陷与 HOS 违规，建议司机提前自查，避免被要求停驶。" },
    en: { tag: "Safety", title: "CVSA Roadcheck May 13–15: Brakes & HOS Focus", excerpt: "Officers across North America will conduct 72-hour blitz inspections targeting brake system defects and HOS violations. Pre-trip inspections are strongly recommended." },
  },
  {
    image: "/news/carb-electric.jpg",
    date: "2026-05",
    href: "https://ww2.arb.ca.gov/our-work/programs/advanced-clean-trucks",
    zh: { tag: "加州法规", title: "Advanced Clean Trucks：强制零排放配额 2026 年起执行", excerpt: "CARB ACT 规则正式生效，卡车制造商须按配额销售零排放车型。Owner-Operator 购车前建议核实补贴资格与合规状态，避免未来运营限制。" },
    en: { tag: "California", title: "Advanced Clean Trucks: ZEV Quotas Effective 2026", excerpt: "CARB's ACT rule takes effect requiring manufacturers to sell zero-emission vehicles per quota. Owner-Operators should verify incentive eligibility before purchasing new equipment." },
  },
  {
    image: "/news/cdl-driver.jpg",
    date: "2026-04",
    href: "https://www.fmcsa.dot.gov/registration/commercial-drivers-license",
    zh: { tag: "CDL 法规", title: "FMCSA 要求各州核实境外 CDL：华人司机须备好记录", excerpt: "FMCSA 新指引要求各州 DMV 对在美以外取得 CDL 的司机进行额外身份与驾照验证，建议相关司机提前整理驾照原件及翻译文件。" },
    en: { tag: "CDL", title: "FMCSA Directs States to Verify Foreign-Issued CDLs", excerpt: "New FMCSA guidance directs state DMVs to conduct additional identity and license verification for drivers with foreign CDLs. Prepare original licenses and certified translations." },
  },
  {
    image: "/news/truck-highway.jpg",
    date: "2026-04",
    href: "https://www.fmcsa.dot.gov/hours-service/summary-hours-service-regulations",
    zh: { tag: "HOS 规则", title: "短途豁免半径扩至 150 英里：ELD 要求或可免除", excerpt: "FMCSA 正式更新 Short-Haul Exemption，运营半径从 100 空气英里扩大至 150 英里。符合条件的当日返回司机可免 ELD 记录义务。" },
    en: { tag: "HOS Rules", title: "Short-Haul Exemption Expanded to 150 Air Miles", excerpt: "FMCSA expanded the Short-Haul Exemption radius to 150 air miles. Qualifying drivers who return to their home terminal daily may be exempt from ELD requirements." },
  },
  {
    image: "/news/truck-white.jpg",
    date: "2026-03",
    href: "https://ww2.arb.ca.gov/our-work/programs/clean-truck-check",
    zh: { tag: "CTC 检测", title: "Clean Truck Check 扩展至所有 26,001 lb+ 柴油卡车", excerpt: "CTC 路边排放测试项目 2026 年起覆盖所有总重超过 26,001 磅的柴油卡车，未通过检测将被责令停驶整改，加州运营司机须尽早了解合规流程。" },
    en: { tag: "CTC", title: "Clean Truck Check Expands to All Diesel Trucks 26,001+ lbs", excerpt: "California's roadside emissions testing expands to all diesel trucks over 26,001 lbs GVWR. Vehicles failing inspection may be ordered out of service for repairs." },
  },
  {
    image: "/news/truck-dark.jpg",
    date: "2026-03",
    href: "https://www.fmcsa.dot.gov/registration/mc-numbers/financial-responsibility",
    zh: { tag: "保险合规", title: "货运经纪人最低保证金上调至 $100,000", excerpt: "FMCSA 将 Property Broker 最低财务责任保证金从 $75,000 提高至 $100,000，2026 年起执行。未达标的经纪人须在续期前补足，否则面临执照吊销。" },
    en: { tag: "Insurance", title: "Freight Broker Minimum Bond Raised to $100,000", excerpt: "FMCSA raised the minimum financial responsibility bond for property brokers from $75,000 to $100,000 effective 2026. Non-compliant brokers risk license revocation at renewal." },
  },
];

const FAQS = [
  {
    zh: { q: "谁可以申请会员？", a: "所有北美华人卡车从业者均可申请，包括 Owner-Operator、公司司机、调度员、货运经纪人及相关行业从业者。" },
    en: { q: "Who can become a member?", a: "All Chinese-speaking trucking professionals in North America are welcome — Owner-Operators, company drivers, dispatchers, freight brokers, and related industry workers." },
  },
  {
    zh: { q: "会员费如何使用？", a: "全部用于平台运营、活动组织、内容制作及法律合规维护。DIA 是 501(c)(3) 非营利组织，财务公开透明。" },
    en: { q: "How are membership fees used?", a: "All fees support platform operations, events, content production, and legal compliance. DIA is a 501(c)(3) nonprofit with transparent finances." },
  },
  {
    zh: { q: "援助会员如何申请？", a: "若您目前失业或年收入低于联邦贫困线 120%，可在申请时说明情况，管理员审核后按 $1/年费率处理。" },
    en: { q: "How do I apply for the subsidized rate?", a: "If you are unemployed or earn below 120% of the federal poverty line, explain your situation in the application. Admins will review and may approve the $1/year rate." },
  },
  {
    zh: { q: "DIA 是合法的非营利组织吗？", a: "是的。DIA 已获 IRS 501(c)(3) 认定，EIN 42-1921384，在加州注册，受联邦和州级非营利法律监管。" },
    en: { q: "Is DIA a legitimate nonprofit?", a: "Yes. DIA holds IRS 501(c)(3) status, EIN 42-1921384, incorporated in California and regulated under federal and state nonprofit law." },
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("zh");
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("npodia-lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const triggerLoginToast = () => {
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3000);
  };

  const switchLang = () => {
    const next: Lang = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("npodia-lang", next);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const applyForMembership = (tier: "standard" | "aid") => {
    const subject = t(lang,
      tier === "standard" ? "标准会员申请（$12/年）" : "援助会员申请（$1/年）",
      tier === "standard" ? "Standard Membership Application ($12/yr)" : "Subsidized Membership Application ($1/yr)"
    );
    const message = t(lang,
      tier === "standard"
        ? "您好，我希望申请 DIA 标准会员。"
        : "您好，我目前符合援助条件，希望申请 DIA 援助会员。",
      tier === "standard"
        ? "Hello, I would like to apply for DIA Standard Membership."
        : "Hello, I qualify for the subsidized rate and would like to apply for DIA Membership."
    );
    setForm(prev => ({ ...prev, subject, message }));
    setFormSent(false);
    setTimeout(() => {
      const el = document.getElementById("contactForm");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 50);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormSent(true);
        setForm({ name: "", contact: "", subject: "", message: "" });
      } else {
        setFormError(true);
      }
    } catch {
      setFormError(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Login coming-soon toast */}
      <div
        className="fixed top-20 left-1/2 z-[100] transition-all duration-300 pointer-events-none"
        style={{
          transform: `translateX(-50%) translateY(${showLoginToast ? "0" : "-12px"})`,
          opacity: showLoginToast ? 1 : 0,
        }}
      >
        <div
          className="px-5 py-3 rounded-full text-sm font-medium shadow-xl text-white whitespace-nowrap"
          style={{ backgroundColor: "#0F2447", border: "1px solid rgba(200,146,61,0.4)" }}
        >
          {t(lang, "会员登录即将上线 · 敬请期待", "Member login coming soon · Stay tuned")}
        </div>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(15,36,71,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo.png" alt="DIA Logo" width={36} height={36} className="rounded-md" />
            <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
              {t(lang, "移路前行联盟", "Drive Forward")}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-white/80 hover:text-white px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
              >
                {t(lang, l.zh, l.en)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center rounded-full overflow-hidden text-xs"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              {(["zh", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); localStorage.setItem("npodia-lang", l); }}
                  className="px-3 py-1.5 transition-all"
                  style={{
                    backgroundColor: lang === l ? "rgba(255,255,255,0.18)" : "transparent",
                    color: lang === l ? "white" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {l === "zh" ? "中文" : "EN"}
                </button>
              ))}
            </div>
            <button
              onClick={triggerLoginToast}
              className="hidden sm:block text-sm px-4 py-2 rounded-full font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)" }}
            >
              {t(lang, "登录", "Login")}
            </button>
            <button
              onClick={() => scrollTo("membership")}
              className="hidden sm:block text-sm px-4 py-2 rounded-full font-medium transition-all"
              style={{ backgroundColor: "#C8923D", color: "white" }}
            >
              {t(lang, "申请会员", "Join Us")}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                {mobileMenuOpen
                  ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                }
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-3 px-6" style={{ backgroundColor: "rgba(15,36,71,0.98)" }}>
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block w-full text-left text-white/80 hover:text-white py-3 text-sm border-b border-white/5 last:border-0"
              >
                {t(lang, l.zh, l.en)}
              </button>
            ))}
            <button
              onClick={() => scrollTo("membership")}
              className="mt-3 w-full text-sm px-4 py-2.5 rounded-full font-medium"
              style={{ backgroundColor: "#C8923D", color: "white" }}
            >
              {t(lang, "申请会员", "Join Us")}
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 30% 40%, #1B3A6B 0%, #0F2447 60%, #0A1830 100%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,146,61,0.15) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-32 pt-40">
          <div className="max-w-3xl">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#C8923D" }}
            >
              {t(lang, "北美华人卡车从业者的家", "Home for Chinese-Speaking Trucking Professionals")}
            </p>
            <h1
              className="text-white mb-6 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 400,
              }}
            >
              {lang === "zh" ? <>移路前行，<br />共创未来</> : <>Drive Forward,<br />Together</>}
            </h1>
            <p
              className="text-lg mb-10 leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {t(
                lang,
                "Drive Forward Immigrant Alliance（移路前行联盟）是加州 501(c)(3) 非营利组织，为北美华人卡车从业者提供职业英语培训、DOT/FMCSA 合规教育与行业资源对接。",
                "Drive Forward Immigrant Alliance is a California 501(c)(3) nonprofit providing professional English training, DOT/FMCSA compliance education, and industry resources for Chinese-speaking trucking professionals in North America."
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("membership")}
                className="px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: "#C8923D" }}
              >
                {t(lang, "申请会员", "Apply for Membership")}
              </button>
              <button
                onClick={() => scrollTo("services")}
                className="px-8 py-3.5 rounded-full font-semibold transition-all hover:bg-white/10"
                style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}
              >
                {t(lang, "了解更多", "Learn More")}
              </button>
            </div>

            <div className="flex gap-8 mt-16 pt-8 border-t border-white/10">
              {[
                { num: "501(c)(3)", zh: "联邦认证非营利", en: "Federally Recognized" },
                { num: "2026", zh: "加州正式注册", en: "California Incorporated" },
                { num: "$1/$12", zh: "年度会费", en: "Annual Membership" },
              ].map((s) => (
                <div key={s.num}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {s.num}
                  </div>
                  <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {t(lang, s.zh, s.en)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1080 80 360 0 0 40L0 80Z" fill="#FAF7F2" />
          </svg>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-6" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>
            {t(lang, "我们的服务", "What We Offer")}
          </p>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#0F2447" }}
          >
            {t(lang, "为您的职业发展保驾护航", "Supporting Your Professional Journey")}
          </h2>
          <p className="text-center mb-16 max-w-2xl mx-auto" style={{ color: "#4A5468" }}>
            {t(
              lang,
              "三大核心服务，覆盖卡车从业者最迫切的需求",
              "Three core services addressing the most critical needs of trucking professionals"
            )}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 group cursor-default"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(15,36,71,0.08)",
                  boxShadow: "0 2px 12px rgba(15,36,71,0.06)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-colors"
                  style={{ backgroundColor: "#E9D9B6" }}
                >
                  {s.icon}
                </div>
                <div
                  className="h-1 w-12 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: "#C8923D" }}
                />
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}
                >
                  {t(lang, s.zh.title, s.en.title)}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: "#4A5468" }}>
                  {t(lang, s.zh.desc, s.en.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── News ─────────────────────────────────────────────────────── */}
      <section id="news" className="py-24 px-6" style={{ backgroundColor: "#F5EFE4" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>
            {t(lang, "最新行业资讯", "Industry News")}
          </p>
          <h2
            className="text-center mb-16"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#0F2447" }}
          >
            {t(lang, "掌握行业动态，提前做好准备", "Stay Informed, Stay Ahead")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEWS.map((n, i) => (
              <a
                key={i}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(15,36,71,0.08)",
                  boxShadow: "0 2px 12px rgba(15,36,71,0.06)",
                }}
              >
                <div className="h-36 relative overflow-hidden">
                  <Image
                    src={n.image}
                    alt={t(lang, n.zh.tag, n.en.tag)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0" style={{ background: "rgba(15,36,71,0.45)" }} />
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#C8923D", color: "white" }}
                  >
                    {t(lang, n.zh.tag, n.en.tag)}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs mb-2" style={{ color: "#4A5468" }}>{n.date}</p>
                  <h3
                    className="font-semibold mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}
                  >
                    {t(lang, n.zh.title, n.en.title)}
                  </h3>
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#4A5468" }}>
                    {t(lang, n.zh.excerpt, n.en.excerpt)}
                  </p>
                  <p className="mt-3 text-xs font-medium" style={{ color: "#C8923D" }}>
                    {t(lang, "阅读原文 →", "Read more →")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership ───────────────────────────────────────────────── */}
      <section id="membership" className="py-24 px-6" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>
            {t(lang, "加入我们", "Membership")}
          </p>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#0F2447" }}
          >
            {t(lang, "成为 DIA 会员", "Become a DIA Member")}
          </h2>
          <p className="text-center mb-16 max-w-xl mx-auto" style={{ color: "#4A5468" }}>
            {t(
              lang,
              "低门槛，真资源。两种费率，确保每位从业者都能加入。",
              "Low barrier, real resources. Two pricing tiers to ensure every professional can join."
            )}
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Standard */}
            <div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: "white", border: "2px solid #C8923D", boxShadow: "0 4px 24px rgba(200,146,61,0.15)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C8923D" }}>
                  {t(lang, "标准会员", "Standard")}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: "#E9D9B6", color: "#C8923D" }}
                >
                  {t(lang, "推荐", "Popular")}
                </span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}>$12</span>
                <span className="ml-2 text-sm" style={{ color: "#4A5468" }}>{t(lang, "/ 年", "/ year")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  t(lang, "访问全部社区内容", "Full community access"),
                  t(lang, "职业英语培训课程", "Professional English courses"),
                  t(lang, "DOT/FMCSA 合规资料库", "DOT/FMCSA compliance library"),
                  t(lang, "行业资源对接", "Industry resource referrals"),
                  t(lang, "会员专属活动邀请", "Member-only event invitations"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#1A1F2E" }}>
                    <span className="mt-0.5 shrink-0 text-base" style={{ color: "#C8923D" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => applyForMembership("standard")}
                className="w-full py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: "#C8923D" }}
              >
                {t(lang, "申请标准会员", "Apply — $12/yr")}
              </button>
            </div>

            {/* Aid */}
            <div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.12)", boxShadow: "0 2px 12px rgba(15,36,71,0.06)" }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase block mb-2" style={{ color: "#4A5468" }}>
                {t(lang, "援助会员", "Subsidized")}
              </span>
              <div className="mb-6">
                <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}>$1</span>
                <span className="ml-2 text-sm" style={{ color: "#4A5468" }}>{t(lang, "/ 年", "/ year")}</span>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#4A5468" }}>
                {t(
                  lang,
                  "专为目前失业或年收入低于联邦贫困线 120% 的从业者提供。享受与标准会员完全相同的权益。",
                  "For professionals currently unemployed or earning below 120% of the federal poverty line. Full membership benefits, same as Standard."
                )}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  t(lang, "与标准会员完全相同的权益", "All Standard membership benefits"),
                  t(lang, "需在申请时说明情况", "Income verification required"),
                  t(lang, "管理员人工审核", "Admin review process"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#1A1F2E" }}>
                    <span className="mt-0.5 shrink-0 text-base" style={{ color: "#1B3A6B" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => applyForMembership("aid")}
                className="w-full py-3.5 rounded-full font-semibold transition-all hover:bg-navy-100"
                style={{ border: "2px solid #0F2447", color: "#0F2447" }}
              >
                {t(lang, "申请援助会员", "Apply — $1/yr")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-24 px-6"
        style={{ background: "radial-gradient(ellipse at 70% 50%, #1B3A6B 0%, #0F2447 70%, #0A1830 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>
            {t(lang, "关于我们", "About Us")}
          </p>
          <h2
            className="text-white text-center mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)" }}
          >
            {t(lang, "为什么需要 DIA？", "Why DIA?")}
          </h2>
          <p className="text-center max-w-3xl mx-auto mb-16 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            {t(
              lang,
              "北美华人卡车司机面临语言障碍、法规复杂、信息不对称等多重挑战。DIA 成立的初衷，是让每一位华人从业者都能在这条路上走得更稳、更远。",
              "Chinese-speaking truck drivers in North America face language barriers, complex regulations, and information gaps. DIA was founded to help every professional navigate this industry with confidence."
            )}
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: "🌐",
                zh: { title: "语言不再是障碍", desc: "用母语学习，用英文执行。我们的课程让语言成为您的优势，而非劣势。" },
                en: { title: "Language Is No Barrier", desc: "Learn in your native language, execute in English. Our courses turn language into your advantage." },
              },
              {
                icon: "⚖️",
                zh: { title: "合规就是竞争力", desc: "了解法规、避免违规、保住营业执照。合规的司机，才能走得更长远。" },
                en: { title: "Compliance Is Competitive Advantage", desc: "Know the rules, avoid violations, protect your license. Compliant drivers go further." },
              },
              {
                icon: "👥",
                zh: { title: "社群的力量", desc: "遇到问题不再孤立无援。DIA 把最有经验的从业者连接在一起，共享资源。" },
                en: { title: "The Power of Community", desc: "No more facing challenges alone. DIA connects experienced professionals to share knowledge and resources." },
              },
            ].map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="text-white font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  {t(lang, v.zh.title, v.en.title)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {t(lang, v.zh.desc, v.en.desc)}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#F5EFE4" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>FAQ</p>
          <h2
            className="text-center mb-12"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#0F2447" }}
          >
            {t(lang, "常见问题", "Frequently Asked Questions")}
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-sm" style={{ color: "#0F2447" }}>
                    {t(lang, f.zh.q, f.en.q)}
                  </span>
                  <span
                    className="ml-4 shrink-0 text-lg font-light transition-transform"
                    style={{ color: "#C8923D", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#4A5468" }}>
                    {t(lang, f.zh.a, f.en.a)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>
            {t(lang, "联系我们", "Get in Touch")}
          </p>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#0F2447" }}
          >
            {t(lang, "随时与我们联系", "We'd Love to Hear From You")}
          </h2>
          <p className="text-center mb-16 max-w-xl mx-auto" style={{ color: "#4A5468" }}>
            {t(lang, "有问题或想了解更多，欢迎通过以下方式联系我们。", "Have questions or want to learn more? Reach out through any of the channels below.")}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* WeChat */}
            <div
              className="p-8 rounded-2xl text-center"
              style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)" }}
            >
              <div className="text-3xl mb-4">💬</div>
              <h3 className="font-semibold mb-2" style={{ color: "#0F2447" }}>{t(lang, "微信", "WeChat")}</h3>
              <p className="text-sm mb-4" style={{ color: "#4A5468" }}>ID: NPODIA</p>
              <Image
                src="/wechat-qr.jpg"
                alt="WeChat QR Code"
                width={160}
                height={130}
                className="mx-auto rounded-xl"
              />
            </div>

            {/* Email */}
            <div
              className="p-8 rounded-2xl text-center flex flex-col items-center justify-center"
              style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)" }}
            >
              <div className="text-3xl mb-4">✉️</div>
              <h3 className="font-semibold mb-2" style={{ color: "#0F2447" }}>{t(lang, "邮件", "Email")}</h3>
              <a
                href="mailto:info@npodia.org"
                className="text-sm font-medium hover:underline"
                style={{ color: "#C8923D" }}
              >
                info@npodia.org
              </a>
              <p className="text-xs mt-4 leading-relaxed" style={{ color: "#4A5468" }}>
                {t(lang, "会员申请、合作咨询均可发邮件，我们将在 2 个工作日内回复。", "For membership applications and partnership inquiries. We respond within 2 business days.")}
              </p>
            </div>

            {/* YouTube */}
            <div
              className="p-8 rounded-2xl text-center flex flex-col items-center justify-center"
              style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)" }}
            >
              <div className="text-3xl mb-4">▶️</div>
              <h3 className="font-semibold mb-2" style={{ color: "#0F2447" }}>YouTube</h3>
              <a
                href="https://youtube.com/@npodiaorg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
                style={{ color: "#C8923D" }}
              >
                @npodiaorg
              </a>
              <p className="text-xs mt-4 leading-relaxed" style={{ color: "#4A5468" }}>
                {t(lang, "行业资讯、合规教育视频、经验分享，持续更新中。", "Industry news, compliance education videos, and experience sharing — updated regularly.")}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contactForm" className="mt-16 max-w-2xl mx-auto">
            <h3
              className="text-center mb-8 font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "#0F2447", fontSize: "1.2rem" }}
            >
              {t(lang, "发送留言", "Send a Message")}
            </h3>
            {formSent ? (
              <div
                className="text-center py-10 rounded-2xl"
                style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)" }}
              >
                <p className="text-3xl mb-3">✅</p>
                <p className="font-semibold text-lg mb-2" style={{ color: "#0F2447" }}>
                  {t(lang, "留言已发送！", "Message sent!")}
                </p>
                <p className="text-sm" style={{ color: "#4A5468" }}>
                  {t(
                    lang,
                    "我们将在 2 个工作日内回复。如您提供了邮箱，确认邮件已发出。",
                    "We'll reply within 2 business days. A confirmation email has been sent if you provided an email address."
                  )}
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-5 text-sm underline"
                  style={{ color: "#C8923D" }}
                >
                  {t(lang, "再次留言", "Send another message")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className="p-8 rounded-2xl space-y-5"
                style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)" }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                      {t(lang, "姓名", "Name")} *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                      placeholder={t(lang, "您的姓名", "Your name")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                      {t(lang, "微信 / 邮件", "WeChat / Email")} *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.contact}
                      onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                      placeholder={t(lang, "方便联系您的方式", "How to reach you")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                    {t(lang, "事由", "Subject")} *
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 bg-white"
                    style={{ border: "1px solid rgba(15,36,71,0.15)", color: form.subject ? "#1A1F2E" : "#9CA3AF" }}
                  >
                    <option value="" disabled>{t(lang, "请选择事由", "Select a subject")}</option>
                    <option value={t(lang, "标准会员申请（$12/年）", "Standard Membership Application ($12/yr)")}>
                      {t(lang, "标准会员申请（$12/年）", "Standard Membership Application ($12/yr)")}
                    </option>
                    <option value={t(lang, "援助会员申请（$1/年）", "Subsidized Membership Application ($1/yr)")}>
                      {t(lang, "援助会员申请（$1/年）", "Subsidized Membership Application ($1/yr)")}
                    </option>
                    <option value={t(lang, "合作咨询", "Partnership Inquiry")}>
                      {t(lang, "合作咨询", "Partnership Inquiry")}
                    </option>
                    <option value={t(lang, "一般问题", "General Inquiry")}>
                      {t(lang, "一般问题", "General Inquiry")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                    {t(lang, "留言", "Message")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 resize-none"
                    style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                    placeholder={t(lang, "请描述您的情况或问题…", "Please describe your situation or question…")}
                  />
                </div>
                {formError && (
                  <p className="text-sm text-center py-2 rounded-lg" style={{ color: "#be123c", backgroundColor: "#fff1f2" }}>
                    {t(lang, "发送失败，请直接发邮件至 info@npodia.org", "Submission failed. Please email us at info@npodia.org")}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ backgroundColor: "#C8923D" }}
                >
                  {formSubmitting
                    ? t(lang, "发送中…", "Sending…")
                    : t(lang, "发送留言", "Send Message")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 px-6" style={{ backgroundColor: "#0A1830" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="DIA Logo" width={32} height={32} className="rounded-md opacity-90" />
              <div>
                <p className="text-white font-semibold text-sm">Drive Forward Immigrant Alliance</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {t(lang, "移路前行联盟", "移路前行联盟")}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-xs hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {t(lang, l.zh, l.en)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              © 2026 Drive Forward Immigrant Alliance. {t(lang, "保留所有权利。", "All rights reserved.")}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {t(
                lang,
                "IRS 501(c)(3) 认定非营利组织 · EIN 42-1921384 · 加州注册",
                "IRS 501(c)(3) Recognized Nonprofit · EIN 42-1921384 · California"
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
