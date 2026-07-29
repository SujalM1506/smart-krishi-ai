"use client";

import ProtectedPage from "@/components/ProtectedPage";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function FertilizerPage() {
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function getRecommendation() {
    if (!crop || !soil) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/fertilizer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crop,
            soil,
          }),
        }
      );

      const data = await response.json();

      setResult(
        data.recommendation ||
        "No recommendation found."
      );
    } catch (error) {
      setResult(
        "Failed to get recommendation."
      );
    }

    setLoading(false);
  }

  return (
    <>
      <ProtectedPage />
      <Navbar />

      <main className="min-h-screen p-4 sm:p-6 md:p-10 text-white">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8">
          🌱 Fertilizer Guide
        </h1>

        <input
          type="text"
          placeholder="Crop Name"
          value={crop}
          onChange={(e) =>
            setCrop(e.target.value)
          }
          className="block w-full max-w-md p-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 mb-4"
        />

        <input
          type="text"
          placeholder="Soil Type"
          value={soil}
          onChange={(e) =>
            setSoil(e.target.value)
          }
          className="block w-full max-w-md p-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 mb-4"
        />

        <button
          onClick={getRecommendation}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
        >
          Get Recommendation
        </button>

        {loading && (
          <p className="mt-4">
            Analyzing...
          </p>
        )}

        {result && (
          <div className="mt-6 bg-gray-800 border border-gray-700 p-6 rounded-xl whitespace-pre-wrap">
            {result}
          </div>
        )}
      </main>
    </>
  );
}