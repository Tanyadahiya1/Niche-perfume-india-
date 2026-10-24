import ConfirmButton from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin";
import { updateInquiry } from "../actions";

interface Sell { id: string; status: string; name: string; phone: string; email: string; brand: string; fragrance: string; size_ml: number; fill_level: string; batch_code: string; expected_price: string; details: string; created_at: string }
interface Msg { id: string; status: string; name: string; phone: string; email: string; subject: string; message: string; created_at: string }

function Actions({ table, id, status, options }: { table: string; id: string; status: string; options: string[] }) {
  return (
    <div className="actions-row" style={{ marginTop: 10 }}>
      <form action={updateInquiry} className="actions-row">
        <input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} />
        <select className="input" name="status" defaultValue={status} style={{ width: "auto" }}>{options.map((o) => <option key={o}>{o}</option>)}</select>
        <button className="btn btn-outline btn-sm" type="submit">Update</button>
      </form>
      <form action={updateInquiry}>
        <input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><input type="hidden" name="intent" value="delete" />
        <ConfirmButton className="link-btn" message="Delete this entry?">Delete</ConfirmButton>
      </form>
    </div>
  );
}

export default async function Inquiries() {
  const { supabase } = await requireAdmin();
  const [sell, msgs] = await Promise.all([
    supabase.from("sell_requests").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100),
  ]);
  const sells = (sell.data ?? []) as Sell[];
  const messages = (msgs.data ?? []) as Msg[];
  return (
    <>
      <h1>Enquiries</h1>
      <h2 style={{ fontSize: 18 }}>Sell-your-perfume requests ({sells.length})</h2>
      {sells.length === 0 && <p className="muted">None yet.</p>}
      {sells.map((s) => (
        <div className="form-card" key={s.id}>
          <div className="actions-row" style={{ justifyContent: "space-between" }}>
            <strong>{s.brand} {s.fragrance} {s.size_ml ? `${s.size_ml}ml` : ""}</strong><span className={`status ${s.status === "new" ? "new" : "done"}`}>{s.status}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: "10px 0 0" }}>
            {s.name} · {s.phone}{s.email ? ` · ${s.email}` : ""}<br />
            Condition: {s.fill_level || "-"} · Batch: {s.batch_code || "-"} · Expecting: {s.expected_price || "-"}<br />
            {s.details && <span className="muted">{s.details}</span>}<br />
            <span className="muted" style={{ fontSize: 12 }}>{new Date(s.created_at).toLocaleString("en-IN")}</span>
          </p>
          <Actions table="sell_requests" id={s.id} status={s.status} options={["new", "contacted", "done"]} />
        </div>
      ))}
      <h2 style={{ fontSize: 18, marginTop: 36 }}>Contact messages ({messages.length})</h2>
      {messages.length === 0 && <p className="muted">None yet.</p>}
      {messages.map((m) => (
        <div className="form-card" key={m.id}>
          <div className="actions-row" style={{ justifyContent: "space-between" }}>
            <strong>{m.subject || "(no subject)"}</strong><span className={`status ${m.status === "new" ? "new" : "done"}`}>{m.status}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: "10px 0 0" }}>
            {m.message}<br />
            <span className="muted">{m.name} · {m.phone}{m.email ? ` · ${m.email}` : ""} · {new Date(m.created_at).toLocaleString("en-IN")}</span>
          </p>
          <Actions table="contact_messages" id={m.id} status={m.status} options={["new", "done"]} />
        </div>
      ))}
    </>
  );
}
