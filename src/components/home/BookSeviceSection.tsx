"use client";

import Image from "next/image";
import Link from "next/link";

export default function BookServiceSection() {
  return (
    <section
      id="book"
      className="relative py-24 px-6 bg-gradient-to-br from-chalk-red-dark to-charcoal text-silver-light"
    >
      {/* Wallpaper overlay container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://bodegadanes.s3.us-east-2.amazonaws.com/misc/wallpaper/BodegaDanesBookWallpaper.webp"
          alt="Book Service Wallpaper"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Container with chalk-Menuboard texture */}
      <div
        className="relative z-10 mx-auto max-w-3xl text-center space-y-10 p-8 rounded-3xl"
        style={{
          background: `url("/textures/chalk-Menuboard.png")`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Gold Chalk Icon */}
        <div className="flex justify-center">
          <div className="w-48 h-40 rounded-full bg-[url('/textures/chalk-red.png')] bg-cover bg-center p-4 shadow-lg">
            <div className="w-full h-full relative">
              <Image
                src="https://bodegadanes.s3.us-east-2.amazonaws.com/home/book/BodegaDanesBookNowPreview.webp"
                alt="Book Now Preview"
                layout="fill"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold font-header tracking-tight drop-shadow-md">
            Ready to Book?
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            Private events, pop‑ups, corporate lunches—pick a date, lock in your spot, and let us handle the rest.
          </p>
        </div>

        {/* Call to Action Button */}
        <Link
          href="/book"
          className="inline-block bg-silver-light text-charcoal font-bold text-lg px-10 py-3 rounded-full hover:scale-105 hover:bg-white/80 transition-transform duration-200 shadow-md"
        >
          Book&nbsp;Now
        </Link>
      </div>
    </section>
  );
}
