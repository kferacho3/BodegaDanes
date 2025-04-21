"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-silver-light dark:bg-charcoal py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row-reverse items-center gap-12 px-4">
        {/* — Headshot first on mobile — */}
        <div className="relative w-full h-80 md:h-[28rem] md:w-1/2 rounded-3xl shadow-xl">
          <Image
            src="https://bodegadanes.s3.us-east-2.amazonaws.com/home/bio/BodegaDanesHeadshot.webp"
            alt="Chef Dane—Founder of Bodega Dane’s Catering"
            fill
            sizes="(max-width:768px) 100vw,
                   (max-width:1280px) 50vw,
                   40vw"
            className="object-contain object-top"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* — Copy below on mobile — */}
        <article className="w-full md:w-1/2 space-y-6 text-charcoal dark:text-silver-light">
          <h2 className="text-3xl font-custom md:text-4xl font-extrabold text-chalk-red">
            Bringing NYC&nbsp;Bodega Flavor to&nbsp;You
          </h2>
          <p>
            From the sizzling <em>Chopped&nbsp;Cheese</em> to the iconic{" "}
            <em>Bacon‑Egg‑N‑Cheese&nbsp;🥓🍳🧀</em>, we recreate the
            neighborhood‑corner magic of New York City bodegas—wherever you are.
          </p>
          <p>
            We stay true to original recipes while elevating each bite with
            top‑notch ingredients. Our custom griddle is the heartbeat of every
            service, ensuring a perfect sear, melt, and sizzle that transports
            you straight to the five boroughs.
          </p>
          <p>
            Whether it’s a sunrise breakfast bar, a cold‑sub drop‑off, or a
            full‑day live‑cook extravaganza, our menu is fully customizable to
            your vibe. Fine dining? Street‑food flair? We’ve got you covered.
          </p>
          <p className="font-semibold">
            Join us as we roll from city to city, sharing the flavors of New York—one
            unforgettable event at a time. 🥳
          </p>
        </article>
      </div>
    </section>
  );
}
