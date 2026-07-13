import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json();

    console.log(
      "KEY:",
      JSON.stringify(process.env.GEMINI_API_KEY)
    );

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: image,
          mimeType,
        },
      },
      `
You are an expert agricultural scientist.

Analyze the uploaded crop image.

Return ONLY valid JSON.

Format:

{
  "crop": "",
  "disease": "",
  "symptoms": "",
  "medicine": "",
  "fertilizer": "",
  "prevention": ""
}

Return ONLY JSON.
`,
    ]);

    const aiResponse = result.response.text();

    console.log("AI Response:", aiResponse);

    const cleanJson = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const diseaseData = JSON.parse(cleanJson);

    const insertResult = await supabaseAdmin
      .from("disease_history")
      .insert([
        {
          crop_name: diseaseData.crop,
          disease_name: diseaseData.disease,
        },
      ]);

    console.log("Database:", insertResult);

    return Response.json({
      success: true,
      result: cleanJson,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
      raw: String(error),
    });
  }
}