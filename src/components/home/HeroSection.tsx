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

  // auto‑advance every 4 s
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
    <section className="relative flex flex-col items-center gap-8 py-20">
      {/* symbol + copy */}
      <div className="z-10 flex flex-col items-center gap-6 text-center">
        <Image
          src="/logos/BodegaDanesHomeSymbol.png"
          alt="Bodega Danes Symbol"
          width={120}
          height={120}
          priority
        />
        <h1 className="font-header text-4xl sm:text-5xl lg:text-6xl leading-tight text-transparent bg-[url('/textures/chalk-red.png')] bg-repeat bg-clip-text">
          NYC FLAVORS, ATL VIBES
        </h1>
        <p className="max-w-xl px-4">
          Bringing iconic New York bodega classics like the <em>Chopped Cheese</em>{" "}
          and <em>Bacon Egg N`&apos;` Cheese</em> straight to your event - cooked on our
          signature griddle for that authentic sizzle.
        </p>
      </div>

      {/* image carousel */}
      <div
        ref={carouselRef}
        className="w-full max-w-6xl overflow-hidden rounded-lg shadow-lg flex snap-x snap-mandatory scroll-smooth"
      >
        {foodImages.map((src, i) => (
          <div key={i} className="relative flex-shrink-0 w-full snap-center">
            <Image
              src={src}
              alt={`Bodega Danes dish ${i + 1}`}
              width={1200}
              height={800}
              className="object-cover w-full h-[55vh] md:h-[65vh]"
              sizes="(max-width:768px) 100vw,
                     (max-width:1200px) 50vw,
                     33vw"
              priority={i < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
