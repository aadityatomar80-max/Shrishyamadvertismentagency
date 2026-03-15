"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/", key: "home", en: "Home", hi: "होम" },
  { href: "/about", key: "about", en: "About", hi: "हमारे बारे में" },
  { href: "/services", key: "services", en: "Services", hi: "सेवाएँ" },
  {
    href: "/partner-join",
    key: "partner",
    en: "Join as Partner",
    hi: "पार्टनर बनें"
  },
  { href: "/login", key: "login", en: "Login", hi: "लॉगिन" }
];

export function Navbar() {
  const { lang, toggle } = useLanguage();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container-page flex items-center justify-between py-4">
        <Logo />
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="hover:text-primary"
              >
                {lang === "en" ? link.en : link.hi}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


