// components/Footer.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Hide the footer if the current pathname is "/menu"
  if (pathname === "/menu") return null;

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Menu", href: "/menu" },
    { label: "Book Now", href: "/book" },
    { label: "Contact", href: "/#contact" }
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal" />
        
        {/* Chalk texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url('/textures/chalk-black.png')`,
            backgroundSize: '600px 600px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-silver-dark/30 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            
            {/* Brand column */}
            <div 
              className={`flex flex-col items-center md:items-start space-y-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Logo with hover effect */}
              <Link href="/" className="group relative">
                <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src="/logos/BodegaDanesMainLogo.png"
                  alt="Bodega Danes - NYC Flavors, ATL Vibes"
                  width={180}
                  height={180}
                  className="relative transform group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Tagline */}
              <p className="text-silver-light/70 text-sm text-center md:text-left max-w-xs">
                Bringing the authentic NYC bodega experience to Atlanta and beyond.
              </p>
              
              {/* Social links */}
              <div className="flex gap-3">
                {[
                  { icon: FaInstagram, href: "https://instagram.com/bodegadanes", label: "Instagram" },
                  { icon: FaFacebookF, href: "https://facebook.com/bodegadanes", label: "Facebook" },
                  { icon: FaTiktok, href: "https://tiktok.com/@bodegadanes", label: "TikTok" },
                  { icon: FaYoutube, href: "https://youtube.com/@bodegadanes", label: "YouTube" }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group relative w-10 h-10 bg-silver-light/10 hover:bg-gold/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5 text-silver-light group-hover:text-gold transition-colors" />
                    <div className="absolute inset-0 rounded-full bg-gold/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div 
              className={`space-y-4 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="font-header text-lg text-gold">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-silver-light/70 hover:text-gold transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div 
              className={`space-y-4 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="font-header text-lg text-gold">Our Services</h3>
              <ul className="space-y-2">
                <li className="text-silver-light/70 text-sm">Breakfast at Bodega</li>
                <li className="text-silver-light/70 text-sm">BodegaDay Full Service</li>
                <li className="text-silver-light/70 text-sm">SubService Drop-off</li>
                <li className="text-silver-light/70 text-sm">Private Events</li>
                <li className="text-silver-light/70 text-sm">Corporate Catering</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div 
              className={`space-y-4 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="font-header text-lg text-gold">Get in Touch</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-silver-light/50 text-xs uppercase tracking-wider mb-1">Email</p>
                  <Link
                    href="mailto:contact@bodegadanes.com"
                    className="text-silver-light/70 hover:text-gold transition-colors duration-300 text-sm"
                  >
                    contact@bodegadanes.com
                  </Link>
                </div>
                <div>
                  <p className="text-silver-light/50 text-xs uppercase tracking-wider mb-1">Phone</p>
                  <Link
                    href="tel:+14045550123"
                    className="text-silver-light/70 hover:text-gold transition-colors duration-300 text-sm"
                  >
                    (404) 555-0123
                  </Link>
                </div>
                <div>
                  <p className="text-silver-light/50 text-xs uppercase tracking-wider mb-1">Location</p>
                  <p className="text-silver-light/70 text-sm">Atlanta, GA</p>
                  <p className="text-silver-light/50 text-xs">Service area: Metro ATL & Beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-silver-dark/20">
          {/* Decorative line gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-silver-light/50 text-xs text-center md:text-left">
                © {new Date().getFullYear()} Bodega Dane&apos;s LLC. All rights reserved.
              </div>
              
              {/* Legal links */}
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                {legalLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-silver-light/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                    {index < legalLinks.length - 1 && (
                      <span className="ml-4 text-silver-dark/30">|</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-chalk-red/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
    </footer>
  );
}