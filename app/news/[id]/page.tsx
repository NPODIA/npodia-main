import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NewsArticle, { Article, RelatedPost } from "./NewsArticle";

export const revalidate = 0;

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

async function fetchPost(id: string): Promise<NewsRow | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/news_posts?id=eq.${id}&status=eq.published&limit=1&select=*`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as NewsRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchRelated(currentId: string): Promise<RelatedPost[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/news_posts?status=eq.published&id=neq.${currentId}&order=published_at.desc.nullslast&limit=3&select=id,title_zh,title_en,cover_image_url,published_at`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as NewsRow[];
    return rows.map((r, i) => ({
      id: r.id,
      titleZh: r.title_zh,
      titleEn: r.title_en || r.title_zh,
      image: r.cover_image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      date: r.published_at ? r.published_at.slice(0, 10) : "",
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) return { title: "资讯 · Drive Forward Immigrant Alliance" };
  return {
    title: `${post.title_zh} · 移路前行联盟`,
    description: (post.content_zh || "").slice(0, 140),
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, related] = await Promise.all([fetchPost(id), fetchRelated(id)]);
  if (!post) notFound();

  const article: Article = {
    titleZh: post.title_zh,
    titleEn: post.title_en || post.title_zh,
    contentZh: post.content_zh,
    contentEn: post.content_en || post.content_zh,
    cover: post.cover_image_url || "",
    date: post.published_at ? post.published_at.slice(0, 10) : "",
    sourceUrl: post.source_url || "",
  };

  return <NewsArticle article={article} related={related} />;
}
