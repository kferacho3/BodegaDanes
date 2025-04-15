"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-silver-light dark:bg-charcoal py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-4 md:flex-row">
        {/* ——————————————————— Copy ——————————————————— */}
        <article className="w-full md:w-1/2 space-y-6 text-charcoal dark:text-silver-light">
          <h2 className="text-3xl md:text-4xl font-extrabold text-chalk-red">
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
            you straight to the five boroughs.
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

        {/* ——————————————————— Headshot ——————————————————— */}
        <div className="relative h-90 w-full overflow-hidden rounded-3xl shadow-xl md:h-[28rem] md:w-1/2">
          <Image
            src="https://bodegadanes.s3.us-east-2.amazonaws.com/home/bio/BodegaDanesHeadshot.webp"
            alt="Chef Dane—Founder of Bodega Dane’s Catering"
            fill
            sizes="(max-width:768px) 100vw,
                   (max-width:1280px) 50vw,
                   40vw"
            className="object-cover"
            priority
          />
          {/* decorative gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}
