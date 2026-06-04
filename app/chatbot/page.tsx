"use client";

import ProtectedPage from "@/components/ProtectedPage";
import { useState } from "react";
import Navbar from "@/components/Navbar";

// @ts-ignore
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition();

  async function askAI() {
    const finalMessage = message || transcript;

    if (!finalMessage) return;

    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReply(data.reply);
      } else {
        setReply("Error: " + data.error);
      }
    } catch (error) {
      setReply("Failed to connect to AI");
    }

    setLoading(false);
  }

  function startListening() {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  }

  function stopListening() {
    SpeechRecognition.stopListening();
  }

  return (
    <>
      <ProtectedPage />
      <Navbar />

      <main className="min-h-screen p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          🤖 Smart Krishi AI Chatbot
        </h1>

        {browserSupportsSpeechRecognition && (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={startListening}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
              >
                🎤 Start Recording
              </button>

              <button
                onClick={stopListening}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
              >
                🛑 Stop Recording
              </button>

              <button
                onClick={resetTranscript}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl"
              >
                🗑 Clear Voice
              </button>
            </div>

            <div className="mb-4">
              <span
                className={`px-4 py-2 rounded-lg ${
                  listening
                    ? "bg-green-600"
                    : "bg-gray-700"
                }`}
              >
                {listening
                  ? "🎙 Listening..."
                  : "🔇 Not Listening"}
              </span>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-6">
              <h2 className="font-bold mb-2">
                🎤 Voice Transcript
              </h2>

              <p>
                {transcript || "Speak something..."}
              </p>
            </div>
          </>
        )}

        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type your farming question..."
          className="w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 mb-6"
        />

        <button
          onClick={askAI}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
        >
          Ask AI
        </button>

        {loading && (
          <div className="mt-6">
            Thinking...
          </div>
        )}

        {reply && (
          <div className="mt-6 bg-gray-800 border border-gray-700 p-6 rounded-xl whitespace-pre-wrap">
            <h2 className="text-xl font-bold mb-3">
              🤖 AI Response
            </h2>

            {reply}
          </div>
        )}
      </main>
    </>
  );
}