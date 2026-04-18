import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  // Touch tracking refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastTouchDist = useRef<number | null>(null);
  const lastScale = useRef(1);
  const lastTranslate = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetTransform = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    lastScale.current = 1;
    lastTranslate.current = { x: 0, y: 0 };
  }, []);

  const handleManualZoom = (type: "in" | "out") => {
    const step = 0.5;
    const newScale = type === "in" 
      ? Math.min(4, scale + step) 
      : Math.max(1, scale - step);
    
    setScale(newScale);
    lastScale.current = newScale;
    
    if (newScale === 1) {
      resetTransform();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetTransform();
    }
  }, [isOpen, initialIndex, resetTransform]);

  const [isGesturing, setIsGesturing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
      if (e.key === "+" || e.key === "=") handleManualZoom("in");
      if (e.key === "-" || e.key === "_") handleManualZoom("out");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, currentIndex, scale]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(images.length - 1, index));
      setCurrentIndex(clamped);
      resetTransform();
    },
    [images.length, resetTransform],
  );

  const getDist = (touches: React.TouchList) =>
    Math.hypot(
      touches[1].clientX - touches[0].clientX,
      touches[1].clientY - touches[0].clientY,
    );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;

      if (lastScale.current > 1) {
        isPanning.current = true;
        setIsGesturing(true);
        panStart.current = {
          x: e.touches[0].clientX - lastTranslate.current.x,
          y: e.touches[0].clientY - lastTranslate.current.y,
        };
      } else {
        isPanning.current = false;
      }
    } else if (e.touches.length === 2) {
      isPanning.current = false;
      setIsGesturing(true);
      lastTouchDist.current = getDist(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      e.preventDefault();
      const newDist = getDist(e.touches);
      const delta = newDist / lastTouchDist.current;
      const newScale = Math.min(4, Math.max(1, lastScale.current * delta));
      setScale(newScale);
      if (newScale === 1) resetTransform();
    } else if (e.touches.length === 1 && isPanning.current) {
      const nx = e.touches[0].clientX - panStart.current.x;
      const ny = e.touches[0].clientY - panStart.current.y;
      setTranslate({ x: nx, y: ny });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && !isPanning.current) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      if (
        lastScale.current === 1 &&
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > 50
      ) {
        if (deltaX < 0) goTo(currentIndex + 1);
        else goTo(currentIndex - 1);
      }
    }

    if (e.touches.length < 2) {
      lastScale.current = scale;
      lastTranslate.current = translate;
      lastTouchDist.current = null;
      if (scale < 1.05) resetTransform();
    }
    if (e.touches.length === 0) {
      lastTranslate.current = translate;
      isPanning.current = false;
      setIsGesturing(false);
    }
  };

  // Mouse pan handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      isPanning.current = true;
      setIsGesturing(true);
      panStart.current = {
        x: e.clientX - translate.x,
        y: e.clientY - translate.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      const nx = e.clientX - panStart.current.x;
      const ny = e.clientY - panStart.current.y;
      setTranslate({ x: nx, y: ny });
    }
  };

  const handleMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      setIsGesturing(false);
      lastTranslate.current = translate;
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  const lightboxContent = (
    <div
      className="fixed inset-0 z-[9999] bg-[#0B1221]/80 backdrop-blur-2xl flex flex-col"
      aria-modal
      role="dialog"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-6 shrink-0 z-10">
        <div className="flex flex-col">
          <span className="text-white font-black text-2xl tracking-tighter leading-none mb-1">
            Product View.
          </span>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mt-1">
            Gallery Artifact {currentIndex + 1} of {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white text-white hover:text-[#0B1221] active:scale-95 transition-all duration-500 border border-white/10 hover:border-white shadow-2xl"
          aria-label="Close"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        className={`flex-1 relative overflow-hidden flex items-center justify-center select-none ${scale > 1 ? (isGesturing ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) onClose();
        }}
      >
        <div
          className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center"
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transformOrigin: "center center",
            transition: isGesturing
              ? "none"
              : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <div className="relative w-full h-[75vh] flex items-center justify-center p-4">
            <Image
              src={images[currentIndex]}
              alt={`Product view ${currentIndex + 1}`}
              fill
              className="object-contain rounded-[2rem]"
              priority
              draggable={false}
            />
          </div>
        </div>

        {/* Navigation Arrows (Desktop) */}
        <div className="hidden lg:block">
          {canGoPrev && (
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-[2rem] bg-white/5 hover:bg-white text-white hover:text-[#0B1221] border border-white/10 backdrop-blur-xl transition-all duration-500 shadow-2xl"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          {canGoNext && (
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-[2rem] bg-white/5 hover:bg-white text-white hover:text-[#0B1221] border border-white/10 backdrop-blur-xl transition-all duration-500 shadow-2xl"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>

        {/* Zoom Controls Overlay (Mobile & Desktop) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 bg-white/10 backdrop-blur-2xl rounded-[1.5rem] border border-white/10 shadow-2xl">
          <button
            onClick={() => handleManualZoom("out")}
            disabled={scale <= 1}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white text-white hover:text-[#0B1221] disabled:opacity-20 transition-all duration-300"
            aria-label="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          
          <button
            onClick={resetTransform}
            disabled={scale === 1 && translate.x === 0 && translate.y === 0}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white text-white hover:text-[#0B1221] disabled:opacity-20 transition-all duration-300"
            aria-label="Reset View"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={() => handleManualZoom("in")}
            disabled={scale >= 4}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white text-white hover:text-[#0B1221] disabled:opacity-20 transition-all duration-300"
            aria-label="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* Preview Gallery / Thumbnails */}
      <div className="shrink-0 w-full px-6 py-8 overflow-x-auto hide-scrollbar z-10 flex justify-center bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                resetTransform();
              }}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 shrink-0 ${
                idx === currentIndex
                  ? "border-white scale-110 shadow-2xl shadow-white/20"
                  : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/30"
              }`}
            >
              <Image
                src={img}
                alt={`Preview ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
