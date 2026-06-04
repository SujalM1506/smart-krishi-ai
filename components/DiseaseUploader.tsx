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

        const response = await fetch(
          "/api/analyze-disease",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64,
              mimeType: file.type,
            }),
          }
        );

        const result = await response.json();

        if (!result.success) {
          setError(result.error);
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(result.result);

        setData(parsed);
      } catch (err) {
        setError("Failed to analyze image");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block"
      />

      {loading && (
        <div className="text-yellow-400">
          Analyzing crop image...
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 p-4 rounded-xl">
          {error}
        </div>
      )}

      {data && (
        <div className="grid gap-4">
          <div className="bg-blue-600 p-4 rounded-xl">
            <h2 className="font-bold text-xl">
              🌾 Crop
            </h2>
            <p>{data.crop}</p>
          </div>

          <div className="bg-red-600 p-4 rounded-xl">
            <h2 className="font-bold text-xl">
              🦠 Disease
            </h2>
            <p>{data.disease}</p>
          </div>

          <div className="bg-orange-600 p-4 rounded-xl">
            <h2 className="font-bold text-xl">
              ⚠ Symptoms
            </h2>
            <p>{data.symptoms}</p>
          </div>

          <div className="bg-green-600 p-4 rounded-xl">
            <h2 className="font-bold text-xl">
              💊 Medicine
            </h2>
            <p>{data.medicine}</p>
          </div>

          <div className="bg-yellow-500 p-4 rounded-xl text-black">
            <h2 className="font-bold text-xl">
              🌱 Fertilizer
            </h2>
            <p>{data.fertilizer}</p>
          </div>

          <div className="bg-purple-600 p-4 rounded-xl">
            <h2 className="font-bold text-xl">
              ✅ Prevention
            </h2>
            <p>{data.prevention}</p>
          </div>
        </div>
      )}
    </div>
  );
}