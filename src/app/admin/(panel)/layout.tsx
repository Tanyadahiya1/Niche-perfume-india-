import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "./actions";

export const metadata = { title: "Admin — Niche Perfume India", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link className="logo" href="/admin">NICHE<span> admin</span></Link>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/inquiries">Enquiries</Link>
          <Link href="/admin/content">Pages &amp; FAQ</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/" target="_blank">View website ↗</Link>
        </nav>
        <p className="muted" style={{ fontSize: 12, margin: "26px 0 10px", wordBreak: "break-all" }}>{email}</p>
        <form action={signOut}><button className="btn btn-outline btn-sm" type="submit">Sign out</button></form>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
