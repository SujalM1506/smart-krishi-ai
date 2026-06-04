import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { crop } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(`
You are an agricultural expert.

Provide information about this crop:

${crop}

Include:

1. Crop Name
2. Ideal Temperature
3. Water Requirement
4. Suitable Soil
5. Sowing Season
6. Harvest Time
7. Common Diseases
8. Recommended Fertilizer

Use simple language for farmers.
`);

    return Response.json({
      success: true,
      result: result.response.text(),
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}