"use client";

import Image from "next/image";
import Link from "next/link";

interface Service {
  name: string;
  img: string;
  description: string;
  cta: string;
}

const services: Service[] = [
  {
    name: "Breakfast at Bodega",
    img: "https://bodegadanes.s3.us-east-2.amazonaws.com/home/menuPreview/BodegaDanesMenuBaBPreview.webp",
    description:
      "A sunrise spread of NYC‑style classics: Bacon‑Egg‑N‑Cheese, Hash Stacks, and more—all hot off the griddle to kick‑start your day.",
    cta: "Book Breakfast",
  },
  {
    name: "BodegaDay Full Service",
    img: "https://bodegadanes.s3.us-east-2.amazonaws.com/home/menuPreview/BodegaDanesMenuBDPreview.webp",
    description:
      "Pick any three menu items and we’ll bring the full bodega experience to you—live cooking, sizzling aromas, and unforgettable vibes.",
    cta: "Book BodegaDay",
  },
  {
    name: "SubService",
    img: "https://bodegadanes.s3.us-east-2.amazonaws.com/home/menuPreview/BodegaDanesMenuSSPreview.webp",
    description:
      "Signature cold subs pre‑built for drop‑off or assembled on‑site. Perfect for meetings, tailgates, and grab‑and‑go events.",
    cta: "Book SubService",
  },
];

export default function ServicesPreview() {
  return (
    <section
      id="services"
      className="py-16 bg-gradient-to-b from-charcoal to-charcoal/90 text-silver-light"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
          Our Signature Services
        </h2>

        {/* card grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ name, img, description, cta }) => (
            <article
              key={name}
              className="group relative overflow-hidden rounded-xl shadow-lg bg-charcoal border border-silver-dark/30"
            >
              {/* image now width=100%, height auto */}
              <div className="w-full overflow-hidden">
                <Image
                  src={img}
                  alt={`${name} preview`}
                  width={1920}
                  height={1080}
                  sizes="(max-width:768px) 100vw,
                         (max-width:1280px) 50vw,
                         33vw"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              </div>

              <div className="py-2 px-6 flex flex-col gap-2">
                <h3 className="text-xl font-custom text-chalk-red">{name}</h3>
                <p className="text-sm leading-relaxed">{description}</p>

                <Link
                  href="#book"
                  className="mt-auto self-start rounded-full bg-chalk-red px-5 py-2 text-sm font-semibold text-silver-light hover:bg-chalk-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk-red/70"
                >
                  {cta}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="#book"
            className="rounded-full bg-chalk-red px-8 py-3 text-center font-semibold text-silver-light hover:bg-chalk-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk-red/70"
          >
            Book a Service
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-silver-light/40 px-8 py-3 text-center font-semibold hover:bg-silver-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-light/50"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
