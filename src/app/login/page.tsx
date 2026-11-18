"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type LoginActionState } from "@/app/actions";

const initialState: LoginActionState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <main className="login-page login-page--split">
      <section className="login-card">
        <Link className="login-brand" href="/" aria-label="Spacemore Admin home">
          <span className="brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 19v-7m0 2c-4.5 0-6-2.5-6-5 3.5 0 6 1.5 6 5Zm0-3c0-3.5 2-5.5 5.5-5.5 0 3.5-1.5 5.5-5.5 5.5Z" />
            </svg>
          </span>
          <span>spacemore<span className="brand-admin"> / admin</span></span>
        </Link>
        <div className="login-content">
          <p className="eyebrow">A PLACE TO BEGIN AGAIN</p>
          <h1>Welcome to<br />Spacemore</h1>
          <p className="login-copy">Pick up where you left off.</p>
          <form action={formAction} className="login-form">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
            {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
            <button className="primary-button login-submit" disabled={isPending} type="submit">
              {isPending ? "Signing in..." : "Sign in"}
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="login-footnote">Access is limited to accounts with the admin role.</p>
        </div>
        <p className="login-copyright">© SPACEMORE</p>
      </section>
      <aside className="login-promo" aria-label="Spacemore">
        <p className="login-promo-kicker">A QUIETER KIND OF PROGRESS</p>
        <div className="login-promo-copy">
          <h2>Make room for<br />what matters.</h2>
          <p>A little space to gather your thoughts and begin<br className="desktop-break" /> again, whenever you need.</p>
        </div>
        <div className="login-illustration" aria-hidden="true"><span /></div>
        <p className="login-promo-footer">TAKE IT AT YOUR PACE <span>01 — 01</span></p>
      </aside>
    </main>
  );
}
