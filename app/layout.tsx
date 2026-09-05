import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import en from "@/locales/en.json";

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

/**
 * SEO title/description come from locales/en.json, overridable from the admin's
 * Site Text editor. Search engines see the English default, so only the English
 * override matters here. Cached for five minutes so an edit shows up quickly
 * without hitting the database on every request.
 */
export async function generateMetadata(): Promise<Metadata> {
  let title = en.seo.title;
  let description = en.seo.description;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/site_content?language=eq.en&content_key=in.(seo.title,seo.description)&select=content_key,value`,
        {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          next: { revalidate: 300 },
        }
      );

      if (res.ok) {
        const rows = (await res.json()) as { content_key: string; value: string }[];
        for (const row of rows) {
          if (row.content_key === "seo.title") title = row.value;
          if (row.content_key === "seo.description") description = row.value;
        }
      }
    } catch {
      // Metadata should never break the page — fall back to the defaults.
    }
  }

  return { title, description };
}

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
