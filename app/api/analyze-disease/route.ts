import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json();

   console.log("KEY VALUE:", JSON.stringify(process.env.GEMINI_API_KEY));
console.log("KEY LENGTH:", process.env.GEMINI_API_KEY?.length);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    let result;

    // Retry up to 3 times if Gemini is busy
    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent([
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

        break;
      } catch (err) {
        if (i === 2) throw err;

        console.log(
          `Gemini busy. Retrying (${i + 1}/3)...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
      }
    }

    const aiResponse = result!.response.text();

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

    console.log("Disease History Saved:", insertResult);

    return Response.json({
      success: true,
      result: cleanJson,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return Response.json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown Error",
    });
  }
}