// components/home/HeroSection.tsx

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const foodImages = Array.from(
  { length: 10 },
  (_, i) =>
    `https://bodegadanes.s3.us-east-2.amazonaws.com/home/hero/BodegaDanesFoodSample${
      i + 1
    }.webp`
);

export default function HeroSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // auto‑advance every 4 s
  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      if (!carouselRef.current) return;
      idx = (idx + 1) % foodImages.length;
      carouselRef.current.scrollTo({
        left: carouselRef.current.clientWidth * idx,
        behavior: "smooth",
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative flex flex-col items-center gap-4 py-8"
      style={{
        background: `url("https://bodegadanes.s3.us-east-2.amazonaws.com/misc/wallpaper/BodegaDanesHeroWallpaper.webp")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* 25% stronger blur */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-[6px]" />

      <div className="relative z-10 flex flex-col items-center gap-2 p-2">
        <h1 className="font-custom text-4xl sm:text-5xl lg:text-6xl leading-tight text-transparent bg-[url('/textures/chalk-pink.png')] bg-repeat bg-clip-text text-center">
          NYC FLAVORS, ATL VIBES
        </h1>
        <p className="max-w-xl px-4 text-white text-center">
          Bringing iconic New York bodega classics like the{" "}
          <em>Chopped Cheese</em> and <em>Bacon Egg N&apos; Cheese</em> straight to
          your event — cooked on our signature griddle for that authentic sizzle.
        </p>
        <div className="bg-[url('/textures/chalk-red.png')] bg-cover bg-center rounded-full p-0">
          <Image
            src="/logos/BodegaDanesHomeSymbol.png"
            alt="Bodega Danes Symbol"
            width={75}
            height={75}
            priority
          />
        </div>
      </div>

      <div
        ref={carouselRef}
        className="relative z-10 w-full max-w-6xl overflow-hidden rounded-lg shadow-lg flex snap-x snap-mandatory scroll-smooth"
      >
{foodImages.map((src, i) => (
  <div
    key={i}
    className="relative flex-shrink-0 w-full h-[50vh] snap-center"
  >
    <Image
      src={src}
      alt={`Bodega Danes dish ${i + 1}`}
      width={720}
      height={512}
      className="object-cover w-full h-full"
      sizes="(max-width:768px) 100vw,
             (max-width:1200px) 50vw,
             33vw"
      priority={i < 2}
    />
  </div>
))}

      </div>
    </section>
  );
}
