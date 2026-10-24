import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { rupees } from "@/lib/format";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [products, variants, orders, newOrders, sell, msgs, recent, low] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("product_variants").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total,status"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("sell_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("orders").select("id,order_number,customer_name,total,status,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("product_variants").select("id,type,size_ml,stock,product:products(name,brand)").lte("stock", 2).eq("is_active", true).limit(10),
  ]);
  const revenue = (orders.data ?? []).filter((o: { status: string }) => o.status !== "cancelled").reduce((n: number, o: { total: number }) => n + o.total, 0);

  return (
    <>
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card"><small>Products</small><strong>{products.count ?? 0}</strong></div>
        <div className="stat-card"><small>Variants</small><strong>{variants.count ?? 0}</strong></div>
        <div className="stat-card"><small>New orders</small><strong>{newOrders.count ?? 0}</strong></div>
        <div className="stat-card"><small>Revenue (excl. cancelled)</small><strong>{rupees(revenue)}</strong></div>
        <div className="stat-card"><small>New sell requests</small><strong>{sell.count ?? 0}</strong></div>
        <div className="stat-card"><small>New messages</small><strong>{msgs.count ?? 0}</strong></div>
      </div>

      <h2 style={{ fontSize: 18 }}>Recent orders</h2>
      <div className="tbl-wrap" style={{ marginBottom: 30 }}>
        <table className="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {(recent.data ?? []).map((o: { id: string; order_number: string; customer_name: string; total: number; status: string; created_at: string }) => (
              <tr key={o.id}><td><Link className="link-u" href="/admin/orders">{o.order_number}</Link></td><td>{o.customer_name}</td><td>{rupees(o.total)}</td><td><span className={`status ${o.status}`}>{o.status}</span></td><td>{new Date(o.created_at).toLocaleDateString("en-IN")}</td></tr>
            ))}
            {(recent.data ?? []).length === 0 && <tr><td colSpan={5} className="muted">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 18 }}>Low or out of stock</h2>
      <div className="tbl-wrap">
        <table className="tbl"><thead><tr><th>Product</th><th>Variant</th><th>Stock</th></tr></thead>
          <tbody>
            {(low.data ?? []).map((v: any) => (
              <tr key={v.id}><td>{v.product?.brand} {v.product?.name}</td><td>{v.type} {v.size_ml}ml</td><td>{v.stock}</td></tr>
            ))}
            {(low.data ?? []).length === 0 && <tr><td colSpan={3} className="muted">Everything is well stocked.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
