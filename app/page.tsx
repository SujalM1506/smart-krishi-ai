import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-white">
        <h1 className="text-6xl md:text-7xl font-bold text-center mb-6">
          🌾 Smart Krishi AI
        </h1>

        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl">
          AI-powered agriculture assistant that helps farmers identify crop
          diseases, get fertilizer recommendations, check weather forecasts,
          chat with AI, and learn about crops.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">

          <Link href="/disease-detection">
            <div className="bg-blue-600 hover:bg-blue-700 p-8 rounded-2xl shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-bold mb-3">
                🔬 Disease Detection
              </h2>

              <p>
                Upload crop images and detect diseases using AI.
              </p>
            </div>
          </Link>

          <Link href="/weather">
            <div className="bg-green-600 hover:bg-green-700 p-8 rounded-2xl shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-bold mb-3">
                ☁️ Weather Forecast
              </h2>

              <p>
                Get live weather updates and rainfall predictions.
              </p>
            </div>
          </Link>

          <Link href="/fertilizer">
            <div className="bg-yellow-500 hover:bg-yellow-600 p-8 rounded-2xl shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-bold mb-3">
                🌱 Fertilizer Guide
              </h2>

              <p>
                Get fertilizer recommendations for better crop yield.
              </p>
            </div>
          </Link>
          <Link href="/dashboard">
  <div className="bg-cyan-600 hover:bg-cyan-700 p-8 rounded-2xl shadow-lg transition cursor-pointer">
    <h2 className="text-2xl font-bold mb-3">
      📊 Dashboard
    </h2>

    <p>
      View all Smart Krishi AI tools.
    </p>
  </div>
</Link>

          <Link href="/crop-info">
            <div className="bg-purple-600 hover:bg-purple-700 p-8 rounded-2xl shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-bold mb-3">
                📖 Crop Information
              </h2>

              <p>
                Learn about crops, diseases, harvesting, and care.
              </p>
            </div>
          </Link>

          <Link href="/chatbot">
            <div className="bg-pink-600 hover:bg-pink-700 p-8 rounded-2xl shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-bold mb-3">
                🤖 Farmer Chatbot
              </h2>

              <p>
                Ask farming questions and get instant AI advice.
              </p>
            </div>
          </Link>

        </div>
      </main>
    </>
  );
}