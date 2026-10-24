import CheckoutForm from "@/components/CheckoutForm";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Checkout — Niche Perfume India" };

export default async function CheckoutPage() {
  const s = await getSettings();
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Checkout</h1>
        <p className="page-sub">No payment gateway. We confirm your order on WhatsApp and you pay by UPI or Cash on Delivery.</p>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <CheckoutForm
          threshold={Number(s.free_shipping_threshold) || 0}
          fee={Number(s.shipping_fee) || 0}
          codEnabled={s.cod_enabled.toLowerCase().startsWith("y")}
          codFee={Number(s.cod_fee) || 0}
        />
      </section>
    </div>
  );
}
