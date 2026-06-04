"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [email, setEmail] = useState("");

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

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white shadow-lg">
      <h1 className="text-2xl font-bold">
        🌾 Smart Krishi AI
      </h1>

      <div className="flex gap-6 items-center">
        <Link href="/">Home</Link>
        <Link href="/disease-detection">Disease</Link>
        <Link href="/weather">Weather</Link>
        <Link href="/fertilizer">Fertilizer</Link>
        <Link href="/crop-info">Crop Info</Link>
        <Link href="/chatbot">Chatbot</Link>
        <Link href="/dashboard">Dashboard</Link>

        {email && (
          <span className="text-green-400">
            {email}
          </span>
        )}

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}