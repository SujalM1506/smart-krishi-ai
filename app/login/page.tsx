"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  }

  async function signIn() {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-4xl text-white font-bold mb-6">
          Farmer Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
        />

        <button
          onClick={signIn}
          className="w-full bg-green-600 p-3 rounded mb-3"
        >
          Login
        </button>

        <button
          onClick={signUp}
          className="w-full bg-blue-600 p-3 rounded"
        >
          Register
        </button>
      </div>
    </main>
  );
}