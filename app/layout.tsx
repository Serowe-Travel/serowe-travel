import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Luxury & Sustainable Travel in Botswana`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Serowe Travel",
    "Botswana travel agency",
    "luxury safari Botswana",
    "Serowe tours",
    "Okavango Delta",
    "IATA travel agent Botswana",
  ],
  openGraph: {
    title: `${site.name} — Luxury & Sustainable Travel`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_BW",
    type: "website",
  },
  icons: { icon: "/images/brand/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
