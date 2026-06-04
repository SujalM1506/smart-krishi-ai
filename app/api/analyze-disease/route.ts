import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash-lite",    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: image,
          mimeType: mimeType,
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

Rules:
- Identify the crop.
- Identify the disease if present.
- If healthy, set disease to "Healthy".
- Recommend suitable medicine.
- Recommend suitable fertilizer.
- Give prevention tips.
- Return ONLY JSON.
`,
    ]);

    const aiResponse = result.response.text();

    console.log("AI Response:", aiResponse);

    try {
      const cleanJson = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const diseaseData = JSON.parse(cleanJson);

      const insertResult = await supabase
        .from("disease_history")
        .insert([
          {
            crop_name: diseaseData.crop || "Unknown",
            disease_name:
              diseaseData.disease || "Unknown",
          },
        ]);

      console.log(
        "Disease History Saved:",
        insertResult
      );
    } catch (saveError) {
      console.log(
        "Database Save Error:",
        saveError
      );
    }

    return Response.json({
      success: true,
      result: aiResponse,
    });
  } catch (error) {
  console.error("FULL ERROR:", error);

  return Response.json({
    success: false,
    error: String(error),
  });
}
}