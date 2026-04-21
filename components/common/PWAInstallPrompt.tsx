"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { premiumToast as toast } from "@/components/ui/PremiumToast";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Detect if it's mobile
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();

    // 2. Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);

      // Check if user has already dismissed it in this session or recently
      const isDismissed = localStorage.getItem("pwa_prompt_dismissed");
      const lastDismissedTime = localStorage.getItem(
        "pwa_prompt_dismissed_time",
      );

      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      // Show if never dismissed or dismissed more than 24 hours ago
      if (
        !isDismissed ||
        (lastDismissedTime && now - parseInt(lastDismissedTime) > oneDay)
      ) {
        // Delay showing to not be too intrusive right at the start
        setTimeout(() => {
          setIsVisible(true);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setIsVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem("pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 3. Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the PWA install");
      setIsVisible(false);
      localStorage.setItem("pwa_installed", "true");
    } else {
      console.log("User dismissed the PWA install");
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_prompt_dismissed", "true");
    localStorage.setItem(
      "pwa_prompt_dismissed_time",
      new Date().getTime().toString(),
    );
  };

  if (!isVisible || !isMobile) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[9999] animate-in slide-in-from-bottom-10 duration-700">
      <div className="relative overflow-hidden bg-[#0B1221] text-white rounded-[2rem] p-6 shadow-2xl border border-white/10 flex flex-col items-center sm:flex-row sm:justify-between gap-6 ring-1 ring-white/20">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full translate-x-1/2 translate-y-1/2" />

        {/* Content */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
            <Smartphone size={24} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-tight">
              ZNVBE APP
            </h3>
            <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest leading-none mt-1">
              Install for a faster, better experience.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#0B1221] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95"
          >
            <Download size={14} />
            Install
          </button>

          <button
            onClick={handleDismiss}
            className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/5 group"
          >
            <X
              size={20}
              className="group-hover:rotate-90 transition-transform duration-500"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
