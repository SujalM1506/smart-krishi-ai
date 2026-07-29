"use client";

import ProtectedPage from "@/components/ProtectedPage";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function CropInfoPage() {
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function getCropInfo() {
    if (!crop) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/crop-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crop,
          }),
        }
      );

      const data = await response.json();

      setResult(
        data.result ||
          "No information found."
      );
    } catch (error) {
      setResult(
        "Failed to fetch crop information."
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
          🌾 Crop Information Center
        </h1>

        <input
          type="text"
          placeholder="Enter Crop Name"
          value={crop}
          onChange={(e) =>
            setCrop(e.target.value)
          }
          className="w-full max-w-md p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
        />

        <button
          onClick={getCropInfo}
          className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
        >
          Get Crop Information
        </button>

        {loading && (
          <p className="mt-4">
            Loading...
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