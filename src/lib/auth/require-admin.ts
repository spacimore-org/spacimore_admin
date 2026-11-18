import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    throw error;
  }

  if (!data.user) {
    redirect("/login");
  }

  if (data.user.app_metadata.role !== "admin") {
    redirect("/access-denied");
  }

  return data.user;
}
