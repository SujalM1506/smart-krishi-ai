import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  return Response.json({
    success: true,
    message: "API route working",
  });
}