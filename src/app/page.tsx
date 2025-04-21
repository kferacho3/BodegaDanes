// src/app/page.tsx

import ScrollingLogoBanner from "@/components/decoration/ScrollingBanner";
import SectionSeparator from "@/components/decoration/SectionSeparator";
import AboutSection from "@/components/home/AboutSection";
import BookServiceSection from "@/components/home/BookSeviceSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import MenuPreview from "@/components/home/MenuPreview";

export default function Home() {
  return (
    <>
      {/* You can change both props to switch textures and scroll direction */}
      <ScrollingLogoBanner backgroundTexture="chalk-gold" direction="left" />

      <HeroSection />

      {/* Another banner—and you could pick different props here too */}
      <ScrollingLogoBanner backgroundTexture="chalk-red" direction="right" />

      <AboutSection />
      <SectionSeparator />
      <MenuPreview />
      <SectionSeparator />
      <BookServiceSection />
      <SectionSeparator />
      <ContactSection />
      <SectionSeparator />
    </>
  );
}
