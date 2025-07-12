// components/home/HeroSection.tsx
"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid"; // ← NEW
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
const foodImages = Array.from({ length: 10 }, (_, i) =>
  `https://bodegadanes.s3.us-east-2.amazonaws.com/home/hero/BodegaDanesFoodSample${i + 1}.webp`
);

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ─────────── mount / auto-scroll ─────────── */
  useEffect(() => setIsLoaded(true), []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const id = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % foodImages.length;
        const isMobile = window.innerWidth < 640;

        if (isMobile) {
          // For mobile, scroll horizontally with full width items
          carousel.scrollTo({
            left: carousel.clientWidth * next,
            behavior: "smooth",
          });
        } else {
          carousel.scrollTo({
            left: (carousel.clientWidth / 3) * next,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(id);
  }, []);
  /* manual nav helpers */
  //const handleDotClick = (i: number) => setCurrentIndex(i);
  const navigate = (dir: "prev" | "next") =>
    setCurrentIndex((i) =>
      dir === "prev"
        ? (i - 1 + foodImages.length) % foodImages.length
        : (i + 1) % foodImages.length
    );

  // Manual navigation for mobile
  const handleDotClick = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const isMobile = window.innerWidth < 640;
    setCurrentIndex(index);
    
    if (isMobile) {
      carousel.scrollTo({
        left: carousel.clientWidth * index,
        behavior: "smooth",
      });
    } else {
      carousel.scrollTo({
        left: (carousel.clientWidth / 3) * index,
        behavior: "smooth",
      });
    }
  };

  /* ───────────────────── markup ───────────────────── */
  return (
    <section
      className="relative h-[82.5vh] max-h-[760px] overflow-hidden flex flex-col items-center justify-center"
      aria-label="Hero section showcasing NYC flavors and ATL vibes"
    >
      {/* background (unchanged) */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "url('/textures/WebpBlack.webp')",
            backgroundSize: "300px 300px",
            backgroundRepeat: "repeat",
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://bodegadanes.s3.us-east-2.amazonaws.com/misc/wallpaper/BodegaDanesHeroWallpaper.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/50 to-charcoal/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />
        <div className="absolute inset-0 backdrop-blur-md" />
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.5)]" />
      </div>

      {/* content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col items-center gap-4 sm:gap-5">
        {/* header (unchanged) */}
        <header className="text-center space-y-1 sm:space-y-2">
          {/* logo */}
          <div
            className={`flex items-center justify-center mb-2 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-chalk-red/30 blur-2xl rounded-full group-hover:bg-chalk-red/40 transition-colors duration-300" />
              <div className="relative bg-[url('/textures/chalk-red.png')] bg-cover bg-center rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logos/BodegaDanesHomeSymbol.png"
                  alt="Bodega Danes symbol"
                  width={64}
                  height={64}
                  priority
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>
            </div>
          </div>

          {/* headline */}
          <h1
            className={`font-header leading-tight transition-all duration-700 ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <span className="block text-2xl sm:text-4xl md:text-5xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "url('/textures/chalk-pink.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                NYC FLAVORS
              </span>
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-0">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "url('/textures/chalk-gold.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                ATL VIBES
              </span>
            </span>
          </h1>

          {/* tagline */}
          <div
            className={`max-w-md mx-auto transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-silver-light/80 text-xs sm:text-sm font-body uppercase tracking-wide">
              Bringing iconic New York bodega classics
            </p>
            <p className="text-gold text-sm sm:text-base font-display">
              <em>Chopped Cheese</em>{" "}
              <span className="text-silver-light/60">&amp;</span>{" "}
              <em>Bacon Egg N&apos; Cheese</em>
            </p>
            <p className="text-silver-light/70 text-xs font-body">
              cooked fresh on our signature griddle
            </p>
          </div>
        </header>

        {/* carousel */}
        <div
          className={`w-full max-w-6xl transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
            {/* frame */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none z-10"
              style={{
                backgroundImage: "url('/textures/chalk-Menuboard.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
 {/* wrapper with chalk-red background */}
            <div
              className="relative p-2.5 sm:p-3.5 md:p-4 "
              style={{
                backgroundImage: "url('/textures/chalk-red.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* ARROW BUTTONS — mobile only */}
              <button
                onClick={() => navigate("prev")}
                className="sm:hidden absolute z-20 left-2 top-1/2 -translate-y-1/2 bg-charcoal/70 backdrop-blur-sm p-2 rounded-full active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-5 h-5 text-silver-light" />
              </button>
              <button
                onClick={() => navigate("next")}
                className="sm:hidden absolute z-20 right-2 top-1/2 -translate-y-1/2 bg-charcoal/70 backdrop-blur-sm p-2 rounded-full active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-5 h-5 text-silver-light" />
              </button>

              {/* SCROLLER */}
              <div
                ref={carouselRef}
                className="flex gap-2.5 sm:gap-3.5 snap-mandatory snap-x overflow-x-auto overflow-y-hidden scrollbar-hide h-[32vh] sm:h-[32vh] md:h-[34vh]"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {foodImages.map((src, i) => (
                  <article
                    key={i}
                    className="relative flex-shrink-0 w-[85vw] sm:w-1/3 h-full snap-center rounded-md sm:rounded-lg overflow-hidden group"
                    aria-label={`Food image ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`Bodega Danes dish ${i + 1}`}
                      fill
                      sizes="(max-width:640px)85vw,(max-width:1024px)50vw,33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* dots */}
          <nav
            className="flex justify-center mt-2 sm:mt-3 gap-1"
            aria-label="Carousel navigation"
          >
            {foodImages.map((_, dot) => (
              <button
                key={dot}
                onClick={() => handleDotClick(dot)}
                aria-label={`Go to slide ${dot + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  dot === currentIndex
                    ? "w-4 sm:w-5 h-1.5 bg-gold shadow"
                    : "w-1.5 h-1.5 bg-silver-dark/40 hover:bg-silver-dark/60"
                }`}
              />
            ))}
          </nav>
        </div>

        {/* CTA (unchanged) */}
        <a
          href="#book"
          className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2 bg-chalk-red hover:bg-chalk-red-dark text-silver-light font-header text-sm sm:text-base rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
            isLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Book catering event"
        >
          <span>Book Your Event</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>

      {/* Add CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}