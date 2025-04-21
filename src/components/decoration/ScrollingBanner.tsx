// components/decoration/ScrollingBanner.tsx

"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const logos: string[] = [
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo2.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo3.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo4.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo5.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo6.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo7.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo8.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo9.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo10.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo11.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo12.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo13.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo14.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo15.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo16.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo17.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo18.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo19.webp",
  "https://bodegadanes.s3.us-east-2.amazonaws.com/misc/logos/BodegaDanesMainLogo20.webp",
];

const SPEED_FACTOR = 0.25;
const LOGO_SIZE = 50;    // px
const GAP_SIZE = 8;      // px (Tailwind gap-2)

type ScrollingLogoBannerProps = {
  backgroundTexture?:
    | "chalk-black"
    | "chalk-gold"
    | "chalk-Menuboard"
    | "chalk-Menuboard2"
    | "chalk-pink"
    | "chalk-red"
    | "chalk-white";
  direction?: "left" | "right";
};

export default function ScrollingLogoBanner({
  backgroundTexture = "chalk-red",
  direction = "left",
}: ScrollingLogoBannerProps) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 40, damping: 20 });
  const x = useMotionValue(0);

  // On mount, if we're scrolling right, start shifted left by one segment
  useEffect(() => {
    if (direction === "right") {
      const segmentWidth =
        logos.length * LOGO_SIZE + (logos.length - 1) * GAP_SIZE;
      x.set(-segmentWidth);
    }
  }, [direction, x]);

  // Update x based on scroll velocity and direction
  useEffect(() => {
    const unsub = smoothVelocity.on("change", (v) => {
      const delta = (v / 60) * SPEED_FACTOR;
      x.set(x.get() + (direction === "left" ? -delta : delta));
    });
    return () => unsub();
  }, [smoothVelocity, x, direction]);

  // Triple-repeat ensures there's always content to scroll into view
  const repeated = [...logos, ...logos, ...logos];

  return (
    <div
      className={`relative w-full overflow-hidden bg-[url('/textures/${backgroundTexture}.png')] bg-repeat bg-center py-0 select-none`}
    >
      <motion.div className="flex gap-2" style={{ x }}>
        {repeated.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt="Bodega Danes logo"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className="pointer-events-none shrink-0"
            unoptimized
          />
        ))}
      </motion.div>
    </div>
  );
}
