"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "radial-gradient(ellipse at 30% 40%, #1B3A6B 0%, #0F2447 60%, #0A1830 100%)" }}
    >
      <Image src="/logo.png" alt="DIA Logo" width={48} height={48} className="rounded-xl mb-8 opacity-90" />
      <p className="text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
        404
      </p>
      <p className="text-white/70 mb-2 text-lg">页面不存在</p>
      <p className="text-white/50 text-sm mb-10">Page not found</p>
      <button
        onClick={() => router.push("/")}
        className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
        style={{ backgroundColor: "#C8923D" }}
      >
        返回首页 · Home
      </button>
    </div>
  );
}
