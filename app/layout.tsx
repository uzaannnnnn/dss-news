import "./globals.css";
import type { Metadata } from "next";
import {
  Space_Grotesk,
  Fraunces,
  Inter,
  Poppins,
  Quicksand,
} from "next/font/google";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-child",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-teen",
  weight: ["400", "600", "700"],
});

const adult = Inter({
  subsets: ["latin"],
  variable: "--font-adult",
});

export const metadata: Metadata = {
  title: "News Portal",
  description: "Age-based entry portal",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${space.variable} ${fraunces.variable} ${inter.variable} ${quicksand.variable} ${poppins.variable} ${adult.variable}`}
    >
      <body className="min-h-dvh bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
