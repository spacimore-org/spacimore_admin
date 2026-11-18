"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Overview", glyph: "O" },
  { href: "/dashboard/users", label: "Users", glyph: "U" },
  { href: "/dashboard/products", label: "Products", glyph: "P" },
  { href: "/dashboard/orders", label: "Orders", glyph: "R" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav" aria-label="Admin navigation">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`sidebar-link${active ? " active" : ""}`}
            href={item.href}
            key={item.href}
          >
            <span className="nav-glyph" aria-hidden="true">{item.glyph}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
