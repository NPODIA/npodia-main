"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Lang = "zh" | "en";
const t = (lang: Lang, zh: string, en: string) => (lang === "zh" ? zh : en);

export type Article = {
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  cover: string;
  date: string;
  sourceUrl: string;
};

export default function NewsArticle({ article }: { article: Article }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("npodia-lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  const switchLang = () => {
    const next: Lang = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("npodia-lang", next);
  };

  const title = t(lang, article.titleZh, article.titleEn || article.titleZh);
  const content = t(lang, article.contentZh, article.contentEn || article.contentZh);
  const paragraphs = content.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <main style={{ backgroundColor: "#FAF7F2", minHeight: "100vh" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50" style={{ backgroundColor: "#0F2447" }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/#news" className="text-sm text-white/75 hover:text-white transition-colors">
            ← {t(lang, "返回资讯", "Back to News")}
          </Link>
          <button
            onClick={switchLang}
            className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            {t(lang, "EN", "中文")}
          </button>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#C8923D" }}>
          {t(lang, "行业资讯", "Industry News")}
        </p>
        <h1
          className="mb-3 leading-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#0F2447" }}
        >
          {title}
        </h1>
        {article.date && (
          <p className="text-sm mb-8" style={{ color: "#4A5468" }}>{article.date}</p>
        )}

        {article.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt={title}
            className="w-full rounded-2xl mb-10 object-cover"
            style={{ maxHeight: "420px" }}
          />
        )}

        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: "#1A1F2E" }}>
              {p}
            </p>
          ))}
        </div>

        {article.sourceUrl && (
          <p className="mt-10 pt-6 text-sm" style={{ borderTop: "1px solid rgba(15,36,71,0.1)", color: "#4A5468" }}>
            {t(lang, "资料来源：", "Source: ")}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
              style={{ color: "#C8923D" }}
            >
              {article.sourceUrl}
            </a>
          </p>
        )}

        <div className="mt-12">
          <Link
            href="/#membership"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: "#C8923D" }}
          >
            {t(lang, "成为 DIA 会员", "Become a DIA Member")}
          </Link>
        </div>
      </article>
    </main>
  );
}
