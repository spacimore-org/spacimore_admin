"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error?: string;
};

export type PhoneOtpActionState = {
  error?: string;
  phone?: string;
};

export type PasswordActionState = {
  error?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function ensureAdminRole(
  role: unknown,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  if (role === "admin") {
    return true;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }

  return false;
}

export async function signInAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!isValidEmail(email) || !password) {
    return { error: "Enter a valid email address and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!(await ensureAdminRole(data.user.app_metadata.role, supabase))) {
    return { error: "This account does not have admin access." };
  }

  redirect("/dashboard");
}

export async function requestPasswordResetAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const emailValue = formData.get("email");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const redirectTo = new URL("/auth/callback?next=/update-password", siteUrl).toString();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return { error: error.message };
  }

  return {
    message: "If an account exists for that address, a password reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("confirmPassword");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const confirmation = typeof confirmationValue === "string" ? confirmationValue : "";

  if (password.length < 8) {
    return { error: "Your password must be at least 8 characters." };
  }
  if (password !== confirmation) {
    return { error: "Those passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError && userError.name !== "AuthSessionMissingError") {
    throw userError;
  }
  if (!data.user) {
    return { error: "This password reset link has expired. Request a new link to continue." };
  }

  if (!(await ensureAdminRole(data.user.app_metadata.role, supabase))) {
    redirect("/access-denied");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function sendPhoneOtpAction(
  _previousState: PhoneOtpActionState,
  formData: FormData,
): Promise<PhoneOtpActionState> {
  const countryCodeValue = formData.get("countryCode");
  const phoneValue = formData.get("phoneNumber");
  const countryCode = typeof countryCodeValue === "string" ? countryCodeValue : "";
  const localPhone = typeof phoneValue === "string" ? phoneValue : "";

  if (!/^\+\d{1,3}$/.test(countryCode) || !/^\d{10}$/.test(localPhone)) {
    return { error: "Enter a valid country code and 10-digit phone number." };
  }

  const phone = `${countryCode}${localPhone}`;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: false, channel: "sms" },
  });

  if (error) {
    return { error: error.message };
  }

  return { phone };
}

export async function verifyPhoneOtpAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const phoneValue = formData.get("phone");
  const tokenValue = formData.get("token");
  const phone = typeof phoneValue === "string" ? phoneValue : "";
  const token = typeof tokenValue === "string" ? tokenValue : "";

  if (!/^\+\d{11,13}$/.test(phone) || !/^\d{6}$/.test(token)) {
    return { error: "Enter the 6-digit code sent to your phone." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "We could not verify that code. Please try again." };
  }

  if (!(await ensureAdminRole(data.user.app_metadata.role, supabase))) {
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
