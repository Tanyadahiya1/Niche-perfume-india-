import CollectionBrowser from "@/components/CollectionBrowser";
import { getAllProducts, getSettings } from "@/lib/data";

export const metadata = { title: "Collection — Niche Perfume India" };

export default async function CollectionPage({ searchParams }: { searchParams: { q?: string } }) {
  const [products, s] = await Promise.all([getAllProducts(), getSettings()]);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">{s.collection_title}</h1>
        <p className="page-sub">{s.collection_sub}</p>
      </div>
      <section className="section" style={{ paddingTop: 10 }}>
        <CollectionBrowser products={products} initialQ={searchParams.q ?? ""} />
      </section>
    </div>
  );
}
