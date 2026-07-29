"use client";

import ProtectedPage from "@/components/ProtectedPage";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function getWeather() {
    if (!city) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/weather?city=${city}`
      );

      const data = await response.json();

      setWeather(data);
    } catch (error) {
      setWeather({
        success: false,
        error: "Failed to fetch weather",
      });
    }

    setLoading(false);
  }

  return (
    <>
      <ProtectedPage />
      <Navbar />

      <main className="min-h-screen p-4 sm:p-6 md:p-10 text-white">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8">
          ☁ Weather Forecast
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
          />

          <button
            onClick={getWeather}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="text-yellow-400">
            Loading weather...
          </p>
        )}

        {weather?.success && (
          <div className="grid gap-4 max-w-xl">
            <div className="bg-blue-600 p-4 rounded-xl">
              🌍 City: {weather.city}
            </div>

            <div className="bg-green-600 p-4 rounded-xl">
              🌡 Temperature: {weather.temperature}°C
            </div>

            <div className="bg-purple-600 p-4 rounded-xl">
              ☁ Weather: {weather.weather}
            </div>

            <div className="bg-orange-600 p-4 rounded-xl">
              💧 Humidity: {weather.humidity}%
            </div>

            <div className="bg-red-600 p-4 rounded-xl">
              🌬 Wind Speed: {weather.windSpeed} m/s
            </div>
          </div>
        )}

        {weather && !weather.success && (
          <div className="bg-red-500 p-4 rounded-xl">
            {weather.error}
          </div>
        )}
      </main>
    </>
  );
}