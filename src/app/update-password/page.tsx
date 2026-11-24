import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthFlowShell } from "@/components/auth-flow-shell";
import { UpdatePasswordForm } from "@/components/password-reset-forms";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    return (
      <AuthFlowShell
        title="This link has expired"
        description="Password reset links can only be used once. Request a fresh link to continue."
      >
        <Link className="primary-button login-submit" href="/forgot-password">
          Request a new link
          <span aria-hidden="true">›</span>
        </Link>
      </AuthFlowShell>
    );
  }

  if (data.user.app_metadata.role !== "admin") {
    redirect("/access-denied");
  }

  return (
    <AuthFlowShell
      title="Choose a new password"
      description="Use at least 8 characters for your new admin password."
      footer={<p className="auth-switch"><Link href="/login">Back to sign in</Link></p>}
    >
      <UpdatePasswordForm />
    </AuthFlowShell>
  );
}
