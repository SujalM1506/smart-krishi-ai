"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface FarmerForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  landArea: string;
  primaryCrop: string;
  farmingExperience: string;
}

const emptyForm: FarmerForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  village: "",
  district: "",
  state: "",
  pincode: "",
  landArea: "",
  primaryCrop: "",
  farmingExperience: "",
};

function AuthPageContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FarmerForm>(emptyForm);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  function updateField(field: keyof FarmerForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveFarmerProfile(
    accessToken: string,
    profile: Omit<FarmerForm, "password" | "confirmPassword"> & {
      preferredLanguage: string;
    }
  ) {
    await fetch("/api/farmer-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profile),
    });
  }

  async function handleRegister() {
    const required = [
      form.fullName,
      form.email,
      form.phone,
      form.password,
      form.village,
      form.district,
      form.state,
      form.pincode,
      form.landArea,
      form.primaryCrop,
    ];

    if (required.some((v) => !v.trim())) {
      setMessage(t("fillAllFields"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          village: form.village.trim(),
          district: form.district.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          land_area: form.landArea.trim(),
          primary_crop: form.primaryCrop.trim(),
          farming_experience: form.farmingExperience.trim(),
          preferred_language: language,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session?.access_token) {
      await saveFarmerProfile(data.session.access_token, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        village: form.village.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        landArea: form.landArea.trim(),
        primaryCrop: form.primaryCrop.trim(),
        farmingExperience: form.farmingExperience.trim(),
        preferredLanguage: language,
      });
    }

    setMessage(t("registerSuccess"));
    setLoading(false);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  }

  async function handleLogin() {
    if (!loginEmail.trim() || !loginPassword) {
      setMessage(t("fillAllFields"));
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  const inputClass =
    "w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-green-400 hover:text-green-300 text-sm">
            ← {t("home")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-2">
            {mode === "login" ? t("farmerLogin") : t("farmerRegister")}
          </h1>

          <div className="flex gap-2 mb-6 mt-4">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                mode === "login"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t("login")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                mode === "register"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t("register")}
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes("successful") ||
                message.includes("यशस्वी") ||
                message.includes("Welcome") ||
                message.includes("swagat")
                  ? "bg-green-600/20 text-green-300"
                  : "bg-red-600/20 text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputClass}
                  placeholder={t("email")}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={inputClass}
                  placeholder={t("password")}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 p-3 rounded-lg font-medium"
              >
                {loading ? t("signingIn") : t("login")}
              </button>
              <p className="text-center text-sm text-gray-400">
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-green-400 hover:underline"
                >
                  {t("switchToRegister")}
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-green-400 mb-3 border-b border-gray-700 pb-2">
                  {t("personalDetails")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("fullName")} *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={inputClass}
                      placeholder={t("fullName")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClass}
                      placeholder={t("email")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("phone")} *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClass}
                      placeholder={t("phone")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("password")} *
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={inputClass}
                      placeholder={t("password")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("confirmPassword")} *
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      className={inputClass}
                      placeholder={t("confirmPassword")}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-green-400 mb-3 border-b border-gray-700 pb-2">
                  {t("farmDetails")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("village")} *
                    </label>
                    <input
                      type="text"
                      value={form.village}
                      onChange={(e) => updateField("village", e.target.value)}
                      className={inputClass}
                      placeholder={t("village")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("district")} *
                    </label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => updateField("district", e.target.value)}
                      className={inputClass}
                      placeholder={t("district")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("state")} *
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className={inputClass}
                      placeholder={t("state")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("pincode")} *
                    </label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      className={inputClass}
                      placeholder={t("pincode")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("landArea")} *
                    </label>
                    <input
                      type="text"
                      value={form.landArea}
                      onChange={(e) => updateField("landArea", e.target.value)}
                      className={inputClass}
                      placeholder={t("landArea")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("primaryCrop")} *
                    </label>
                    <input
                      type="text"
                      value={form.primaryCrop}
                      onChange={(e) =>
                        updateField("primaryCrop", e.target.value)
                      }
                      className={inputClass}
                      placeholder={t("primaryCrop")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-300 mb-1">
                      {t("farmingExperience")}
                    </label>
                    <input
                      type="text"
                      value={form.farmingExperience}
                      onChange={(e) =>
                        updateField("farmingExperience", e.target.value)
                      }
                      className={inputClass}
                      placeholder={t("farmingExperience")}
                    />
                  </div>
                </div>
              </section>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-lg font-medium"
              >
                {loading ? t("registering") : t("submitRegister")}
              </button>

              <p className="text-center text-sm text-gray-400">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-green-400 hover:underline"
                >
                  {t("switchToLogin")}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-white">
          Loading...
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
