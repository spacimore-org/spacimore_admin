"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error?: string;
};

export async function signInAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
    return { error: "Enter a valid email address and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user.app_metadata.role !== "admin") {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw signOutError;
    }
    return { error: "This account does not have admin access." };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  redirect("/login");
}
