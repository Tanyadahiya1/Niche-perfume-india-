import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { getAllProducts, getProduct } from "@/lib/data";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  return p ? { title: `${p.brand} ${p.name} — Niche Perfume India`, description: p.description } : {};
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();
  const all = await getAllProducts();
  const related = all.filter((p) => p.id !== product.id && (p.brand === product.brand || p.gender === product.gender)).slice(0, 4);

  return (
    <div className="wrap">
      <p className="muted" style={{ fontSize: 13, paddingTop: 28 }}>
        <Link href="/collection" className="link-u">Collection</Link> / {product.brand} / {product.name}
      </p>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="section-title">You may also like</h2>
          <div className="grid-products mt">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
