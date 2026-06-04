import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const chatbot = await supabase
      .from("activity_logs")
      .select("*", { count: "exact", head: true });

    const disease = await supabase
      .from("disease_history")
      .select("*", { count: "exact", head: true });

    return Response.json({
      success: true,
      chatbotCount: chatbot.count || 0,
      diseaseCount: disease.count || 0,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}