import { BackToTopButton } from "@/components/common/BackToTopButton";
import { FloatingWhatsAppButton } from "@/components/common/FloatingWhatsAppButton";
import { PWAInstallPrompt } from "@/components/common/PWAInstallPrompt";
import { DesktopCursor } from "@/components/desktop/DesktopCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PremiumToaster } from "@/components/ui/PremiumToast";
import { SITE_CONFIG } from "@/src/config/site";
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Sora } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "700", "800"], // Explicit weights to save bytes
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.meta.title,
  description: SITE_CONFIG.meta.description,
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  keywords: SITE_CONFIG.meta.keywords,
  alternates: {
    canonical: SITE_CONFIG.baseUrl,
  },
  openGraph: {
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Premium Fashion Banner`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    images: [`${SITE_CONFIG.baseUrl}/og-image.png`],
    creator: "@znvbe",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
    logo: `${SITE_CONFIG.baseUrl}/logo.png`,
    sameAs: [SITE_CONFIG.socials.facebook, SITE_CONFIG.socials.instagram],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Performance: Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#0B1221" />
      </head>
      <body
        className={`${sora.variable} ${dmSans.variable} ${playfair.variable} ${sora.className} min-h-screen flex flex-col antialiased selection:bg-blue-600/20`}
        suppressHydrationWarning
      >
        <StoreProvider>
          {/* Desktop-only glowing cursor */}
          <DesktopCursor />

          <Header />
          <main
            id="main-content"
            className="flex-grow w-full pb-[20px] lg:pb-0"
          >
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <FloatingWhatsAppButton />
          <BackToTopButton />
          <PremiumToaster />
          <PWAInstallPrompt />
        </StoreProvider>
      </body>
    </html>
  );
}
