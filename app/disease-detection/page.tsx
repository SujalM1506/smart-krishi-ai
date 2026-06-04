"use client";

import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/Navbar";
import DiseaseUploader from "@/components/DiseaseUploader";

export default function DiseasePage() {
  return (
    <>
      <ProtectedPage />
      <Navbar />

      <main className="min-h-screen p-10 text-white">
        <h1 className="text-5xl font-bold mb-6">
          🌾 Crop Disease Detection
        </h1>

        <p className="text-gray-300 mb-8">
          Upload a crop image and let AI identify diseases.
        </p>

        <DiseaseUploader />
      </main>
    </>
  );
}