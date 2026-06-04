import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(
      "Reply with only the word SUCCESS"
    );

    return Response.json({
      success: true,
      response: result.response.text(),
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}