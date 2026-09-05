import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
});
const notoGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  variable: "--font-noto-gurmukhi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Visionary Masters Global Pvt Ltd",
  description:
    "18 Years of Real-World Execution. Now Powered by AI. Email management, Power BI dashboards, MIS reporting, Excel solutions, presentations, websites, AI video generation, and workflow automation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoDevanagari.variable} ${notoGurmukhi.variable} font-sans flex min-h-screen flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
