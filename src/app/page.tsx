// src/app/page.tsx (or wherever your Home component is located)

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
      <HeroSection />
   
      <ScrollingLogoBanner/>
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
