import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { crop, soil } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(`
You are an agricultural fertilizer expert.

Crop: ${crop}
Soil Type: ${soil}

Provide:

1. Recommended Fertilizer
2. Quantity per acre
3. Application Method
4. Best Time to Apply
5. Precautions

Use simple farmer-friendly language.
`);

    return Response.json({
      success: true,
      recommendation: result.response.text(),
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}