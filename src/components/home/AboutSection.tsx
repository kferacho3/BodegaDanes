// components/home/AboutSection.tsx

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-silver-light dark:bg-charcoal py-16 md:py-24 lg:py-32"
      aria-label="About Bodega Danes"
    >
      {/* Background texture layers */}
      <div className="absolute inset-0">
        {/* Wood texture for light mode, chalk for dark */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20"
          style={{
            backgroundImage: `url('/textures/wood-texture.png')`,
            backgroundSize: '600px 600px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'multiply'
          }}
        />
        <div 
          className="absolute inset-0 opacity-0 dark:opacity-10"
          style={{
            backgroundImage: `url('/textures/chalk-black.png')`,
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-silver-light/50 via-transparent to-silver-light/50 dark:from-charcoal/50 dark:to-charcoal/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          
          {/* Enhanced image section */}
          <div 
            className={`relative w-full lg:w-1/2 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Decorative frame */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/20 via-chalk-red/20 to-gold/20 dark:from-gold/10 dark:via-chalk-red/10 dark:to-gold/10 blur-2xl" />
            
            {/* Main image container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Chalk board effect frame */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none z-10"
                style={{
                  backgroundImage: `url('/textures/chalk-Menuboard2.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mixBlendMode: 'overlay'
                }}
              />
              
              {/* Image wrapper */}
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-charcoal-light">
                <Image
                  src="https://bodegadanes.s3.us-east-2.amazonaws.com/home/bio/BodegaDanesHeadshot.webp"
                  alt="Chef Dane - Founder of Bodega Dane's Catering, bringing NYC bodega flavors to your events"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="object-cover object-center"
                  priority
                  quality={90}
                />
                
                {/* Premium gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-charcoal/40" />
                
                {/* Chef title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div 
                    className={`transition-all duration-1000 delay-300 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <p className="text-gold font-display text-sm uppercase tracking-wider mb-1">Executive Chef</p>
                    <h3 className="text-silver-light font-header text-2xl lg:text-3xl">Chef Dane</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced content section */}
          <article className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
            {/* Section label */}
            <div 
              className={`flex items-center gap-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-chalk-red/50 to-transparent flex-1 max-w-[60px]" />
              <span className="text-chalk-red dark:text-gold font-display text-sm uppercase tracking-wider">Our Story</span>
              <div className="h-px bg-gradient-to-r from-transparent via-chalk-red/50 to-transparent flex-1 max-w-[60px]" />
            </div>

            {/* Main heading with chalk texture */}
            <h2 
              className={`relative transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span 
                className="text-4xl md:text-5xl lg:text-6xl font-header leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: `url('/textures/chalk-red.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitTextStroke: '1px rgba(194, 64, 50, 0.3)',
                }}
              >
                Bringing NYC Bodega
              </span>
              <br />
              <span 
                className="text-4xl md:text-5xl lg:text-6xl font-header leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: `url('/textures/chalk-gold.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(1.1)',
                }}
              >
                Flavor to You
              </span>
            </h2>

            {/* Enhanced body text */}
            <div className="space-y-4 text-charcoal/90 dark:text-silver-light/90 text-lg leading-relaxed">
              <p 
                className={`transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                From the sizzling <em className="text-chalk-red dark:text-gold font-semibold not-italic">Chopped Cheese</em> to 
                the iconic <em className="text-chalk-red dark:text-gold font-semibold not-italic">Bacon-Egg-N-Cheese</em>, 
                we recreate the neighborhood-corner magic of New York City bodegas—wherever you are.
              </p>

              <p 
                className={`transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                We stay true to original recipes while elevating each bite with top-notch ingredients. 
                Our <span className="text-chalk-red dark:text-gold font-semibold">custom griddle</span> is 
                the heartbeat of every service, ensuring a perfect sear, melt, and sizzle that transports 
                you straight to the five boroughs.
              </p>

              <p 
                className={`transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Whether it&apos;s a sunrise breakfast bar, a cold-sub drop-off, or a full-day live-cook 
                extravaganza, our menu is fully customizable to your vibe. Fine dining? Street-food 
                flair? We&apos;ve got you covered.
              </p>
            </div>

            {/* Call to action with decorative elements */}
            <div 
              className={`space-y-6 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {/* Decorative quote */}
              <div className="relative pl-6 border-l-4 border-chalk-red/50 dark:border-gold/50">
                <p className="text-xl lg:text-2xl font-header text-chalk-red dark:text-gold leading-relaxed">
                  &quot;Join us as we roll from city to city, sharing the flavors of New York—one 
                  unforgettable event at a time.&quot;
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-chalk-red hover:bg-chalk-red-dark text-silver-light font-header text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                  aria-label="View our menu"
                >
                  <span>View Our Menu</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-chalk-red dark:border-gold text-chalk-red dark:text-gold hover:bg-chalk-red hover:text-silver-light dark:hover:bg-gold dark:hover:text-charcoal font-header text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  aria-label="Contact us"
                >
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Decorative bottom element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chalk-red/20 dark:via-gold/20 to-transparent" />
    </section>
  );
}