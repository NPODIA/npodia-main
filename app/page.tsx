import HomeClient, { NewsItem, VideoCategory } from "./HomeClient";

export const revalidate = 0;

const FALLBACK_IMAGES = [
  "/news/dot-inspection.jpg",
  "/news/carb-electric.jpg",
  "/news/cdl-driver.jpg",
  "/news/truck-highway.jpg",
  "/news/truck-white.jpg",
  "/news/truck-dark.jpg",
];

type NewsRow = {
  title_zh: string;
  title_en: string | null;
  content_zh: string;
  content_en: string | null;
  cover_image_url: string | null;
  source_url: string | null;
  published_at: string | null;
};

type VideoRow = {
  category: "industry" | "tax" | "compliance";
  youtube_id: string;
  title_zh: string;
  title_en: string | null;
};

async function sb<T>(path: string): Promise<T[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

function buildVideoCategories(rows: VideoRow[]): VideoCategory[] {
  const cats: VideoCategory[] = [
    { id: "industry", zh: "行业资讯", en: "Industry News", videos: [] },
    { id: "tax", zh: "税务合规", en: "Tax Compliance", videos: [] },
    { id: "compliance", zh: "合规教育", en: "Compliance Education", videos: [] },
  ];
  for (const v of rows) {
    const cat = cats.find((c) => c.id === v.category);
    if (cat) cat.videos.push({
      youtubeId: v.youtube_id,
      zh: { title: v.title_zh },
      en: { title: v.title_en || v.title_zh },
    });
  }
  return cats.filter((c) => c.videos.length > 0);
}

export default async function Page() {
  const settings = await sb<{ value: string }>("site_settings?key=eq.home_news_limit&select=value");
  const limit = parseInt(settings?.[0]?.value ?? "6", 10) || 6;

  const [newsRows, videoRows] = await Promise.all([
    sb<NewsRow>(`news_posts?status=eq.published&order=published_at.desc.nullslast&limit=${limit}&select=*`),
    sb<VideoRow>("videos?status=eq.published&order=sort_order.asc&select=*"),
  ]);

  const news: NewsItem[] = newsRows.map((n, i) => ({
    image: n.cover_image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
    date: n.published_at ? n.published_at.slice(0, 7) : "",
    href: n.source_url || "",
    zh: { tag: "行业资讯", title: n.title_zh, excerpt: (n.content_zh || "").slice(0, 140) },
    en: {
      tag: "Industry News",
      title: n.title_en || n.title_zh,
      excerpt: (n.content_en || n.content_zh || "").slice(0, 180),
    },
  }));

  const videoCategories = buildVideoCategories(videoRows);

  return <HomeClient news={news} videoCategories={videoCategories} />;
}
