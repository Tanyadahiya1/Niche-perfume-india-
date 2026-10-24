import { rupees } from "./format";

export const cleanNumber = (n: string) => (n || "").replace(/\D/g, "");

export function waLink(number: string, text: string) {
  return `https://wa.me/${cleanNumber(number)}?text=${encodeURIComponent(text)}`;
}

export interface OrderSummary {
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: { name: string; brand: string; label: string; qty: number; price: number }[];
}

export function orderMessage(o: OrderSummary) {
  const items = o.items
    .map((i, k) => `${k + 1}. ${i.brand} ${i.name} (${i.label}) x${i.qty} = ${rupees(i.price * i.qty)}`)
    .join("\n");
  return [
    `Hello! I'd like to place an order. 🛍️`,
    ``,
    `*Order:* ${o.order_number}`,
    items,
    ``,
    `Subtotal: ${rupees(o.subtotal)}`,
    `Shipping: ${o.shipping === 0 ? "FREE" : rupees(o.shipping)}`,
    o.total - o.subtotal - o.shipping > 0 ? `COD fee: ${rupees(o.total - o.subtotal - o.shipping)}` : null,
    `*Total: ${rupees(o.total)}*`,
    `Payment: ${o.payment_method === "cod" ? "Cash on Delivery" : "Pay via UPI / WhatsApp"}`,
    ``,
    `*Name:* ${o.customer_name}`,
    `*Phone:* ${o.phone}`,
    `*Address:* ${o.address}, ${o.city}, ${o.state} - ${o.pincode}`,
    o.notes ? `*Notes:* ${o.notes}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
