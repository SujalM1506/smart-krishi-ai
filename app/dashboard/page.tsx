"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [chatbotCount, setChatbotCount] = useState(0);
  const [diseaseCount, setDiseaseCount] = useState(0);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }
    }

    async function loadStats() {
      try {
        const response = await fetch(
          "/api/dashboard-summary"
        );

        const data = await response.json();

        if (data.success) {
          setChatbotCount(
            data.chatbotCount
          );

          setDiseaseCount(
            data.diseaseCount
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkUser();
    loadStats();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen p-4 sm:p-6 md:p-10 text-white">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8">
          📊 Farmer Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link href="/disease-detection">
            <div className="bg-blue-600 p-6 rounded-2xl cursor-pointer hover:bg-blue-700">
              <h2 className="text-2xl font-bold">
                🦠 Disease Detection
              </h2>

              <p className="mt-2">
                Scan crop diseases using AI.
              </p>
            </div>
          </Link>

          <Link href="/weather">
            <div className="bg-green-600 p-6 rounded-2xl cursor-pointer hover:bg-green-700">
              <h2 className="text-2xl font-bold">
                ☁ Weather Forecast
              </h2>

              <p className="mt-2">
                Check weather updates.
              </p>
            </div>
          </Link>

          <Link href="/fertilizer">
            <div className="bg-yellow-500 p-6 rounded-2xl cursor-pointer hover:bg-yellow-600">
              <h2 className="text-2xl font-bold">
                🌱 Fertilizer Guide
              </h2>

              <p className="mt-2">
                Get fertilizer recommendations.
              </p>
            </div>
          </Link>

          <Link href="/crop-info">
            <div className="bg-purple-600 p-6 rounded-2xl cursor-pointer hover:bg-purple-700">
              <h2 className="text-2xl font-bold">
                🌾 Crop Information
              </h2>

              <p className="mt-2">
                Learn about crops.
              </p>
            </div>
          </Link>

          <Link href="/chatbot">
            <div className="bg-pink-600 p-6 rounded-2xl cursor-pointer hover:bg-pink-700">
              <h2 className="text-2xl font-bold">
                🤖 AI Chatbot
              </h2>

              <p className="mt-2">
                Ask farming questions.
              </p>
            </div>
          </Link>

        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-gray-800 p-5 rounded-xl">
            <h3 className="text-xl font-bold">
              Disease Scans
            </h3>

            <p className="text-3xl mt-2">
              {diseaseCount}
            </p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <h3 className="text-xl font-bold">
              Weather Searches
            </h3>

            <p className="text-3xl mt-2">
              0
            </p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <h3 className="text-xl font-bold">
              Crop Searches
            </h3>

            <p className="text-3xl mt-2">
              0
            </p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <h3 className="text-xl font-bold">
              AI Questions
            </h3>

            <p className="text-3xl mt-2">
              {chatbotCount}
            </p>
          </div>

        </div>
      </main>
    </>
  );
}