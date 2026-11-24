"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  sendPhoneOtpAction,
  signInAction,
  verifyPhoneOtpAction,
  type LoginActionState,
  type PhoneOtpActionState,
} from "@/app/actions";

const initialState: LoginActionState = {};
const initialPhoneState: PhoneOtpActionState = {};

const countryCodes = [
  { country: "United States", code: "+1" },
  { country: "Canada", code: "+1" },
  { country: "United Kingdom", code: "+44" },
  { country: "India", code: "+91" },
  { country: "Australia", code: "+61" },
  { country: "New Zealand", code: "+64" },
  { country: "Nigeria", code: "+234" },
  { country: "South Africa", code: "+27" },
  { country: "Pakistan", code: "+92" },
  { country: "Bangladesh", code: "+880" },
  { country: "Philippines", code: "+63" },
  { country: "Singapore", code: "+65" },
  { country: "Malaysia", code: "+60" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "Saudi Arabia", code: "+966" },
  { country: "France", code: "+33" },
  { country: "Germany", code: "+49" },
  { country: "Italy", code: "+39" },
  { country: "Spain", code: "+34" },
  { country: "Netherlands", code: "+31" },
  { country: "Ireland", code: "+353" },
  { country: "Brazil", code: "+55" },
  { country: "Mexico", code: "+52" },
  { country: "Japan", code: "+81" },
  { country: "China", code: "+86" },
  { country: "South Korea", code: "+82" },
  { country: "Ghana", code: "+233" },
  { country: "Kenya", code: "+254" },
  { country: "Egypt", code: "+20" },
];

function PhoneLoginFlow({ onChangePhone }: { onChangePhone: () => void }) {
  const [requestState, requestAction, isRequestPending] = useActionState(
    sendPhoneOtpAction,
    initialPhoneState,
  );
  const [verifyState, verifyAction, isVerifyPending] = useActionState(
    verifyPhoneOtpAction,
    initialState,
  );

  if (requestState.phone) {
    return (
      <>
        <p className="phone-otp-copy">
          Enter the 6-digit code sent to <strong>{requestState.phone}</strong>.
        </p>
        <form action={verifyAction} className="login-form">
          <input type="hidden" name="phone" value={requestState.phone} />
          <label htmlFor="phone-otp">Verification code</label>
          <input
            autoComplete="one-time-code"
            autoFocus
            id="phone-otp"
            inputMode="numeric"
            maxLength={6}
            name="token"
            onChange={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 6);
            }}
            pattern="[0-9]{6}"
            placeholder="Enter your 6-digit code"
            required
            type="text"
          />
          {verifyState.error ? <p className="form-error" role="alert">{verifyState.error}</p> : null}
          <button className="primary-button login-submit" disabled={isVerifyPending} type="submit">
            {isVerifyPending ? "Verifying..." : "Verify and sign in"}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <button className="login-back-button" onClick={onChangePhone} type="button">
          Use a different phone number
        </button>
      </>
    );
  }

  return (
    <form action={requestAction} className="login-form">
      <label htmlFor="phone-number">Phone number</label>
      <div className="phone-input-group">
        <select aria-label="Country calling code" defaultValue="+234" name="countryCode">
          {countryCodes.map(({ country, code }) => (
            <option key={`${country}-${code}`} title={country} value={code}>{code}</option>
          ))}
        </select>
        <input
          autoComplete="tel-national"
          id="phone-number"
          inputMode="numeric"
          maxLength={10}
          minLength={10}
          name="phoneNumber"
          onChange={(event) => {
            event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
          }}
          pattern="[0-9]{10}"
          placeholder="10-digit phone number"
          required
          type="text"
        />
      </div>
      {requestState.error ? <p className="form-error" role="alert">{requestState.error}</p> : null}
      <button className="primary-button login-submit" disabled={isRequestPending} type="submit">
        {isRequestPending ? "Sending code..." : "Continue"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

function PhoneLoginForm() {
  const [flowKey, setFlowKey] = useState(0);

  return (
    <PhoneLoginFlow
      key={flowKey}
      onChangePhone={() => setFlowKey((currentKey) => currentKey + 1)}
    />
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="login-page login-page--split">
      <section className="login-card">
        <Link className="login-brand" href="/" aria-label="Spacemore Admin home">
          <span className="brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 19v-7m0 2c-4.5 0-6-2.5-6-5 3.5 0 6 1.5 6 5Zm0-3c0-3.5 2-5.5 5.5-5.5 0 3.5-1.5 5.5-5.5 5.5Z" />
            </svg>
          </span>
          <span>SpaciMore<span className="brand-admin"> / Control Center</span></span>
        </Link>
        <div className="login-content">
          <p className="eyebrow">Your Desired Market Place</p>
          <Image
            alt=""
            className="login-welcome-image"
            height={147}
            src="/one.png"
            width={220}
          />
          <h1>Welcome Back<br /></h1>
          <p className="login-copy">Pick up where you left off.</p>
          <div className="login-method-switch" aria-label="Sign-in method" role="group">
            <button
              aria-pressed={loginMethod === "email"}
              className={loginMethod === "email" ? "active" : ""}
              onClick={() => setLoginMethod("email")}
              type="button"
            >
              Email
            </button>
            <button
              aria-pressed={loginMethod === "phone"}
              className={loginMethod === "phone" ? "active" : ""}
              onClick={() => setLoginMethod("phone")}
              type="button"
            >
              Phone
            </button>
          </div>
          {loginMethod === "email" ? (
            <form action={formAction} className="login-form">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@spacimore.com" required />
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="password-visibility-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? (
                    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.5 5.4 8.5 7a8.8 8.8 0 0 1-2.4 3.4M6.2 6.2C4.5 7.4 3.5 9.1 3.5 12c0 1.6 3.3 7 8.5 7a9.5 9.5 0 0 0 3-.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                      <path d="M3.5 12c0-1.6 3.3-7 8.5-7s8.5 5.4 8.5 7-3.3 7-8.5 7-8.5-5.4-8.5-7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
              <Link className="forgot-password-link" href="/forgot-password">Forgot password?</Link>
              {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
              <button className="primary-button login-submit" disabled={isPending} type="submit">
                {isPending ? "Continuing..." : "Continue"}
                <ChevronRightIcon />
              </button>
            </form>
          ) : (
            <PhoneLoginForm />
          )}
          {/* <p className="login-footnote">Access is limited to accounts with the admin role.</p> */}
        </div>
        <p className="login-copyright">© SPACEMORE</p>
      </section>
      <aside className="login-promo" aria-label="Spacemore">
        <p className="login-promo-kicker">YOUR MARKETPLACE, AT A GLANCE</p>
        <div className="login-promo-copy">
          <h2>A better view of<br />your marketplace.</h2>
          <p>Manage products, customers, and orders<br className="desktop-break" /> all in one place.</p>
        </div>
        <p className="login-promo-footer">BUILT FOR BETTER COMMERCE <span>01 — 01</span></p>
      </aside>
    </main>
  );
}
