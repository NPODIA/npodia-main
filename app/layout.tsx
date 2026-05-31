import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import SwRegister from "./sw-register";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#0F2447",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Drive Forward Immigrant Alliance | 移路前行联盟",
  description:
    "北美华人卡车从业者的行业社群与资源平台。Professional support, compliance education, and community for Chinese-speaking trucking professionals in North America.",
  keywords: ["卡车司机", "华人物流", "CDL", "DOT合规", "truck driver", "FMCSA", "NPODIA"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DIA",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Drive Forward Immigrant Alliance",
    description: "北美华人卡车从业者行业社群",
    url: "https://www.npodia.org",
    siteName: "NPODIA",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
