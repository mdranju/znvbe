import { DesktopCursor } from "@/components/desktop/DesktopCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { PremiumToaster } from "@/components/ui/PremiumToast";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Avlora Wear - Premium Quality Apparel",
  description: "Experience premium fashion with Avlora Wear. High-quality garments designed for style and comfort.",
  metadataBase: new URL("https://avlorawear.com"),
  openGraph: {
    title: "Avlora Wear - Premium Quality Apparel",
    description: "Experience premium fashion with Avlora Wear. High-quality garments designed for style and comfort.",
    url: "https://avlorawear.com",
    siteName: "Avlora Wear",
    images: [{ url: "/banner.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avlora Wear - Premium Quality Apparel",
    description: "Experience premium fashion with Avlora Wear. High-quality garments designed for style and comfort.",
    images: ["/banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.className} min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <StoreProvider>
          {/* Desktop-only glowing cursor */}
          <DesktopCursor />
          <TopBar />
          <Header />
          <main className="flex-grow w-full pb-[65px] lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <PremiumToaster />
        </StoreProvider>
      </body>
    </html>
  );
}
