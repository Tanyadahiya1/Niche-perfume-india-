import { NextResponse } from "next/server";
import seed from "@/data/seed.json";
import { getSettings } from "@/lib/data";
import { hasServiceRole } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";
import { TYPE_LABEL } from "@/lib/types";
import { orderMessage, waLink, type OrderSummary } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const s = (v: unknown, max = 300) => String(v ?? "").trim().slice(0, max);
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return fail("Invalid request.");
  }
  if (s(b.website)) return NextResponse.json({ ok: true }); // honeypot: pretend success to bots

  const customer = {
    customer_name: s(b.customer_name, 100),
    phone: s(b.phone, 20).replace(/[^\d+]/g, ""),
    email: s(b.email, 150),
    address: s(b.address, 400),
    city: s(b.city, 80),
    state: s(b.state, 80),
    pincode: s(b.pincode, 6),
    notes: s(b.notes, 500),
    payment_method: b.payment_method === "upi" ? "upi" : "cod",
  };
  if (customer.customer_name.length < 2) return fail("Please enter your name.");
  if (customer.phone.replace(/\D/g, "").length < 10) return fail("Please enter a valid phone number.");
  if (customer.address.length < 8 || !customer.city || !customer.state) return fail("Please enter your full address.");
  if (!/^\d{6}$/.test(customer.pincode)) return fail("PIN code must be 6 digits.");

  const rawItems = Array.isArray(b.items) ? b.items : [];
  const items = rawItems
    .slice(0, 30)
    .map((i: { variantId?: unknown; qty?: unknown }) => ({
      variantId: s(i.variantId, 80),
      qty: Math.max(1, Math.min(20, Math.floor(Number(i.qty) || 1))),
    }))
    .filter((i) => i.variantId);
  if (items.length === 0) return fail("Your cart is empty.");

  const settings = await getSettings();
  const threshold = Number(settings.free_shipping_threshold) || 0;
  const fee = Number(settings.shipping_fee) || 0;
  const codFee = customer.payment_method === "cod" ? Number(settings.cod_fee) || 0 : 0;

  let summary: OrderSummary;
  let persisted = false;

  if (hasServiceRole()) {
    // Atomic: validates stock, uses DATABASE prices (never trusts the browser), decrements stock.
    const { data, error } = await createServiceClient().rpc("create_order", {
      p_customer: customer,
      p_items: items.map((i) => ({ variant_id: i.variantId, qty: i.qty })),
      p_free_threshold: threshold,
      p_shipping_fee: fee,
      p_cod_fee: codFee,
    });
    if (error) {
      const m = error.message || "";
      if (m.includes("OUT_OF_STOCK")) return fail("Sorry, one of the items just went out of stock or has fewer units left. Please update your cart.", 409);
      if (m.includes("NOT_FOUND")) return fail("One of the items in your cart is no longer available. Please remove it and try again.", 409);
      console.error("create_order failed:", error);
      return fail("We couldn't save your order. Please try again or message us on WhatsApp.", 500);
    }
    summary = { ...(data as OrderSummary), notes: customer.notes };
    persisted = true;
  } else {
    // Demo mode (no database): price from built-in demo data so the WhatsApp flow still works.
    const vmap = new Map((seed.variants as { id: string; product_id: string; type: string; size_ml: number; price: number }[]).map((v) => [v.id, v]));
    const pmap = new Map((seed.products as { id: string; name: string; brand: string }[]).map((p) => [p.id, p]));
    const lines = [];
    for (const i of items) {
      const v = vmap.get(i.variantId);
      const p = v && pmap.get(v.product_id);
      if (!v || !p) return fail("One of the items in your cart is no longer available. Please remove it and try again.", 409);
      lines.push({ name: p.name, brand: p.brand, label: `${TYPE_LABEL[v.type as keyof typeof TYPE_LABEL]} ${v.size_ml}ml`, qty: i.qty, price: v.price });
    }
    const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
    const shipping = threshold > 0 && subtotal >= threshold ? 0 : fee;
    summary = {
      order_number: "NPI-DEMO-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      ...customer,
      subtotal,
      shipping,
      total: subtotal + shipping + codFee,
      items: lines,
    };
  }

  return NextResponse.json({
    ok: true,
    persisted,
    order_number: summary.order_number,
    total: summary.total,
    whatsappUrl: waLink(settings.whatsapp_number, orderMessage(summary)),
  });
}
