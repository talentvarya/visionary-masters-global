import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import en from "@/locales/en.json";

const SITE_URL = "https://visionary-masters-global-tsgl.vercel.app";

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

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: "/" },
    other: { "llms-txt": `${SITE_URL}/llms.txt` },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Visionary Masters Global",
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Visionary Masters Global AI automation services" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfessionalService", "@id": `${SITE_URL}/#organization`, name: "Visionary Masters Global Pvt Ltd", url: SITE_URL, founder: { "@id": `${SITE_URL}/#founder` }, areaServed: "Worldwide", email: "vineet.grover.1990@gmail.com", sameAs: ["https://www.linkedin.com/in/vineetgrover9581/"], description: en.seo.description },
      { "@type": "Person", "@id": `${SITE_URL}/#founder`, name: "Vineet Grover", jobTitle: "Founder & Director", worksFor: { "@id": `${SITE_URL}/#organization` }, sameAs: ["https://www.linkedin.com/in/vineetgrover9581/"] },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Visionary Masters Global", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
      { "@type": "BreadcrumbList", "@id": `${SITE_URL}/#breadcrumbs`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ] },
      { "@type": "FAQPage", "@id": `${SITE_URL}/#faq`, mainEntity: [
        ["What can you help me improve?", "Customer calls, appointment handling, spreadsheets, reporting, presentations, websites and marketing content."],
        ["Do I need to change my current tools?", "Usually no. Existing tools such as Excel, Google Sheets, Power BI and forms can often be connected."],
        ["How does a project begin?", "Send your requirement through the contact page so the scope and approach can be confirmed."],
        ["Can you support the solution after launch?", "Handover guidance and ongoing support can be included."],
      ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
    ],
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoDevanagari.variable} ${notoGurmukhi.variable} font-sans flex min-h-screen flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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

