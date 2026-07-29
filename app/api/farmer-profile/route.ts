import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const profile = {
      id: user.id,
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      village: body.village,
      district: body.district,
      state: body.state,
      pincode: body.pincode,
      land_area: body.landArea,
      primary_crop: body.primaryCrop,
      farming_experience: body.farmingExperience || null,
      preferred_language: body.preferredLanguage || "en",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from("farmer_profiles")
      .upsert(profile, { onConflict: "id" });

    if (error) {
      console.error("Farmer profile save error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Farmer profile API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
