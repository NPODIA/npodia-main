import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NewsListClient from "./NewsListClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "行业资讯 · Drive Forward Immigrant Alliance",
  description: "美国卡车货运行业最新法规资讯，FMCSA、CARB、DOT 合规动态。",
};

type NewsRow = {
  id: string;
  title_zh: string;
  title_en: string | null;
  content_zh: string;
  content_en: string | null;
  cover_image_url: string | null;
  source_url: string | null;
  published_at: string | null;
};

const FALLBACK_IMAGES = [
  "/news/dot-inspection.jpg",
  "/news/carb-electric.jpg",
  "/news/cdl-driver.jpg",
  "/news/truck-highway.jpg",
  "/news/truck-white.jpg",
  "/news/truck-dark.jpg",
];

export default async function NewsListPage() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) notFound();

  const res = await fetch(
    `${url}/rest/v1/news_posts?status=eq.published&order=published_at.desc.nullslast&select=*`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    }
  );
  if (!res.ok) notFound();
  const rows = (await res.json()) as NewsRow[];

  const posts = rows.map((n, i) => ({
    id: n.id,
    image: n.cover_image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
    date: n.published_at ? n.published_at.slice(0, 10) : "",
    titleZh: n.title_zh,
    titleEn: n.title_en || n.title_zh,
    excerptZh: (n.content_zh || "").slice(0, 140),
    excerptEn: (n.content_en || n.content_zh || "").slice(0, 180),
  }));

  return <NewsListClient posts={posts} />;
}
