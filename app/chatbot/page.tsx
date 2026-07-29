"use client";

import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/Navbar";
import { useState } from "react";

// @ts-ignore
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition();

  async function askAI() {
    const finalMessage = message || transcript;

    if (!finalMessage.trim()) return;

    setLoading(true);

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: finalMessage,
      },
    ]);

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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.success
            ? data.reply
            : "Error: " + data.error,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Failed to connect to AI",
        },
      ]);
    }

    setMessage("");
    resetTranscript();
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

      <main className="min-h-screen p-4 sm:p-6 md:p-10 text-white">

        <h1 className="text-3xl sm:text-5xl font-bold mb-8">
          🤖 Smart Krishi AI Chatbot
        </h1>

        {browserSupportsSpeechRecognition && (
          <>
            <div className="flex gap-4 mb-4 flex-wrap">
              <button
                onClick={startListening}
                className="bg-green-600 px-5 py-3 rounded-xl"
              >
                🎤 Start
              </button>

              <button
                onClick={stopListening}
                className="bg-red-600 px-5 py-3 rounded-xl"
              >
                Stop
              </button>

              <button
                onClick={resetTranscript}
                className="bg-gray-700 px-5 py-3 rounded-xl"
              >
                Clear Voice
              </button>
            </div>

            <div className="mb-6">
              {listening ? "🎙 Listening..." : "🔇 Not Listening"}
            </div>

            <div className="bg-gray-800 p-4 rounded-xl mb-6">
              {transcript}
            </div>
          </>
        )}

        <div className="space-y-4 mb-8 max-h-[500px] overflow-y-auto">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? "bg-blue-700 p-4 rounded-xl ml-auto w-fit max-w-[80%]"
                  : "bg-gray-800 p-4 rounded-xl mr-auto w-fit max-w-[80%]"
              }
            >
              <strong>
                {msg.role === "user" ? "You" : "AI"}
              </strong>

              <p className="mt-2 whitespace-pre-wrap">
                {msg.text}
              </p>
            </div>
          ))}

          {loading && (
            <div className="bg-gray-700 p-4 rounded-xl w-fit">
              🤖 Thinking...
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask any farming question..."
            className="w-full sm:flex-1 p-4 rounded-xl bg-gray-800 border border-gray-700"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className="bg-blue-600 px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </main>
    </>
  );
}