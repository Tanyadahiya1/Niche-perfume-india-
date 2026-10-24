"use client";
import Link from "next/link";
import { useState } from "react";
import { rupees } from "@/lib/format";
import { TYPE_LABEL } from "@/lib/types";
import { useCart } from "./CartProvider";
import { shippingFor } from "./CartView";

interface Props { threshold: number; fee: number; codEnabled: boolean; codFee: number }
interface Done { order_number: string; total: number; whatsappUrl: string; persisted: boolean }

export default function CheckoutForm({ threshold, fee, codEnabled, codFee }: Props) {
  const { items, subtotal, clear, ready } = useCart();
  const [pay, setPay] = useState<"cod" | "upi">(codEnabled ? "cod" : "upi");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  const ship = shippingFor(subtotal, threshold, fee);
  const cod = pay === "cod" ? codFee : 0;
  const total = subtotal + ship + cod;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const f = new FormData(e.currentTarget);
    const body = {
      customer_name: f.get("name"),
      phone: f.get("phone"),
      email: f.get("email"),
      address: f.get("address"),
      city: f.get("city"),
      state: f.get("state"),
      pincode: f.get("pincode"),
      notes: f.get("notes"),
      website: f.get("website"), // honeypot
      payment_method: pay,
      items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
    };
    setBusy(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(data);
      clear();
      window.open(data.whatsappUrl, "_blank", "noopener");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="panel center" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="why-ic" aria-hidden="true">✓</div>
        <h3 className="serif" style={{ fontSize: 30 }}>Order {done.order_number} received</h3>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          Total {rupees(done.total)}. One last step: send your order to us on WhatsApp so we can confirm availability and payment.
          {!done.persisted && " (Demo mode: the order was not saved to a database.)"}
        </p>
        <a className="btn btn-primary btn-block" href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 10 }}>
          Send order on WhatsApp
        </a>
        <Link className="btn btn-outline btn-block" href="/collection" style={{ marginTop: 10 }}>Continue shopping</Link>
      </div>
    );

  if (!ready) return <p className="empty">Loading…</p>;
  if (items.length === 0)
    return (
      <div className="empty">
        <p>Your cart is empty.</p>
        <Link className="btn btn-primary" href="/collection">Browse the collection →</Link>
      </div>
    );

  return (
    <form className="cart-layout" onSubmit={submit}>
      <div className="panel">
        <h3>Delivery details</h3>
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="row2">
          <div className="field"><label htmlFor="name">Full name</label><input className="input" id="name" name="name" required minLength={2} autoComplete="name" /></div>
          <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input className="input" id="phone" name="phone" required inputMode="tel" placeholder="10-digit mobile" autoComplete="tel" /></div>
        </div>
        <div className="field"><label htmlFor="email">Email (optional)</label><input className="input" id="email" name="email" type="email" autoComplete="email" /></div>
        <div className="field"><label htmlFor="address">Address</label><textarea className="input" id="address" name="address" required minLength={8} style={{ minHeight: 80 }} autoComplete="street-address" /></div>
        <div className="row2">
          <div className="field"><label htmlFor="city">City</label><input className="input" id="city" name="city" required autoComplete="address-level2" /></div>
          <div className="field"><label htmlFor="state">State</label><input className="input" id="state" name="state" required autoComplete="address-level1" /></div>
        </div>
        <div className="field"><label htmlFor="pincode">PIN code</label><input className="input" id="pincode" name="pincode" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" /></div>
        <div className="field"><label htmlFor="notes">Order notes (optional)</label><textarea className="input" id="notes" name="notes" style={{ minHeight: 70 }} /></div>

        <h3 style={{ marginTop: 24 }}>Payment</h3>
        <div className="chips">
          {codEnabled && (
            <button type="button" className={`chip${pay === "cod" ? " sel" : ""}`} onClick={() => setPay("cod")}>CASH ON DELIVERY</button>
          )}
          <button type="button" className={`chip${pay === "upi" ? " sel" : ""}`} onClick={() => setPay("upi")}>UPI VIA WHATSAPP</button>
        </div>
        {err && <div className="alert err" style={{ marginTop: 18 }} role="alert">{err}</div>}
      </div>

      <aside className="summary">
        <h3 className="serif" style={{ margin: "0 0 14px", fontSize: 24 }}>Your order</h3>
        {items.map((i) => (
          <div className="line" key={i.variantId}>
            <span>{i.name} · {TYPE_LABEL[i.type]} {i.sizeMl}ml × {i.qty}</span>
            <span>{rupees(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="line" style={{ marginTop: 8 }}><span>Subtotal</span><span>{rupees(subtotal)}</span></div>
        <div className="line"><span>Shipping</span><span>{ship === 0 ? "FREE" : rupees(ship)}</span></div>
        {cod > 0 && <div className="line"><span>COD fee</span><span>{rupees(cod)}</span></div>}
        <div className="line total"><span>Total</span><span>{rupees(total)}</span></div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy} style={{ marginTop: 18 }}>
          {busy ? "Placing order…" : "Place order & open WhatsApp"}
        </button>
        <p className="muted" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
          Final prices and availability are confirmed by us on WhatsApp before dispatch.
        </p>
      </aside>
    </form>
  );
}
