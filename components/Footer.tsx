"use client";

import Link from "next/link";
import { Mail, MapPin, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import WhatsAppIcon from "./WhatsAppIcon";

const CONTACT_EMAIL = "vineet.grover.1990@gmail.com";
const PHONE = "+974-71913089";
const WHATSAPP_NUMBER = "97471913089";
const LINKEDIN_URL = "https://linkedin.com/in/vineetgrover9581/";
const ADDRESS = "Canal Road, Dehradun, Uttarakhand, India – 248001";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className={`bg-navy-dark text-white/80 ${languageFontClass[language]}`}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">{t.footer.companyName}</h3>
            <p className="mt-2 text-sm text-white/60">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              {t.footer.quickLinks}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-accent">{t.nav.about}</Link></li>
              <li><Link href="/services" className="hover:text-accent">{t.nav.services}</Link></li>
              <li><Link href="/gallery" className="hover:text-accent">{t.nav.gallery}</Link></li>
              <li><Link href="/contact" className="hover:text-accent">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              {t.footer.contactInfo}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon size={16} className="shrink-0 text-[#25D366]" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin size={16} className="shrink-0" />
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} {t.footer.companyName}. {t.footer.rightsReserved}
        </div>
      </div>
    </footer>
  );
}
