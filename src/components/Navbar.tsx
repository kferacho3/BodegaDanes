"use client";
import { useFilter } from "@/context/FilterContext"; // adjust the path as needed
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { filter, setFilter } = useFilter();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/#contact", label: "Contact" },
    { href: "/book", label: "Book Service" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-charcoal/80 backdrop-blur-md text-silver-light">
        <div className="font-custom mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/BodegaDanesMainLogo.png"
              alt="Bodega Danes Symbol"
              width={40}
              height={40}
              priority
            />
            <span className="font-bold tracking-wide gradient-text-pink">
              BODEGA DANES
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-chalk-red"
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden bg-charcoal border-t border-silver-dark">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-4 border-b border-silver-dark hover:bg-chalk-red/20"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-6 py-4">
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>

      {/* Fixed Filter Bar – Only shown when on the /menu route */}
      {pathname === "/menu" && (
        <div
          className="fixed left-0 w-full bg-black/80 backdrop-blur-md text-silver-light transition-transform duration-300 ease-in-out"
          style={{
            top: "64px", // adjust this value if needed based on your navbar height
            zIndex: 49, // slightly lower than the navbar’s z-index if needed
          }}
        >
          <div className="max-w-6xl mx-auto p-2 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              {["BodegaDay", "Breakfast at Bodega", "SubService"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                    filter === f
                      ? "font-custom bg-[url('/textures/chalk-gold.png')] bg-repeat hover:bg-[url('/textures/chalk-red.png')]"
                      : "bg-[url('/textures/chalk-red.png')] bg-repeat font-custom text-silver-light hover:bg-[url('/textures/chalk-white.png')]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
