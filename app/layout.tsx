import { DesktopCursor } from "@/components/desktop/DesktopCursor";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PremiumToaster } from "@/components/ui/PremiumToast";
import type { Metadata } from "next";
import { Sora, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avlora Wear - Premium Quality Apparel",
  description:
    "Experience premium fashion with Avlora Wear. High-quality garments designed for style and comfort.",
  metadataBase: new URL("https://avlorawear.vercel.app"),
  keywords: [
    "fashion",
    "apparel",
    "premium clothing",
    "Avlora Wear",
    "Dhaka fashion",
  ],
  alternates: {
    canonical: "https://avlorawear.vercel.app",
  },
  openGraph: {
    title: "Avlora Wear - Premium Quality Apparel",
    description:
      "Experience premium fashion with Avlora Wear. High-quality garments designed for style and comfort.",
    url: "https://avlorawear.vercel.app",
    siteName: "Avlora Wear",
    images: [
      {
        url: "https://avlorawear.vercel.app/white-color-domain.png",
        width: 1200,
        height: 630,
        alt: "Avlora Wear - Premium Fashion Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avlora Wear - Premium Quality Apparel",
    description:
      "Experience premium fashion with Avlora Wear. High-quality garments designed for style and comfort.",
    images: ["https://avlorawear.vercel.app/white-color-domain.png"],
    creator: "@avlorawear",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Avlora Wear",
    url: "https://avlorawear.vercel.app",
    logo: "https://avlorawear.vercel.app/logo.png",
    sameAs: [
      "https://facebook.com/avlorawear",
      "https://instagram.com/avlorawear",
    ],
  };

  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#0B1221" />
      </head>
      <body
        className={`${sora.variable} ${dmSans.variable} ${playfair.variable} ${sora.className} min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <StoreProvider>
          {/* Desktop-only glowing cursor */}
          <DesktopCursor />
          {/* <TopBar /> */}
          <AnnouncementBar />
          <Header />
          <main className="flex-grow w-full pb-[20px] lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <PremiumToaster />
        </StoreProvider>
      </body>
    </html>
  );
}
