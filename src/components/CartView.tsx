"use client";
import Link from "next/link";
import { rupees } from "@/lib/format";
import { TYPE_LABEL } from "@/lib/types";
import { useCart } from "./CartProvider";

export function shippingFor(subtotal: number, threshold: number, fee: number) {
  return subtotal <= 0 || (threshold > 0 && subtotal >= threshold) ? 0 : fee;
}

export default function CartView({ threshold, fee }: { threshold: number; fee: number }) {
  const { items, subtotal, setQty, remove, ready } = useCart();
  if (!ready) return <p className="empty">Loading your cart…</p>;
  if (items.length === 0)
    return (
      <div className="empty">
        <p>Your cart is empty.</p>
        <Link className="btn btn-primary" href="/collection" style={{ marginTop: 14 }}>Browse the collection →</Link>
      </div>
    );
  const ship = shippingFor(subtotal, threshold, fee);
  const away = threshold - subtotal;

  return (
    <div className="cart-layout">
      <div>
        {items.map((i) => (
          <div className="cart-item" key={i.variantId}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image} alt="" />
            <div>
              <div className="brand">{i.brand}</div>
              <h4><Link href={`/product/${i.slug}`}>{i.name}</Link></h4>
              <div className="muted" style={{ fontSize: 13 }}>{TYPE_LABEL[i.type]} · {i.sizeMl}ml · {rupees(i.price)} each</div>
              <div className="actions-row" style={{ marginTop: 10 }}>
                <div className="qty">
                  <button aria-label="Decrease" onClick={() => setQty(i.variantId, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button aria-label="Increase" onClick={() => setQty(i.variantId, i.qty + 1)}>+</button>
                </div>
                <button className="link-btn" onClick={() => remove(i.variantId)}>Remove</button>
              </div>
            </div>
            <strong>{rupees(i.price * i.qty)}</strong>
          </div>
        ))}
      </div>
      <aside className="summary">
        <h3 className="serif" style={{ margin: "0 0 14px", fontSize: 24 }}>Order summary</h3>
        <div className="line"><span>Subtotal</span><span>{rupees(subtotal)}</span></div>
        <div className="line"><span>Shipping</span><span>{ship === 0 ? "FREE" : rupees(ship)}</span></div>
        {threshold > 0 && away > 0 && <p className="muted" style={{ fontSize: 13 }}>Add {rupees(away)} more for free delivery.</p>}
        <div className="line total"><span>Total</span><span>{rupees(subtotal + ship)}</span></div>
        <Link className="btn btn-primary btn-block" href="/checkout" style={{ marginTop: 18 }}>Checkout →</Link>
        <Link className="btn btn-outline btn-block" href="/collection" style={{ marginTop: 10 }}>Continue shopping</Link>
      </aside>
    </div>
  );
}
