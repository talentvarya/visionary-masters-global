"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import type { Client } from "@/types/database";

export default function ClientsPage() {
  const { t, language } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clients")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setClients(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className={languageFontClass[language]}>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t.clients.pageTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{t.clients.sectionSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <p className="text-center text-slate-500">{t.clients.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {clients.map((client) => {
              const card = (
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md">
                  {client.logo_url ? (
                    <div className="relative h-14 w-full">
                      <Image
                        src={client.logo_url}
                        alt={client.name}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy">
                      <Building2 size={22} />
                    </span>
                  )}
                  <span className="text-sm font-semibold text-navy">{client.name}</span>
                </div>
              );

              return client.website_url ? (
                <a
                  key={client.id}
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {card}
                </a>
              ) : (
                <div key={client.id}>{card}</div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
