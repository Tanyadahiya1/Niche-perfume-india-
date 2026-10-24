import CartView from "@/components/CartView";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Your Cart — Niche Perfume India" };

export default async function CartPage() {
  const s = await getSettings();
  return (
    <div className="wrap">
      <div className="page-head"><h1 className="page-title">Your Cart</h1></div>
      <section className="section" style={{ paddingTop: 36 }}>
        <CartView threshold={Number(s.free_shipping_threshold) || 0} fee={Number(s.shipping_fee) || 0} />
      </section>
    </div>
  );
}
