import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FilterProvider } from "@/context/FilterContext"; // Import the FilterProvider
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bodega Dane’s – NYC Flavors in ATL",
  description:
    "Bringing iconic New York bodega classics like the Chopped Cheese to your doorstep.",
  openGraph: {
    type: "website",
    title: "Bodega Dane’s – NYC Flavors in ATL",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* Wrap the part of the app that uses filter state in FilterProvider */}
          <FilterProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
