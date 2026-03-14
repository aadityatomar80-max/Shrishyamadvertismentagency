import Link from "next/link";
// import { useLanguage } from "./LanguageContext";
// import { useTheme } from "./ThemeContext";
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
  // const { lang, toggle } = useLanguage();
  const lang = "en"; // Temporary fallback
  // const { theme, toggle: toggleTheme } = useTheme();
  const theme = "light"; // Temporary fallback - showing the new blue theme

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page flex items-center justify-between py-4">
        <Logo />
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex dark:text-slate-300">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="hover:text-primary dark:hover:text-primary"
              >
                {lang === "en" ? link.en : link.hi}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              // onClick={toggleTheme}
              className="rounded-full border border-slate-300 p-2 text-[11px] font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              // onClick={toggle}
              className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-primary-dark"
            >
              {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


