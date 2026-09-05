"use client";

import { Mail, MapPin, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import ContactForm from "@/components/ContactForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const CONTACT_EMAIL = "vineet.grover.1990@gmail.com";
const WHATSAPP_NUMBER = "97471913089";
const LINKEDIN_URL = "https://linkedin.com/in/vineetgrover9581/";
const ADDRESS = "Canal Road, Dehradun, Uttarakhand, India – 248001";

export default function ContactPage() {
  const { t, language } = useLanguage();

  return (
    <div className={languageFontClass[language]}>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t.contact.pageTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{t.contact.sectionSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-navy">
                <Mail size={18} /> {t.contact.directEmail}
              </h3>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block text-slate-600 hover:text-accent">
                {CONTACT_EMAIL}
              </a>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold text-navy">
                <MapPin size={18} /> {t.contact.addressTitle}
              </h3>
              <p className="mt-1 text-slate-600">{ADDRESS}</p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold text-navy">{t.contact.connectTitle}</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-green-500 hover:text-green-600"
                >
                  <WhatsAppIcon size={16} className="text-[#25D366]" /> {t.contact.whatsapp}
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
                >
                  <Linkedin size={16} /> {t.contact.linkedin}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
