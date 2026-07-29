"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const features = [
  {
    href: "/disease-detection",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: "🔬",
    titleKey: "diseaseDetection" as const,
    descKey: "diseaseDesc" as const,
  },
  {
    href: "/weather",
    color: "bg-green-600 hover:bg-green-700",
    icon: "☁️",
    titleKey: "weather" as const,
    descKey: "weatherDesc" as const,
  },
  {
    href: "/fertilizer",
    color: "bg-yellow-500 hover:bg-yellow-600",
    icon: "🌱",
    titleKey: "fertilizer" as const,
    descKey: "fertilizerDesc" as const,
  },
  {
    href: "/dashboard",
    color: "bg-cyan-600 hover:bg-cyan-700",
    icon: "📊",
    titleKey: "dashboard" as const,
    descKey: "dashboardDesc" as const,
  },
  {
    href: "/crop-info",
    color: "bg-purple-600 hover:bg-purple-700",
    icon: "📖",
    titleKey: "cropInfo" as const,
    descKey: "cropInfoDesc" as const,
  },
  {
    href: "/chatbot",
    color: "bg-pink-600 hover:bg-pink-700",
    icon: "🤖",
    titleKey: "chatbot" as const,
    descKey: "chatbotDesc" as const,
  },
];

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <h1 className="text-lg sm:text-2xl font-bold truncate">
          🌾 {t("appTitle")}
        </h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            {t("login")}
          </Link>
        </div>
      </header>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-white">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-center mb-6">
          🌾 {t("appTitle")}
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 text-center mb-8 max-w-3xl">
          {t("tagline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/login?mode=register"
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-lg font-semibold text-center shadow-lg transition"
          >
            {t("getStarted")}
          </Link>
          <Link
            href="/login"
            className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl text-lg font-semibold text-center border border-gray-600 transition"
          >
            {t("alreadyAccount")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <div
                className={`${feature.color} p-8 rounded-2xl shadow-lg transition cursor-pointer h-full`}
              >
                <h2 className="text-2xl font-bold mb-3">
                  {feature.icon} {t(feature.titleKey)}
                </h2>
                <p>{t(feature.descKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
