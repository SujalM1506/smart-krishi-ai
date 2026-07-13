"use client";

import { useState } from "react";

interface DiseaseResult {
  crop: string;
  disease: string;
  symptoms: string;
  medicine: string;
  fertilizer: string;
  prevention: string;
}

export default function DiseaseUploader() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState("");

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setError("");
    setData(null);

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];

        const response = await fetch("/api/analyze-disease", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
            mimeType: file.type,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Failed to analyze image");
          setLoading(false);
          return;
        }

        // Remove markdown code block if Gemini returns one
        const cleanJson = result.result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed: DiseaseResult = JSON.parse(cleanJson);

        setData(parsed);
      } catch (err) {
        console.error("Disease Analysis Error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to analyze image");
        }
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white"
      />

      {loading && (
        <div className="rounded-xl bg-yellow-500/20 p-4 text-yellow-300">
          🔍 Analyzing crop image...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/20 p-4 text-red-300">
          ❌ {error}
        </div>
      )}

      {data && (
        <div className="grid gap-4">

          <div className="rounded-xl bg-blue-600 p-5">
            <h2 className="mb-2 text-xl font-bold">
              🌾 Crop
            </h2>
            <p>{data.crop}</p>
          </div>

          <div className="rounded-xl bg-red-600 p-5">
            <h2 className="mb-2 text-xl font-bold">
              🦠 Disease
            </h2>
            <p>{data.disease}</p>
          </div>

          <div className="rounded-xl bg-orange-600 p-5">
            <h2 className="mb-2 text-xl font-bold">
              ⚠ Symptoms
            </h2>
            <p>{data.symptoms}</p>
          </div>

          <div className="rounded-xl bg-green-600 p-5">
            <h2 className="mb-2 text-xl font-bold">
              💊 Recommended Medicine
            </h2>
            <p>{data.medicine}</p>
          </div>

          <div className="rounded-xl bg-yellow-400 p-5 text-black">
            <h2 className="mb-2 text-xl font-bold">
              🌱 Fertilizer Recommendation
            </h2>
            <p>{data.fertilizer}</p>
          </div>

          <div className="rounded-xl bg-purple-600 p-5">
            <h2 className="mb-2 text-xl font-bold">
              ✅ Prevention Tips
            </h2>
            <p>{data.prevention}</p>
          </div>

        </div>
      )}
    </div>
  );
}