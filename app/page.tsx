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
    img: "/news/cdl-driver.jpg",
    date: "2026-05",
    zh: { tag: "法规动态", title: "FMCSA 将限制非本地 CDL 持牌驾驶员", excerpt: "联邦机动车运营安全管理局提案将严格审查在美国以外取得商业驾照的司机，预计年底生效，影响数千名华人司机。" },
    en: { tag: "Regulation", title: "FMCSA to Restrict Drivers with Foreign CDLs", excerpt: "FMCSA proposes stricter review of drivers who obtained commercial licenses outside the U.S., expected to take effect by year-end." },
  },
  {
    img: "/news/dot-inspection.jpg",
    date: "2026-06",
    zh: { tag: "安全检查", title: "2026 DOT Blitz Week 时间已定", excerpt: "CVSA 年度路边安全检查周定于 2026 年 6 月，全美执法机构将对 HOS 违规、设备故障、危险品运输集中执法。" },
    en: { tag: "Safety", title: "2026 DOT Roadcheck Blitz Week Scheduled", excerpt: "CVSA's annual roadside inspection blitz is set for June 2026, with enforcement targeting HOS violations, equipment defects, and hazardous materials." },
  },
  {
    img: "/news/carb-electric.jpg",
    date: "2026-04",
    zh: { tag: "加州法规", title: "CARB 2026：加州卡车零排放新规生效", excerpt: "加州空气资源局新规要求更多中重型卡车符合零排放标准，Owner-Operator 需尽早了解合规路径，避免高额罚款。" },
    en: { tag: "California", title: "CARB 2026: Zero-Emission Truck Rules Take Effect", excerpt: "California Air Resources Board requires more medium and heavy-duty trucks to meet zero-emission standards. Understand compliance options early." },
  },
  {
    img: "/news/dot-inspection.jpg",
    date: "2026-03",
    zh: { tag: "保险合规", title: "MCS-90 保险要求更新：Owner-Op 必读", excerpt: "FMCSA 对 MCS-90 背书要求的最新解释影响独立车主运营商的责任险覆盖范围，建议在续保前与经纪人确认。" },
    en: { tag: "Insurance", title: "MCS-90 Endorsement Update: Must-Read for Owner-Ops", excerpt: "FMCSA's latest interpretation of MCS-90 endorsement requirements affects liability coverage for independent operators. Confirm with your broker before renewal." },
  },
  {
    img: "/news/cdl-driver.jpg",
    date: "2026-02",
    zh: { tag: "考照资讯", title: "加州 CDL 笔试新增中文选项", excerpt: "加州 DMV 宣布商业驾驶执照笔试正式支持中文版本，大幅降低语言门槛，有意考照的华人司机可直接预约。" },
    en: { tag: "CDL", title: "California CDL Written Test Now Available in Chinese", excerpt: "California DMV announces the commercial driver's license written test is now officially available in Chinese, significantly lowering the language barrier." },
  },
  {
    img: "/news/carb-electric.jpg",
    date: "2026-01",
    zh: { tag: "HOS 规则", title: "2026 HOS 豁免更新：农业运输新规", excerpt: "FMCSA 更新农业商品运输的 HOS 豁免条款，扩大豁免范围并明确适用距离限制，影响从事农产品配送的华人司机。" },
    en: { tag: "HOS Rules", title: "2026 HOS Exemption Update for Agricultural Transport", excerpt: "FMCSA updates HOS exemptions for agricultural commodity transport, expanding scope and clarifying distance limits for drivers involved in produce delivery." },
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

  useEffect(() => {
    const saved = localStorage.getItem("npodia-lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLang = () => {
    const next: Lang = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("npodia-lang", next);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>

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
            <button
              onClick={switchLang}
              className="text-white/70 hover:text-white text-xs px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition-colors"
            >
              {lang === "zh" ? "EN" : "中文"}
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
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#0F2447" }}
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
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#0F2447" }}
          >
            {t(lang, "掌握行业动态，提前做好准备", "Stay Informed, Stay Ahead")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEWS.map((n, i) => (
              <article
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(15,36,71,0.08)",
                  boxShadow: "0 2px 12px rgba(15,36,71,0.06)",
                }}
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={n.img}
                    alt={t(lang, n.zh.title, n.en.title)}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: "#C8923D", color: "white" }}
                    >
                      {t(lang, n.zh.tag, n.en.tag)}
                    </span>
                  </div>
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
                </div>
              </article>
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
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#0F2447" }}
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
                onClick={() => scrollTo("contact")}
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
                onClick={() => scrollTo("contact")}
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
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
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

          <div className="border-t border-white/10 pt-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-8 text-center" style={{ color: "#C8923D" }}>
              {t(lang, "创始团队", "Founding Team")}
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { name: "Wenhao Huang", zh: { role: "财务官 (Treasurer)", bio: "税务与财务合规专家，为 DIA 提供财税专业支持。" }, en: { role: "Treasurer", bio: "Tax and financial compliance specialist, providing professional financial oversight for DIA." } },
                { name: "Lilu Zhao", zh: { role: "会长 (President)", bio: "货运经纪专家，在物流行业拥有深厚的社群运营经验。" }, en: { role: "President", bio: "Freight brokerage expert with deep experience in logistics community building." } },
                { name: "Dan Mi", zh: { role: "秘书 (Secretary)", bio: "商业保险专家，负责 DIA 行政管理与商家关系维护。" }, en: { role: "Secretary", bio: "Commercial insurance specialist, managing DIA administration and business relationships." } },
              ].map((m, i) => (
                <div key={i} className="text-center p-6 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div
                    className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white"
                    style={{ backgroundColor: "#C8923D" }}
                  >
                    {m.name[0]}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{m.name}</h3>
                  <p className="text-xs mb-3" style={{ color: "#C8923D" }}>{t(lang, m.zh.role, m.en.role)}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {t(lang, m.zh.bio, m.en.bio)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#F5EFE4" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>FAQ</p>
          <h2
            className="text-center mb-12"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#0F2447" }}
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
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#0F2447" }}
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
                width={140}
                height={140}
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
