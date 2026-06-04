import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    console.log("Chatbot message:", message);

    const insertResult = await supabase
      .from("activity_logs")
      .insert([
        {
          activity: "Chatbot: " + message,
        },
      ]);

    console.log("Supabase result:", insertResult);

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(`
You are Smart Krishi AI.

You are an expert agricultural advisor.

Answer farmer questions in simple language.

Question:
${message}
`);

    return Response.json({
      success: true,
      reply: result.response.text(),
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);

    return Response.json({
      success: false,
      error: String(error),
    });
  }
}