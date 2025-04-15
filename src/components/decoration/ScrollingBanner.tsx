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

// Absolute URLs for the 20 main logo assets sitting in your S3 bucket
// (If you ever add / remove logos, just edit this list.)
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

// Scale factor to convert scroll velocity to horizontal travel (tweak for feel)
const SPEED_FACTOR = 0.25;

export default function ScrollingLogoBanner() {
  /**
   * Scroll-driven motion:
   * 1. Get current scroll position using useScroll.
   * 2. Convert that to instantaneous velocity using useVelocity.
   * 3. Smooth the velocity using useSpring.
   * 4. Accumulate the motion into an x value.
   */
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 40, damping: 20 });
  const x = useMotionValue(0);

  useEffect(() => {
    const unsub = smoothVelocity.on("change", (v) => {
      // Convert px/s to px per frame and apply factor; negate so scroll down moves logos left.
      const delta = (v / 60) * SPEED_FACTOR;
      x.set(x.get() - delta);
    });
    return () => unsub();
  }, [smoothVelocity, x]);

  // Duplicate logos to create a seamless scrolling effect.
  const repeated = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden bg-[url('/textures/chalk-red.png')] bg-repeat bg-center py-4 select-none">
      <motion.div className="flex gap-2" style={{ x }}>
        {repeated.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt="Bodega Danes logo"
            width={100}
            height={100}
            className="pointer-events-none shrink-0"
            unoptimized
          />
        ))}
      </motion.div>
    </div>
  );
}
