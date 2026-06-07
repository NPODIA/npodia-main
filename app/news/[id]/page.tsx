import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NewsArticle, { Article } from "./NewsArticle";

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

async function fetchPost(id: string): Promise<NewsRow | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  // 仅允许合法 UUID，避免拼接异常
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
  const post = await fetchPost(id);
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

  return <NewsArticle article={article} />;
}
