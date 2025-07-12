// components/home/BookServiceSection.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BookServiceSection() {
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
      id="book"
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden py-16 md:py-20 lg:py-24"
      aria-label="Book your catering service"
    >
      {/* Multi-layered background system */}
      <div className="absolute inset-0">
        {/* Base wallpaper */}
        <div className="absolute inset-0">
          <Image
            src="https://bodegadanes.s3.us-east-2.amazonaws.com/misc/wallpaper/BodegaDanesBookWallpaper.webp"
            alt=""
            fill
            className="object-cover"
            priority
            quality={85}
          />
        </div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-chalk-red-dark/90 via-charcoal/80 to-charcoal/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/40" />
        
        {/* Chalk texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: `url('/textures/chalk-black.png')`,
            backgroundSize: '300px 300px',
            backgroundRepeat: 'repeat',
          }}
        />
        
        {/* Animated particles effect */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float-slow`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + i * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Premium card design */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Chalk menuboard texture background */}
            <div 
              className="absolute inset-0 opacity-90"
              style={{
                backgroundImage: `url('/textures/chalk-Menuboard.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'contrast(1.1) brightness(0.9)',
              }}
            />
            
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-chalk-red/10" />
            
            {/* Content wrapper */}
            <div className="relative bg-charcoal/30 backdrop-blur-sm p-8 sm:p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left side - Image showcase */}
                <div 
                  className={`relative transition-all duration-1000 delay-200 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                >
                  {/* Decorative frame */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-gold/30 via-chalk-red/20 to-gold/30 rounded-3xl blur-2xl" />
                  
                  {/* Image container with chalk frame effect */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <div 
                      className="absolute inset-0 z-10 pointer-events-none"
                      style={{
                        backgroundImage: `url('/textures/chalk-red.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.3,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    
                    <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] bg-charcoal-light">
                      <Image
                        src="https://bodegadanes.s3.us-east-2.amazonaws.com/home/book/BodegaDanesBookNowPreview.webp"
                        alt="Bodega Danes catering service in action"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                        priority
                      />
                      
                      {/* Premium overlay gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-chalk-red/20" />
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-charcoal px-3 py-1 rounded-full font-display text-sm font-semibold shadow-lg">
                      Now Booking 2024
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                  {/* Section label */}
                  <div 
                    className={`flex items-center gap-3 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="h-px bg-gradient-to-r from-gold/50 to-transparent w-12" />
                    <span className="text-gold font-display text-sm uppercase tracking-wider">Book Your Event</span>
                  </div>

                  {/* Main heading */}
                  <h2 
                    className={`transition-all duration-700 delay-400 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <span 
                      className="text-5xl sm:text-6xl lg:text-7xl font-header leading-none bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `url('/textures/chalk-white.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(1.2)',
                        textShadow: '0 0 30px rgba(255,255,255,0.3)',
                      }}
                    >
                      Ready to
                    </span>
                    <br />
                    <span 
                      className="text-5xl sm:text-6xl lg:text-7xl font-header leading-none bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `url('/textures/chalk-gold.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(1.3)',
                      }}
                    >
                      Book?
                    </span>
                  </h2>

                  {/* Description */}
                  <p 
                    className={`text-lg sm:text-xl text-silver-light/90 leading-relaxed max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    Private events, pop-ups, corporate lunches—pick a date, lock in your spot, 
                    and let us handle the rest. Your guests will thank you.
                  </p>

                  {/* Service highlights */}
                  <div 
                    className={`grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-600 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {[
                      { icon: "🎉", text: "Private Events" },
                      { icon: "🏢", text: "Corporate Catering" },
                      { icon: "🍔", text: "Pop-Up Service" },
                      { icon: "🎂", text: "Special Occasions" },
                    ].map((item, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 text-silver-light/80 font-body"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div 
                    className={`flex flex-wrap gap-4 justify-center lg:justify-start pt-4 transition-all duration-700 delay-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Link
                      href="/book"
                      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold/90 text-charcoal font-header text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10">Book Now</span>
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
                      href="#contact"
                      className="inline-flex items-center gap-2 px-8 py-4 border-2 border-silver-light/50 text-silver-light hover:bg-silver-light hover:text-charcoal font-header text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <span>Get a Quote</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-chalk-red/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}