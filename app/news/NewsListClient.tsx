"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Lang = "zh" | "en";
const t = (lang: Lang, zh: string, en: string) => (lang === "zh" ? zh : en);

type Post = {
  id: string;
  image: string;
  date: string;
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
};

export default function NewsListClient({ posts }: { posts: Post[] }) {
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

  return (
    <main style={{ backgroundColor: "#FAF7F2", minHeight: "100vh" }}>
      <div className="sticky top-0 z-50" style={{ backgroundColor: "#0F2447" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/#news" className="text-sm text-white/75 hover:text-white transition-colors">
            ← {t(lang, "返回首页", "Back to Home")}
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#C8923D" }}>
          {t(lang, "行业资讯", "Industry News")}
        </p>
        <h1
          className="mb-10"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0F2447" }}
        >
          {t(lang, "全部资讯", "All News")}
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.id}`}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block"
              style={{
                backgroundColor: "white",
                border: "1px solid rgba(15,36,71,0.08)",
                boxShadow: "0 2px 12px rgba(15,36,71,0.06)",
              }}
            >
              <div className="h-36 relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={t(lang, post.titleZh, post.titleEn)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0" style={{ background: "rgba(15,36,71,0.45)" }} />
                <span
                  className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#C8923D", color: "white" }}
                >
                  {t(lang, "行业资讯", "Industry News")}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs mb-2" style={{ color: "#4A5468" }}>{post.date}</p>
                <h3
                  className="font-semibold mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "#0F2447" }}
                >
                  {t(lang, post.titleZh, post.titleEn)}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#4A5468" }}>
                  {t(lang, post.excerptZh, post.excerptEn)}
                </p>
                <p className="mt-3 text-xs font-medium" style={{ color: "#C8923D" }}>
                  {t(lang, "阅读全文 →", "Read more →")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center py-20" style={{ color: "#4A5468" }}>
            {t(lang, "暂无资讯", "No news yet")}
          </p>
        )}
      </div>
    </main>
  );
}
