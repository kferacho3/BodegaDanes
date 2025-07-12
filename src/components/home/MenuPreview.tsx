// components/home/MenuPreview.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Service {
  name: string;
  img: string;
  description: string;
  cta: string;
  highlights: string[];
  price: string;
}

const services: Service[] = [
  {
    name: "Breakfast at Bodega",
    img: "https://bodegadanes.s3.us-east-2.amazonaws.com/home/menuPreview/BodegaDanesMenuBaBPreview.webp",
    description:
      "A sunrise spread of NYC-style classics: Bacon-Egg-N-Cheese, Hash Stacks, and more—all hot off the griddle to kick-start your day.",
    cta: "Book Breakfast",
    highlights: ["Live Griddle Station", "Fresh Coffee Bar", "NYC Classics"],
    price: "Starting at $15/person"
  },
  {
    name: "BodegaDay Full Service",
    img: "https://bodegadanes.s3.us-east-2.amazonaws.com/home/menuPreview/BodegaDanesMenuBDPreview.webp",
    description:
      "Pick any three menu items and we'll bring the full bodega experience to you—live cooking, sizzling aromas, and unforgettable vibes.",
    cta: "Book BodegaDay",
    highlights: ["Custom Menu", "Full Day Service", "Chef Experience"],
    price: "Starting at $25/person"
  },
  {
    name: "SubService",
    img: "https://bodegadanes.s3.us-east-2.amazonaws.com/home/menuPreview/BodegaDanesMenuSSPreview.webp",
    description:
      "Signature cold subs pre-built for drop-off or assembled on-site. Perfect for meetings, tailgates, and grab-and-go events.",
    cta: "Book SubService",
    highlights: ["Drop-off Available", "Custom Subs", "Event Ready"],
    price: "Starting at $12/person"
  },
];

export default function MenuPreview() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(entry.target as HTMLElement);
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [visibleCards]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
      aria-label="Our signature catering services"
    >
      {/* Layered background system */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal" />
        
        {/* Chalk texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url('/textures/chalk-black.png')`,
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-chalk-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced header */}
        <header className="text-center mb-16 lg:mb-20">
          {/* Section label */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-24" />
            <span className="text-gold font-display text-sm uppercase tracking-wider">Our Services</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-24" />
          </div>

          {/* Main heading with chalk texture */}
          <h2 className="mb-6">
            <span 
              className="text-4xl sm:text-5xl lg:text-6xl font-header leading-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `url('/textures/chalk-white.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(1.1)',
                textShadow: '0 0 40px rgba(255,255,255,0.2)'
              }}
            >
              Signature Services
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-silver-light/80 max-w-3xl mx-auto">
            From sunrise breakfasts to all-day experiences, we bring the authentic bodega vibe to your event
          </p>
        </header>

        {/* Enhanced card grid */}
        <div className="grid gap-8 md:gap-10 lg:grid-cols-3 mb-16">
          {services.map((service, index) => (
            <article
              key={service.name}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`group relative transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card container */}
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Chalk board texture background */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url('/textures/chalk-Menuboard2.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                {/* Image container */}
                <div className="relative h-64 lg:h-72 overflow-hidden">
                  <Image
                    src={service.img}
                    alt={`${service.name} - ${service.description}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index === 0}
                  />
                  
                  {/* Image overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-charcoal/40" />
                  
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-charcoal px-3 py-1 rounded-full font-display text-sm font-semibold shadow-lg">
                    {service.price}
                  </div>
                </div>

                {/* Content section */}
                <div className="relative bg-charcoal-light/90 backdrop-blur-sm p-6 lg:p-8">
                  {/* Service name with chalk effect */}
                  <h3 className="mb-3">
                    <span 
                      className="text-2xl lg:text-3xl font-header bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `url('/textures/chalk-red.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(1.2)',
                      }}
                    >
                      {service.name}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="text-silver-light/80 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.highlights.map((highlight, i) => (
                      <span 
                        key={i}
                        className="text-xs uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/book"
                    className="group/btn relative inline-flex items-center gap-2 w-full justify-center bg-chalk-red hover:bg-chalk-red-dark text-silver-light font-header text-lg py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">{service.cta}</span>
                    <svg 
                      className="relative z-10 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-chalk-red-dark to-chalk-red transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-gold/20 via-chalk-red/20 to-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
            </article>
          ))}
        </div>

        {/* Enhanced CTA section */}
        <div className="relative text-center">
          {/* Decorative line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-silver-dark/30 to-transparent" />
          
          {/* Buttons container */}
          <div className="relative bg-charcoal px-8 py-6 inline-flex flex-col sm:flex-row gap-4 rounded-full">
            <Link
              href="/book"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold/90 text-charcoal font-header text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Book a Service</span>
              <svg 
                className="relative z-10 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-silver-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-silver-light/50 text-silver-light hover:bg-silver-light hover:text-charcoal font-header text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>View Full Menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}