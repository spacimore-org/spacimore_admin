"use client";

import { useActionState } from "react";
import {
  requestPasswordResetAction,
  updatePasswordAction,
  type PasswordActionState,
} from "@/app/actions";

const initialState: PasswordActionState = {};

function Feedback({ state }: { state: PasswordActionState }) {
  if (state.error) {
    return <p className="form-error" role="alert">{state.error}</p>;
  }
  if (state.message) {
    return <p className="form-success" role="status">{state.message}</p>;
  }
  return null;
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={action} className="login-form">
      <label htmlFor="reset-email">Email address</label>
      <input
        autoComplete="email"
        id="reset-email"
        name="email"
        placeholder="you@spacimore.com"
        required
        type="email"
      />
      <Feedback state={state} />
      <button className="primary-button login-submit" disabled={pending} type="submit">
        {pending ? "Sending link..." : "Send reset link"}
        <span aria-hidden="true">›</span>
      </button>
    </form>
  );
}

function PasswordField({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <input
        autoComplete="new-password"
        id={id}
        minLength={8}
        name={id}
        placeholder="At least 8 characters"
        required
        type="password"
      />
    </div>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <form action={action} className="login-form">
      <PasswordField id="password" label="New password" />
      <PasswordField id="confirmPassword" label="Confirm new password" />
      <Feedback state={state} />
      <button className="primary-button login-submit" disabled={pending} type="submit">
        {pending ? "Updating password..." : "Update password"}
        <span aria-hidden="true">›</span>
      </button>
    </form>
  );
}
