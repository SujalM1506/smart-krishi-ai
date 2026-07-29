"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Language } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  function select(lang: Language) {
    setLanguage(lang);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-300 hidden sm:inline">
        {t("language")}:
      </span>
      <div className="flex rounded-lg overflow-hidden border border-gray-600">
        <button
          type="button"
          onClick={() => select("en")}
          className={`px-3 py-1.5 text-sm font-medium transition ${
            language === "en"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {t("english")}
        </button>
        <button
          type="button"
          onClick={() => select("mr")}
          className={`px-3 py-1.5 text-sm font-medium transition ${
            language === "mr"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {t("marathi")}
        </button>
      </div>
    </div>
  );
}
