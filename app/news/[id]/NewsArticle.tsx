"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

export type RelatedPost = {
  id: string;
  titleZh: string;
  titleEn: string;
  image: string;
  date: string;
};

export default function NewsArticle({ article, related = [] }: { article: Article; related?: RelatedPost[] }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("npodia-lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  const title = t(lang, article.titleZh, article.titleEn || article.titleZh);
  const content = t(lang, article.contentZh, article.contentEn || article.contentZh);
  const paragraphs = content.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <main style={{ backgroundColor: "#FAF7F2", minHeight: "100vh" }}>
      <div className="sticky top-0 z-50" style={{ backgroundColor: "#0F2447" }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between relative">
          <Link href="/news" className="text-sm text-white/75 hover:text-white transition-colors">
            ← {t(lang, "全部资讯", "All News")}
          </Link>
          <Link
            href="/"
            className="text-white font-semibold tracking-wide text-sm absolute left-1/2 -translate-x-1/2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            DIA
          </Link>
          <div
            className="flex items-center rounded-full overflow-hidden text-xs"
            style={{ border: "1px solid rgba(255,255,255,0.25)" }}
          >
            {(["zh", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); localStorage.setItem("npodia-lang", l); }}
                className="px-3 py-1.5 transition-all"
                style={{
                  backgroundColor: lang === l ? "#0F2447" : "transparent",
                  color: lang === l ? "white" : "rgba(255,255,255,0.5)",
                }}
              >
                {l === "zh" ? "中" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#996B1D" }}>
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
              style={{ color: "#996B1D" }}
            >
              {article.sourceUrl}
            </a>
          </p>
        )}

        {related.length > 0 && (
          <section className="mt-16 pt-10" style={{ borderTop: "1px solid rgba(15,36,71,0.1)" }}>
            <h2 className="font-semibold mb-6" style={{ fontFamily: "var(--font-display)", color: "#0F2447", fontSize: "1.2rem" }}>
              {t(lang, "更多资讯", "More News")}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.id}`}
                  className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid rgba(15,36,71,0.08)",
                    boxShadow: "0 2px 8px rgba(15,36,71,0.05)",
                  }}
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={post.image}
                      alt={t(lang, post.titleZh, post.titleEn)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0" style={{ background: "rgba(15,36,71,0.4)" }} />
                  </div>
                  <div className="p-3">
                    <p className="text-xs mb-1" style={{ color: "#4A5468" }}>{post.date}</p>
                    <h3 className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "#0F2447" }}>
                      {t(lang, post.titleZh, post.titleEn)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/news"
                className="text-sm font-medium hover:underline"
                style={{ color: "#996B1D" }}
              >
                {t(lang, "查看全部资讯 →", "View All News →")}
              </Link>
            </div>
          </section>
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
