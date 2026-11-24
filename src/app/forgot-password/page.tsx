import Link from "next/link";
import { ForgotPasswordForm } from "@/components/password-reset-forms";
import { AuthFlowShell } from "@/components/auth-flow-shell";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthFlowShell
      title="Reset your password"
      description="Enter the email address linked to your admin account and we’ll send you a reset link."
      footer={<p className="auth-switch">Remembered it? <Link href="/login">Back to sign in</Link></p>}
    >
      {error === "callback" ? (
        <p className="form-error" role="alert">
          This reset link is invalid or has expired. Request a new one to continue.
        </p>
      ) : null}
      <ForgotPasswordForm />
    </AuthFlowShell>
  );
}
