import Link from "next/link";
import { signOutAction } from "@/app/actions";

export default function AccessDeniedPage() {
  return (
    <main className="login-page login-page--restricted">
      <section className="login-card">
        <Link className="login-brand" href="/" aria-label="Spacemore Admin home">
          <span className="brand-symbol">s</span>
          <span>spacemore<span className="brand-admin"> / admin</span></span>
        </Link>
        <p className="eyebrow">ACCESS RESTRICTED</p>
        <h1>Admin access required.</h1>
        <p className="login-copy">
          This Supabase account is signed in, but it does not have the Spacemore admin role.
        </p>
        <form action={signOutAction}>
          <button className="primary-button login-submit" type="submit">Sign out</button>
        </form>
      </section>
    </main>
  );
}
