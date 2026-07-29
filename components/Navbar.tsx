"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { TranslationKey } from "@/lib/i18n";

const navLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "home" },
  { href: "/disease-detection", labelKey: "disease" },
  { href: "/weather", labelKey: "weather" },
  { href: "/fertilizer", labelKey: "fertilizer" },
  { href: "/crop-info", labelKey: "cropInfoNav" },
  { href: "/chatbot", labelKey: "chatbot" },
  { href: "/dashboard", labelKey: "dashboard" },
];

export default function Navbar() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="sticky top-0 z-50 bg-black text-white shadow-lg">
      <div className="flex justify-between items-center p-4 gap-2">
        <Link
          href="/"
          className="text-lg sm:text-2xl font-bold truncate"
          onClick={() => setMenuOpen(false)}
        >
          🌾 {t("appTitle")}
        </Link>

        <div className="hidden lg:flex gap-4 xl:gap-6 items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap">
              {t(link.labelKey)}
            </Link>
          ))}

          <LanguageSwitcher />

          {email && (
            <span className="text-green-400 text-sm truncate max-w-[140px]">
              {email}
            </span>
          )}

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg whitespace-nowrap"
          >
            {t("logout")}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-black px-4 pb-4">
          <div className="flex flex-col gap-3 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 px-3 rounded-lg hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {email && (
              <span className="text-green-400 text-sm px-3 truncate">
                {email}
              </span>
            )}

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-full text-left"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
