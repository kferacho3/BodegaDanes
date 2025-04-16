"use client";

import { useFilter } from "@/context/FilterContext"; // adjust the path as needed
import { menu } from "@/lib/menuData";
import Head from "next/head";
import Image from "next/image";

// Mapping for header images based on filter.
const headerImages: Record<string, string> = {
  "BodegaDay":
    "https://bodegadanes.s3.us-east-2.amazonaws.com/menu/BodegaDanesMenuHeaderBD.webp",
  "Breakfast at Bodega":
    "https://bodegadanes.s3.us-east-2.amazonaws.com/menu/BodegaDanesMenuHeaderBaB.webp",
  "SubService":
    "https://bodegadanes.s3.us-east-2.amazonaws.com/menu/BodegaDanesMenuHeaderSS.webp",
};

// Mapping for top icons based on filter.
const topIcons: Record<string, string> = {
  "BodegaDay":
    "https://bodegadanes.s3.us-east-2.amazonaws.com/menu/BodegaDanesBDIcon.webp",
  "Breakfast at Bodega":
    "https://bodegadanes.s3.us-east-2.amazonaws.com/menu/BodegaDanesBaBIcon.webp",
  "SubService":
    "https://bodegadanes.s3.us-east-2.amazonaws.com/menu/BodegaDanesSSIcon.webp",
};

// Helper: group menu items by category from filtered data.
function groupByCategory(items: typeof menu): Record<string, string[]> {
  return items.reduce<Record<string, string[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item.name);
    return acc;
  }, {});
}

export default function MenuPage() {
  const { filter } = useFilter();

  // Filter the menu items based on the fixed filters.
  // For "BodegaDay", show the full menu.
  // For "Breakfast at Bodega", show only "A.M. Eats".
  // For "SubService", show only "Subs".
  const filteredMenu =
    filter === "BodegaDay"
      ? menu
      : filter === "Breakfast at Bodega"
      ? menu.filter((item) => item.category === "A.M. Eats")
      : menu.filter((item) => item.category === "Subs");

  // Group the filtered items by their category.
  const grouped = groupByCategory(filteredMenu);
  const entries = Object.entries(grouped);

  // For a two‑column layout, assign each meal type (category) to one column.
  let leftColumn: [string, string[]][] = [];
  let rightColumn: [string, string[]][] = [];
  if (entries.length > 1) {
    const mid = Math.ceil(entries.length / 2);
    leftColumn = entries.slice(0, mid);
    rightColumn = entries.slice(mid);
  } else {
    leftColumn = entries;
  }

  return (
    <>
      <Head>
        <title>Bodega Danes Menu</title>
        <meta
          name="description"
          content="Explore the full Bodega Danes menu—from Chopped Cheese rolls to signature subs, bowls, salads, smashers, sweets, and more."
        />
      </Head>

      {/* Main container with the wallpaper background */}
      <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4 md:px-6 lg:px-8 relative">
        {/* Blurred background wallpaper */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `url("https://bodegadanes.s3.us-east-2.amazonaws.com/misc/wallpaper/BodegaDanesMenuWallpaper.webp")`,
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
            filter: "blur(4px)",
          }}
        />

        {/* Outer container with wood-texture border (repeating) */}
        <div
          className="relative z-10 w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl"
          style={{
            borderWidth: "24px",
            borderStyle: "solid",
            borderImage: "url('/textures/wood-texture.png') 32",
            background: `linear-gradient(135deg, #1B1B18, #2A2A26)`,
          }}
        >
          {/* Content container (transparent background to let the wallpaper show through) */}
          <div className="p-4 sm:p-6 md:p-8 space-y-4 text-silver-light">
            {/* Header Section */}
            <div className="text-center space-y-2">
              {/* Header Section Image – shows the header image for the selected filter */}
              <header className="mx-auto">
                <Image
                  src={headerImages[filter]}
                  alt={`${filter} Menu Header`}
                  width={400}
                  height={200}
                  className="mx-auto object-contain"
                  priority
                />
              </header>

              {/* Top Icon Section: Display the appropriate top icon based on selected filter */}
              <header className="mx-auto">
                <Image
                  src={topIcons[filter]}
                  alt={`${filter} Icon`}
                  width={120}
                  height={120}
                  className="mx-auto object-contain"
                  priority
                />
              </header>
            </div>

            {/* Two-Column Layout for Menu Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {leftColumn.map(([category, items], idx) => (
                  // Center each category container using mx-auto and text-center
                  <div key={category} className="space-y-4 mx-auto text-center">
                    <h2 className="font-header text-2xl sm:text-3xl lg:text-4xl text-transparent bg-[url('/textures/chalk-gold.png')] bg-repeat bg-clip-text">
                      {category}
                    </h2>
                    <ul className="space-y-2">
                      {items.map((name) => (
                        <li
                          key={name}
                          className="font-body font-bold uppercase text-base sm:text-lg lg:text-xl tracking-wide text-transparent bg-[url('/textures/chalk-white.png')] bg-repeat bg-clip-text"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                    {idx < leftColumn.length - 1 && (
                      <Image
                        src="https://bodegadanes.s3.us-east-2.amazonaws.com/misc/graphics/BDCurvedSeparatorGrapghic.webp"
                        alt="Decorative Separator"
                        width={400}
                        height={20}
                        className="mx-auto my-0"
                        style={{
                          transform:
                            idx % 2 === 1
                              ? "scaleY(-0.2) scaleX(-1)"
                              : "scaleY(-0.2)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {rightColumn.map(([category, items], idx) => (
                  // Center each category container on the right using mx-auto and text-center
                  <div key={category} className="space-y-4 mx-auto text-center">
                    <h2 className="font-header text-2xl sm:text-3xl lg:text-4xl text-transparent bg-[url('/textures/chalk-gold.png')] bg-repeat bg-clip-text">
                      {category}
                    </h2>
                    <ul className="space-y-2">
                      {items.map((name) => (
                        <li
                          key={name}
                          className="font-body font-bold uppercase text-base sm:text-lg lg:text-xl tracking-wide text-transparent bg-[url('/textures/chalk-white.png')] bg-repeat bg-clip-text"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                    {idx < rightColumn.length - 1 && (
                      <Image
                        src="https://bodegadanes.s3.us-east-2.amazonaws.com/misc/graphics/BDCurvedSeparatorGrapghic.webp"
                        alt="Decorative Separator"
                        width={400}
                        height={10}
                        className="mx-auto"
                        style={{
                          transform:
                            idx % 2 === 1
                              ? "scaleY(-0.2) scaleX(-1)"
                              : "scaleY(-0.2)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Icon – Home Symbol, moved to the bottom and centered */}
            <div className="mt-6 flex justify-center">
              <Image
                src="/logos/BodegaDanesHomeSymbol.png"
                alt="Bodega Danes Home Symbol"
                width={90}
                height={90}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
