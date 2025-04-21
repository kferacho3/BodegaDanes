// components/home/HeroSection.tsx

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const foodImages = Array.from(
  { length: 10 },
  (_, i) =>
    `https://bodegadanes.s3.us-east-2.amazonaws.com/home/hero/BodegaDanesFoodSample${
      i + 1
    }.webp`
);

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % foodImages.length;
        const isMobile = window.innerWidth < 640;

        if (isMobile) {
          const itemHeight = carousel.clientHeight / 3;
          carousel.scrollTo({
            top: itemHeight * next,
            behavior: "smooth",
          });
        } else {
          const itemWidth = carousel.clientWidth / 3;
          carousel.scrollTo({
            left: itemWidth * next,
            behavior: "smooth",
          });
        }

        return next;
      });
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative flex flex-col items-center gap-6 py-8"
      style={{
        background: `url("https://bodegadanes.s3.us-east-2.amazonaws.com/misc/wallpaper/BodegaDanesHeroWallpaper.webp")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* stronger blur overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-[6px]" />

      {/* Header & description */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-4">
        <h1 className="font-custom text-4xl sm:text-5xl lg:text-6xl leading-tight text-transparent bg-[url('/textures/chalk-pink.png')] bg-repeat bg-clip-text text-center">
          NYC FLAVORS, ATL VIBES
        </h1>
        <p className="max-w-xl text-white text-center uppercase font-bold leading-tight">
          Bringing iconic New York bodega classics like the{" "}
          <em>Chopped Cheese</em> and <em>Bacon Egg N&apos; Cheese</em> straight to
          your event — cooked on our signature griddle for that authentic sizzle.
        </p>
        <div className="-mt-1 -mb-4 bg-[url('/textures/chalk-red.png')] bg-cover bg-center rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
          <Image
            src="/logos/BodegaDanesHomeSymbol.png"
            alt="Bodega Danes Symbol"
            width={80}
            height={80}
            priority
          />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative z-10 w-[97vw] sm:w-[85vw] max-w-6xl mx-auto">
        {/* Changed h-[90vh] → h-[42vh] so only one image shows with peeks of prev/next on mobile */}
        <div className="bg-[url('/textures/chalk-red.png')] bg-cover bg-center rounded-2xl p-4 shadow-xl overflow-hidden h-[80vh] sm:h-auto">
          <div
            ref={carouselRef}
            className="
              flex 
              flex-col sm:flex-row 
              gap-4 
              snap-y sm:snap-x 
              snap-mandatory 
              overflow-hidden 
              scroll-smooth 
              h-full
            "
          >
            {foodImages.map((src, i) => (
              <div
                key={i}
                className="
                  relative 
                  -mb-10  
                  flex-shrink-0 
                  w-full sm:w-1/3 
                  snap-center 
                  overflow-hidden 
                  rounded-xl
                "
              >
                <Image
                  src={src}
                  alt={`Bodega Danes dish ${i + 1}`}
                  width={720}
                  height={480}
                  className="object-cover w-full h-[30vh] sm:h-[45vh]"
                  sizes="(max-width:768px) 90vw, 65vw"
                  priority={i < 2}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex -mb-4 justify-center mt-3 space-x-2">
          {foodImages.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`w-2 h-2 rounded-full transition ${
                dotIdx === currentIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
