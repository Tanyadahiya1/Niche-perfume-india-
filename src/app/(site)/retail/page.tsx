import ProductCard from "@/components/ProductCard";
import { getProductsByType, getSettings } from "@/lib/data";

export const metadata = { title: "Retail Packs — Niche Perfume India" };

export default async function Page() {
  const [products, s] = await Promise.all([getProductsByType("retail"), getSettings()]);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">{s.retail_title}</h1>
        <p className="page-sub">{s.retail_sub}</p>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        {products.length === 0 ? (
          <p className="empty">Nothing here yet — check back soon.</p>
        ) : (
          <div className="grid-products">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
