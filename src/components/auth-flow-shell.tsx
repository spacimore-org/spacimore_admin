import Link from "next/link";

export function AuthFlowShell({
  children,
  description,
  footer,
  title,
}: Readonly<{
  children: React.ReactNode;
  description: string;
  footer?: React.ReactNode;
  title: string;
}>) {
  return (
    <main className="login-page login-page--split">
      <section className="login-card">
        <Link className="login-brand" href="/login" aria-label="Spacemore Admin sign in">
          <span className="brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 19v-7m0 2c-4.5 0-6-2.5-6-5 3.5 0 6 1.5 6 5Zm0-3c0-3.5 2-5.5 5.5-5.5 0 3.5-1.5 5.5-5.5 5.5Z" />
            </svg>
          </span>
          <span>SpaciMore<span className="brand-admin"> / Control Center</span></span>
        </Link>
        <div className="login-content auth-flow-content">
          <p className="eyebrow">ACCOUNT SECURITY</p>
          <h1>{title}</h1>
          <p className="login-copy">{description}</p>
          {children}
          {footer}
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
