import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function AdultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`adult-scope ${inter.variable}`}
      data-adult-scope
      data-font-size="default"
    >
      {children}
    </div>
  );
}
