import { signOutAction } from "@/app/actions";
import { SidebarNav } from "@/components/sidebar-nav";

export function AdminShell({
  children,
  email,
}: Readonly<{
  children: React.ReactNode;
  email: string;
}>) {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <a className="sidebar-brand" href="/dashboard">
          <span className="brand-symbol">s</span>
          <span>spacemore<span className="brand-admin"> / admin</span></span>
        </a>
        <p className="sidebar-label">WORKSPACE</p>
        <SidebarNav />
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <span className="user-avatar">{email.slice(0, 1).toUpperCase() || "A"}</span>
            <span className="sidebar-user-copy">
              <strong>Administrator</strong>
              <span>{email}</span>
            </span>
          </div>
          <form action={signOutAction}>
            <button className="signout-button" type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <span className="topbar-label">SPACEMORE MARKETPLACE</span>
          <span className="topbar-status"><i /> Supabase connected</span>
        </header>
        {children}
      </main>
    </div>
  );
}
