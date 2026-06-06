"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Lang = "zh" | "en";
const t = (lang: Lang, zh: string, en: string) => (lang === "zh" ? zh : en);

type NavLink = { id: string; zh: string; en: string; href?: string };
const NAV_LINKS: NavLink[] = [
  { id: "services", zh: "服务", en: "Services" },
  { id: "news", zh: "资讯", en: "News" },
  { id: "videos", zh: "视频", en: "Videos" },
  { id: "membership", zh: "会员", en: "Membership" },
  { id: "about", zh: "关于", en: "About" },
  { id: "contact", zh: "联系", en: "Contact" },
  { id: "community", zh: "社区", en: "Community", href: "https://info.npodia.org" },
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

export type NewsItem = {
  image: string;
  date: string;
  href: string;
  youtubeId?: string;
  zh: { tag: string; title: string; excerpt: string };
  en: { tag: string; title: string; excerpt: string };
};

export type VideoCategory = {
  id: string;
  zh: string;
  en: string;
  videos: { youtubeId: string; zh: { title: string }; en: { title: string } }[];
};


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


export default function HomeClient({ news, videoCategories }: { news: NewsItem[]; videoCategories: VideoCategory[] }) {
  const [lang, setLang] = useState<Lang>("zh");
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);

  // Membership application modal
  const [membershipModal, setMembershipModal] = useState<"standard" | "aid" | "volunteer" | null>(null);
  const [membershipForm, setMembershipForm] = useState({ firstName: "", lastName: "", email: "", phone: "", wechatId: "", message: "" });
  const [membershipSent, setMembershipSent] = useState(false);
  const [membershipSubmitting, setMembershipSubmitting] = useState(false);
  const [membershipError, setMembershipError] = useState(false);

  // Video player modal（存当前播放的 YouTube ID 与标题;id 为空串时显示「即将上线」占位）
  const [videoModal, setVideoModal] = useState<{ id: string; title: string } | null>(null);

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

  const applyForMembership = (tier: "standard" | "aid" | "volunteer") => {
    setMembershipModal(tier);
    setMembershipSent(false);
    setMembershipError(false);
    setMembershipForm({ firstName: "", lastName: "", email: "", phone: "", wechatId: "", message: "" });
  };

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMembershipSubmitting(true);
    setMembershipError(false);
    try {
      const res = await fetch("/api/membership/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...membershipForm, tier: membershipModal, lang }),
      });
      if (res.ok) setMembershipSent(true);
      else setMembershipError(true);
    } catch {
      setMembershipError(true);
    } finally {
      setMembershipSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
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
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(15,36,71,0.97)" : "rgba(15,36,71,0)",
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
            {NAV_LINKS.map((l) =>
              l.href ? (
                <a
                  key={l.id}
                  href={l.href}
                  className="text-white/80 hover:text-white px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
                >
                  {t(lang, l.zh, l.en)}
                </a>
              ) : (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-white/80 hover:text-white px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
                >
                  {t(lang, l.zh, l.en)}
                </button>
              )
            )}
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
            <a
              href="https://info.npodia.org/login"
              className="hidden sm:block text-sm px-4 py-2 rounded-full font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)" }}
            >
              {t(lang, "登录", "Login")}
            </a>
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
            {NAV_LINKS.map((l) =>
              l.href ? (
                <a
                  key={l.id}
                  href={l.href}
                  className="block w-full text-left text-white/80 hover:text-white py-3 text-sm border-b border-white/5 last:border-0"
                >
                  {t(lang, l.zh, l.en)}
                </a>
              ) : (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="block w-full text-left text-white/80 hover:text-white py-3 text-sm border-b border-white/5 last:border-0"
                >
                  {t(lang, l.zh, l.en)}
                </button>
              )
            )}
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
              <a
                href="https://info.npodia.org"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all hover:bg-white/10"
                style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}
              >
                {t(lang, "进入社区", "Community")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
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
            {news.map((n, i) => {
              const cardClass = "rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block w-full";
              const cardStyle = {
                backgroundColor: "white",
                border: "1px solid rgba(15,36,71,0.08)",
                boxShadow: "0 2px 12px rgba(15,36,71,0.06)",
              };
              const inner = (
                <>
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
                    {n.href && (
                      <p className="mt-3 text-xs font-medium" style={{ color: "#C8923D" }}>
                        {t(lang, "阅读原文 →", "Read more →")}
                      </p>
                    )}
                  </div>
                </>
              );
              return n.href ? (
                <a
                  key={i}
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                  style={cardStyle}
                >
                  {inner}
                </a>
              ) : (
                <div key={i} className={cardClass} style={cardStyle}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Videos ───────────────────────────────────────────────────── */}
      <section id="videos" className="py-24 px-6" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#C8923D" }}>
            {t(lang, "视频中心", "Video Center")}
          </p>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#0F2447" }}
          >
            {t(lang, "看视频，学得更快", "Learn Faster with Video")}
          </h2>
          <p className="text-center mb-16 max-w-2xl mx-auto" style={{ color: "#4A5468" }}>
            {t(lang, "行业资讯、税务合规、合规教育，持续更新中。", "Industry news, tax compliance, and compliance education — updated regularly.")}
          </p>

          <div className="space-y-14">
            {videoCategories.length === 0 && (
              <p className="text-center text-sm" style={{ color: "#4A5468" }}>
                {t(lang, "视频即将上线，敬请期待。", "Videos coming soon.")}
              </p>
            )}
            {videoCategories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-1 w-8 rounded-full" style={{ backgroundColor: "#C8923D" }} />
                  <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}>
                    {t(lang, cat.zh, cat.en)}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.videos.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setVideoModal({ id: v.youtubeId, title: t(lang, v.zh.title, v.en.title) })}
                      className="text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block w-full"
                      style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.08)", boxShadow: "0 2px 12px rgba(15,36,71,0.06)" }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {v.youtubeId ? (
                          <>
                            <Image
                              src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                              alt={t(lang, v.zh.title, v.en.title)}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0" style={{ background: "rgba(15,36,71,0.25)" }} />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #294E89, #0F2447)" }}>
                            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}>
                              {t(lang, "即将上线", "Coming soon")}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.92)" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F2447"><path d="M8 5v14l11-7z" /></svg>
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-sm leading-snug" style={{ color: "#0F2447" }}>
                          {t(lang, v.zh.title, v.en.title)}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
              "低门槛，真资源。三种会员，确保每位从业者都能加入。",
              "Low barrier, real resources. Three membership tiers so every professional can join."
            )}
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                  t(lang, "行业资源对接", "Industry resource referrals"),
                  t(lang, "会员专属活动邀请", "Member-only event invitations"),
                  t(lang, "更多会员福利敬请期待", "More member benefits coming soon"),
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

            {/* Volunteer */}
            <div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: "white", border: "1px solid rgba(15,36,71,0.12)", boxShadow: "0 2px 12px rgba(15,36,71,0.06)" }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase block mb-2" style={{ color: "#1B7A57" }}>
                {t(lang, "义工会员", "Volunteer")}
              </span>
              <div className="mb-6">
                <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}>$3</span>
                <span className="ml-2 text-sm" style={{ color: "#4A5468" }}>{t(lang, "/ 年", "/ year")}</span>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#4A5468" }}>
                {t(
                  lang,
                  "以服务换成长。根据自己的时间灵活参与，能做多少做多少，共建社区并获得专属认可与资源。",
                  "Grow by giving back. Pitch in on your own schedule, as much or as little as you can, and earn recognition and resources."
                )}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  t(lang, "官方服务时数证明 / 推荐信", "Official service-hour letter / reference"),
                  t(lang, "义工榜表彰 + 年度证书", "Volunteer wall + annual certificate"),
                  t(lang, "优先活动名额 + 时数兑换资源", "Priority event spots + hours-for-resources"),
                  t(lang, "根据自己时间灵活认领工作，无时限要求", "Flexible — take on tasks on your own schedule, no time commitment"),
                  t(lang, "更多义工福利敬请期待", "More volunteer benefits coming soon"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#1A1F2E" }}>
                    <span className="mt-0.5 shrink-0 text-base" style={{ color: "#1B7A57" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => applyForMembership("volunteer")}
                className="w-full py-3.5 rounded-full font-semibold transition-all hover:scale-105"
                style={{ border: "2px solid #1B7A57", color: "#1B7A57" }}
              >
                {t(lang, "申请义工会员", "Apply — $3/yr")}
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

          {/* 已是会员 → 进入社区 */}
          <div className="mt-10 text-center">
            <p className="text-sm mb-3" style={{ color: "#4A5468" }}>
              {t(lang, "已是会员？", "Already a member?")}
            </p>
            <a
              href="https://info.npodia.org"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: "#0F2447" }}
            >
              {t(lang, "进入社区平台", "Enter Community")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
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
                height={160}
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

      {/* ── Membership Application Modal ─────────────────────────────── */}
      {membershipModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10,24,48,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setMembershipModal(null); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "white", maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Modal header */}
            <div className="px-8 py-6 flex items-center justify-between" style={{ backgroundColor: "#0F2447" }}>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C8923D" }}>
                  {t(lang, "会员申请", "Membership Application")}
                </p>
                <p className="text-white font-semibold text-lg">
                  {membershipModal === "standard"
                    ? t(lang, "标准会员 · $12/年", "Standard · $12/yr")
                    : membershipModal === "volunteer"
                    ? t(lang, "义工会员 · $3/年", "Volunteer · $3/yr")
                    : t(lang, "援助会员 · $1/年", "Subsidized · $1/yr")}
                </p>
              </div>
              <button
                onClick={() => setMembershipModal(null)}
                className="text-white/60 hover:text-white text-2xl font-light leading-none"
              >
                ×
              </button>
            </div>

            {membershipSent ? (
              <div className="px-8 py-12 text-center">
                <p className="text-4xl mb-4">✅</p>
                <p className="font-semibold text-xl mb-2" style={{ color: "#0F2447" }}>
                  {t(lang, "申请已提交！", "Application submitted!")}
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A5468" }}>
                  {t(
                    lang,
                    "我们已收到您的会员申请，管理员将在 3–5 个工作日内通过邮件联系您，说明付款方式（Zelle）及账号激活步骤。",
                    "We've received your application. Our team will email you within 3–5 business days with payment instructions (Zelle) and account activation steps."
                  )}
                </p>
                <button
                  onClick={() => setMembershipModal(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: "#C8923D" }}
                >
                  {t(lang, "关闭", "Close")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleMembershipSubmit} className="px-8 py-6 space-y-4">
                {membershipModal === "aid" && (
                  <div
                    className="text-sm leading-relaxed p-4 rounded-xl"
                    style={{ backgroundColor: "#FEF3C7", color: "#92400e" }}
                  >
                    {t(
                      lang,
                      "援助会员适用于目前失业或年收入低于联邦贫困线 120% 的从业者。请在留言中简要说明您的情况。",
                      "Subsidized membership is for those currently unemployed or earning below 120% of the federal poverty line. Please briefly explain your situation in the message field."
                    )}
                  </div>
                )}
                {membershipModal === "volunteer" && (
                  <div
                    className="text-sm leading-relaxed p-4 rounded-xl"
                    style={{ backgroundColor: "#DCFCE7", color: "#166534" }}
                  >
                    {t(
                      lang,
                      "欢迎加入义工！时间灵活、能做多少做多少。请在留言中说明您能投入的方向（如内容、活动、商家对接等）。",
                      "Welcome aboard! Flexible schedule, contribute as much as you can. Please note in the message how you'd like to help (content, events, business outreach, etc.)."
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                      {t(lang, "名", "First Name")} *
                    </label>
                    <input
                      required
                      type="text"
                      value={membershipForm.firstName}
                      onChange={e => setMembershipForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                      placeholder={t(lang, "名字", "First name")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                      {t(lang, "姓", "Last Name")} *
                    </label>
                    <input
                      required
                      type="text"
                      value={membershipForm.lastName}
                      onChange={e => setMembershipForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                      placeholder={t(lang, "姓氏", "Last name")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                    {t(lang, "邮箱", "Email")} *
                  </label>
                  <input
                    required
                    type="email"
                    value={membershipForm.email}
                    onChange={e => setMembershipForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                    style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                    {t(lang, "账号激活邮件将发至此邮箱", "Account activation will be sent to this email")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                      {t(lang, "微信号", "WeChat ID")}
                    </label>
                    <input
                      type="text"
                      value={membershipForm.wechatId}
                      onChange={e => setMembershipForm(p => ({ ...p, wechatId: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                      placeholder="NPODIA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                      {t(lang, "电话", "Phone")}
                    </label>
                    <input
                      type="tel"
                      value={membershipForm.phone}
                      onChange={e => setMembershipForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                      placeholder="(626) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F2447" }}>
                    {t(lang,
                      membershipModal === "aid" ? "申请说明 *" : "留言（可选）",
                      membershipModal === "aid" ? "Explanation *" : "Message (optional)"
                    )}
                  </label>
                  <textarea
                    required={membershipModal === "aid"}
                    rows={3}
                    value={membershipForm.message}
                    onChange={e => setMembershipForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 resize-none"
                    style={{ border: "1px solid rgba(15,36,71,0.15)", color: "#1A1F2E" }}
                    placeholder={t(
                      lang,
                      membershipModal === "aid" ? "请简述您目前的就业或收入情况…" : "有什么想告诉我们的？",
                      membershipModal === "aid" ? "Please briefly describe your current employment or income situation…" : "Anything you'd like to share?"
                    )}
                  />
                </div>

                {membershipError && (
                  <p className="text-sm text-center py-2 rounded-lg" style={{ color: "#be123c", backgroundColor: "#fff1f2" }}>
                    {t(lang, "提交失败，请直接发邮件至 info@npodia.org", "Submission failed. Please email info@npodia.org")}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMembershipModal(null)}
                    className="flex-1 py-3 rounded-full text-sm font-medium transition-all"
                    style={{ border: "1px solid rgba(15,36,71,0.2)", color: "#4A5468" }}
                  >
                    {t(lang, "取消", "Cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={membershipSubmitting}
                    className="flex-1 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ backgroundColor: "#C8923D" }}
                  >
                    {membershipSubmitting
                      ? t(lang, "提交中…", "Submitting…")
                      : t(lang, "提交申请", "Submit Application")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Video Modal ──────────────────────────────────────────────── */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10,24,48,0.85)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setVideoModal(null); }}
        >
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-medium text-sm pr-4">{videoModal.title}</p>
              <button
                onClick={() => setVideoModal(null)}
                className="text-white/70 hover:text-white text-3xl font-light leading-none shrink-0"
                aria-label={t(lang, "关闭", "Close")}
              >
                ×
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "#000" }}>
              {videoModal.id ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoModal.id}?autoplay=1&rel=0`}
                  title={videoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6" style={{ background: "linear-gradient(135deg, #1B3A6B, #0F2447)" }}>
                  <div className="text-4xl mb-3">🎬</div>
                  <p className="text-white font-semibold mb-1">{t(lang, "视频即将上线", "Video coming soon")}</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {t(lang, "我们正在制作中，敬请期待。", "We're producing this content. Stay tuned.")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              {NAV_LINKS.map((l) =>
                l.href ? (
                  <a
                    key={l.id}
                    href={l.href}
                    className="text-xs hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {t(lang, l.zh, l.en)}
                  </a>
                ) : (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="text-xs hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {t(lang, l.zh, l.en)}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              © 2026 Drive Forward Immigrant Alliance. {t(lang, "保留所有权利。", "All rights reserved.")}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontVariantLigatures: "none" }}>
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
