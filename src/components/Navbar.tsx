// components/Navbar.tsx
"use client";

import { useFilter } from "@/context/FilterContext";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion"; // ← NEW
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { filter, setFilter } = useFilter();

  /* ───────── add shadow after scroll ───────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ───────── close menu on route change ───────── */
  useEffect(() => setOpen(false), [pathname]);
/* ───────── prevent body scroll when menu open ───────── */
useEffect(() => {
  // Lock or unlock scrolling whenever `open` changes
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  // Always unlock when the component unmounts
  return () => {
    document.body.style.overflow = "unset";
  };
}, [open]);


  const navItems = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/#contact", label: "Contact" },
    { href: "/book", label: "Book Service" },
    { href: "/my-events", label: "My Events", icon: UserCircleIcon },
  ];

  /* ───────── framer-motion variants ───────── */
  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const panelVariants = {
    closed: { y: "-100%" },
    open: { y: 0, rotate: 0 },
  };

  return (
    <>
      {/* ───────────────── TOP BAR ───────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-charcoal/95 backdrop-blur-lg shadow-2xl"
            : "bg-charcoal/80 backdrop-blur-md"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src="/logos/BodegaDanesMainLogo.png"
                  alt="Bodega Danes"
                  width={45}
                  height={45}
                  className="relative transform group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <span
                className="font-header text-xl tracking-wide bg-clip-text text-transparent hidden sm:block"
                style={{
                  backgroundImage: "url('/textures/chalk-pink.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(1.2)",
                }}
              >
                BODEGA DANES
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-custom text-silver-light hover:text-gold transition-all duration-300 relative group ${
                    pathname === item.href ? "text-gold" : ""
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <ThemeToggle />
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="md:hidden relative p-2 rounded-lg hover:bg-silver-light/10 transition-colors"
            >
              {open ? (
                <XMarkIcon className="h-6 w-6 text-silver-light" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-silver-light" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────── MOBILE OVERLAY ───────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Slide/Roll panel */}
            <motion.div
              key="panel"
              initial="closed"
              animate="open"
              exit="closed"
              variants={panelVariants}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 18,
              }}
              className="fixed left-0 right-0 top-0 h-[60vh] bg-charcoal shadow-2xl z-[70] md:hidden transform-gpu origin-top"
            >
              {/* Chalk texture */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "url('/textures/chalk-black.png')",
                  backgroundSize: "500px 500px",
                  backgroundRepeat: "repeat",
                  mixBlendMode: "overlay",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal/95" />

              {/* Panel content (unchanged) */}
              <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-silver-dark/20">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logos/BodegaDanesMainLogo.png"
                      alt="Bodega Danes"
                      width={40}
                      height={40}
                    />
                    <span
                      className="font-header text-lg bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "url('/textures/chalk-pink.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      BODEGA DANES
                    </span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg hover:bg-silver-light/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6 text-silver-light" />
                  </button>
                </div>

                {/* Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block font-custom"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.15 + index * 0.05,
                            duration: 0.3,
                          }}
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-silver-light/10 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                            {item.icon ? (
                              <item.icon className="w-5 h-5 text-gold" />
                            ) : (
                              <span className="text-gold text-lg">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <span className="text-silver-light text-xl group-hover:text-gold transition-colors">
                            {item.label}
                          </span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  {/* Theme Toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + navItems.length * 0.05,
                      duration: 0.3,
                    }}
                    className="mt-8 pt-8 border-t border-silver-dark/20"
                  >
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-silver-light/5">
                      <span className="font-custom text-silver-light text-lg">
                        Dark Mode
                      </span>
                      <ThemeToggle />
                    </div>
                  </motion.div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-silver-dark/20 text-center">
                  <p className="text-gold text-sm font-custom">
                    NYC Flavors, ATL Vibes
                  </p>
                  <p className="text-silver-light/50 text-xs mt-1">
                    © {new Date().getFullYear()} Bodega Dane&apos;s
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ───────── Fixed filter bar (unchanged) ───────── */}
      {pathname === "/menu" && (
        <div className="fixed left-0 w-full bg-charcoal/90 backdrop-blur-lg shadow-lg transition-all duration-300 top-16 md:top-20 z-40">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-silver-dark/30 to-transparent" />
          <div className="max-w-6xl mx-auto p-3 md:p-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {["BodegaDay", "Breakfast at Bodega", "SubService"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative font-custom px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                    filter === f
                      ? "text-charcoal shadow-lg"
                      : "text-silver-light hover:text-silver-light/90 shadow-md"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                      filter === f
                        ? "opacity-100"
                        : "opacity-90 hover:opacity-100"
                    }`}
                    style={{
                      backgroundImage: `url('/textures/${
                        filter === f ? "chalk-gold" : "chalk-red"
                      }.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <span className="relative z-10">{f}</span>
                  {filter === f && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gold rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
