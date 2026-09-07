import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";
import en from "@/locales/en.json";

const SITE_URL = "https://visionary-masters-global-tsgl.vercel.app";

export function generateStaticParams() {
  return en.services.items.map((item) => ({ serviceId: item.id }));
}

export function generateMetadata({ params }: { params: { serviceId: string } }): Metadata {
  const item = en.services.items.find((service) => service.id === params.serviceId);
  if (!item) return { title: "Service | Visionary Masters Global" };

  return {
    title: `${item.title} | Visionary Masters Global`,
    description: item.shortDescription,
    alternates: { canonical: `${SITE_URL}/services/${item.id}` },
    openGraph: { title: item.title, description: item.shortDescription, url: `${SITE_URL}/services/${item.id}` },
  };
}

export default function ServicePage({ params }: { params: { serviceId: string } }) {
  if (!en.services.items.some((item) => item.id === params.serviceId)) notFound();
  return <ServiceDetail serviceId={params.serviceId} />;
}
