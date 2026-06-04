"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProtectedPage() {
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
      }
    }

    checkUser();
  }, []);

  return null;
}