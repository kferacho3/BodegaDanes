"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-center py-8 text-sm text-silver-dark">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logos/BodegaDanesMainLogo.png"
          alt="Bodega Danes Main Logo"
          width={150}
          height={150}
        />
        <div className="flex gap-6 text-2xl">
          <Link
            href="https://instagram.com"
            target="_blank"
            aria-label="Instagram"
            className="hover:text-silver-light transition-colors"
          >
            <FaInstagram />
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            aria-label="Facebook"
            className="hover:text-silver-light transition-colors"
          >
            <FaFacebookF />
          </Link>
          <Link
            href="https://tiktok.com"
            target="_blank"
            aria-label="TikTok"
            className="hover:text-silver-light transition-colors"
          >
            <FaTiktok />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            aria-label="YouTube"
            className="hover:text-silver-light transition-colors"
          >
            <FaYoutube />
          </Link>
        </div>
        <div className="text-xs">
          © {new Date().getFullYear()} Bodega Dane’s LLC · Atlanta, GA ·{" "}
          <Link
            href="mailto:contact@bodegadanes.com"
            className="underline ml-1 hover:text-silver-light"
          >
            contact@bodegadanes.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
