import { menu } from "@/lib/menuData";
import clsx from "clsx";
import type { Metadata } from "next";
import Image from "next/image";

/* ---------- SEO metadata ---------- */
export const metadata: Metadata = {
  title: "Bodega Danes Menu | NYC‑Inspired Catering",
  description:
    "Explore every mouth‑watering item on the Bodega Danes chalkboard menu – from Chopped Cheese rolls to all‑day subs and custom bowls.",
};

/* ---------- helper: group by category ---------- */
type MenuItem = (typeof menu)[number];
const grouped = menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
  acc[item.category] ??= [];
  acc[item.category].push(item);
  return acc;
}, {});

/* ---------- chalkboard page ---------- */
export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[url('/textures/chalk-black.png')] bg-cover bg-fixed py-12 px-4 sm:px-6 lg:px-8">
      {/* wood‑frame wrapper */}
      <div className="mx-auto max-w-6xl rounded-3xl border-[24px] sm:border-[32px] border-[url('/textures/wood-texture.png')] bg-[url('/textures/chalk-Menuboard.png')] bg-cover bg-center shadow-2xl">
        {/* chalkboard inner padding */}
        <div className="space-y-16 py-14 px-6 sm:px-10 text-silver-light">
          {/* ————————— MAIN HEADER ————————— */}
          <h1
            className={clsx(
              "text-center text-4xl sm:text-5xl lg:text-6xl font-bodega",
              "bg-[url('/textures/chalk-red.png')] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            )}
          >
            BODEGA DANES MENU
          </h1>

          {/* ————————— CATEGORY SECTIONS ————————— */}
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="space-y-8">
              {/* section header */}
              <h2
                className={clsx(
                  "font-bodega text-2xl sm:text-3xl lg:text-4xl",
                  "bg-[url('/textures/chalk-gold.png')] bg-clip-text text-transparent"
                )}
              >
                {category}
              </h2>

              {/* grid of items */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(({ name, image }) => (
                  <article
                    key={name}
                    className="rounded-xl bg-black/40 ring-1 ring-white/10 backdrop-blur-md"
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        width={400}
                        height={260}
                        className="h-40 w-full object-cover rounded-t-xl"
                        sizes="(max-width:768px) 100vw,
                               (max-width:1280px) 50vw,
                               33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-40 w-full flex items-center justify-center text-4xl">
                        📸
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-bodegasub text-lg tracking-wide">
                        {name}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
