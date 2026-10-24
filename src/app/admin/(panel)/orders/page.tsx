import ConfirmButton from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin";
import { rupees } from "@/lib/format";
import { deleteOrder, updateOrder } from "../actions";

interface Order {
  id: string; order_number: string; status: string; customer_name: string; phone: string; email: string;
  address: string; city: string; state: string; pincode: string; notes: string; payment_method: string;
  subtotal: number; shipping: number; cod_fee: number; total: number; admin_notes: string; created_at: string;
  items: { id: string; product_name: string; brand: string; label: string; qty: number; price: number }[];
}

const wa = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return `https://wa.me/${d.length === 10 ? "91" + d : d}`;
};

export default async function OrdersAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("orders").select("*, items:order_items(*)").order("created_at", { ascending: false }).limit(200);
  const orders = (data ?? []) as Order[];

  return (
    <>
      <h1>Orders ({orders.length})</h1>
      {orders.length === 0 && <p className="muted">No orders yet. They appear here as customers check out.</p>}
      {orders.map((o) => (
        <details key={o.id} className="form-card" style={{ padding: 0 }}>
          <summary style={{ cursor: "pointer", padding: "18px 22px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <span><strong>{o.order_number}</strong> · {o.customer_name}</span>
            <span className="actions-row"><span>{rupees(o.total)}</span><span className={`status ${o.status}`}>{o.status}</span><span className="muted" style={{ fontSize: 12 }}>{new Date(o.created_at).toLocaleString("en-IN")}</span></span>
          </summary>
          <div style={{ padding: "0 22px 22px" }}>
            <div className="two-col" style={{ gap: 24 }}>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                <p style={{ margin: 0 }}><strong>{o.customer_name}</strong><br />
                  <a className="link-u" href={wa(o.phone)} target="_blank" rel="noopener noreferrer">{o.phone} (WhatsApp)</a>{o.email && <><br />{o.email}</>}</p>
                <p>{o.address}<br />{o.city}, {o.state} – {o.pincode}</p>
                {o.notes && <p className="muted">Customer note: {o.notes}</p>}
                <p className="muted">Payment: {o.payment_method === "cod" ? "Cash on delivery" : "UPI via WhatsApp"}</p>
              </div>
              <div>
                <table className="tbl"><tbody>
                  {o.items.map((i) => <tr key={i.id}><td>{i.brand} {i.product_name}<br /><span className="muted" style={{ fontSize: 12 }}>{i.label}</span></td><td>× {i.qty}</td><td>{rupees(i.price * i.qty)}</td></tr>)}
                  <tr><td colSpan={2} className="muted">Shipping</td><td>{o.shipping ? rupees(o.shipping) : "FREE"}</td></tr>
                  {o.cod_fee > 0 && <tr><td colSpan={2} className="muted">COD fee</td><td>{rupees(o.cod_fee)}</td></tr>}
                  <tr><td colSpan={2}><strong>Total</strong></td><td><strong>{rupees(o.total)}</strong></td></tr>
                </tbody></table>
              </div>
            </div>
            <form action={updateOrder} className="actions-row" style={{ marginTop: 18, alignItems: "flex-end" }}>
              <input type="hidden" name="id" value={o.id} />
              <div className="field" style={{ margin: 0 }}><label>Status</label>
                <select className="input" name="status" defaultValue={o.status}>
                  <option value="new">New</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="field" style={{ margin: 0, flex: 1, minWidth: 200 }}><label>Internal note</label><input className="input" name="admin_notes" defaultValue={o.admin_notes} placeholder="Tracking number, etc." /></div>
              <button className="btn btn-primary btn-sm" type="submit">Save</button>
            </form>
            <form action={deleteOrder} style={{ marginTop: 12 }}>
              <input type="hidden" name="id" value={o.id} />
              <ConfirmButton className="link-btn" message="Delete this order permanently? (Stock is NOT restored.)">Delete order</ConfirmButton>
            </form>
          </div>
        </details>
      ))}
    </>
  );
}
