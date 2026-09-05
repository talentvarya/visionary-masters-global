"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t, language } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className={`sticky top-0 z-40 bg-navy text-white shadow-md ${languageFontClass[language]}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* min-w-0 + truncate so the brand gives way on narrow phones instead of
            pushing the language switcher and menu button off screen. */}
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-navy font-bold text-lg">
            VM
          </span>
          <span className="truncate text-base font-bold leading-tight sm:text-xl">
            Visionary Masters Global
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-navy hover:bg-accent-light transition-colors"
          >
            {t.nav.getInTouch}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-md p-1.5 hover:bg-white/10"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-navy-dark px-4 py-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
