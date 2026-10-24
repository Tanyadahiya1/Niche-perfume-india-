"use client";
import { useMemo, useState } from "react";
import type { ProductWithVariants, VariantType } from "@/lib/types";
import ProductCard from "./ProductCard";

const FORMATS: { key: "all" | VariantType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sample", label: "Samples" },
  { key: "decant", label: "Decants" },
  { key: "partial", label: "Partials" },
  { key: "retail", label: "Retail" },
];

export default function CollectionBrowser({ products, initialQ = "" }: { products: ProductWithVariants[]; initialQ?: string }) {
  const [q, setQ] = useState(initialQ);
  const [brand, setBrand] = useState("all");
  const [gender, setGender] = useState("all");
  const [format, setFormat] = useState<"all" | VariantType>("all");
  const [sort, setSort] = useState("featured");

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = products
      .filter((p) => brand === "all" || p.brand === brand)
      .filter((p) => gender === "all" || p.gender === gender)
      .filter(
        (p) =>
          !term ||
          [p.name, p.brand, p.inspired_by, p.notes.join(" ")].join(" ").toLowerCase().includes(term)
      )
      .map((p) => ({ ...p, variants: format === "all" ? p.variants : p.variants.filter((v) => v.type === format) }))
      .filter((p) => p.variants.length > 0);
    const minPrice = (p: ProductWithVariants) => Math.min(...p.variants.map((v) => v.price));
    if (sort === "low") out = [...out].sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "high") out = [...out].sort((a, b) => minPrice(b) - minPrice(a));
    if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [products, q, brand, gender, format, sort]);

  return (
    <>
      <div className="filters">
        <input className="input" placeholder="Search name, brand or note…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand">
          <option value="all">All brands</option>
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select className="input" value={gender} onChange={(e) => setGender(e.target.value)} aria-label="Gender">
          <option value="all">All genders</option>
          <option>Men</option><option>Women</option><option>Unisex</option>
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      <div className="filters" style={{ marginTop: 14 }}>
        {FORMATS.map((f) => (
          <button key={f.key} className={`pill${format === f.key ? " sel" : ""}`} onClick={() => setFormat(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <p className="muted center" style={{ margin: "26px 0 30px", fontSize: 13 }}>{list.length} fragrance{list.length === 1 ? "" : "s"}</p>
      {list.length === 0 ? (
        <p className="empty">No fragrances match your filters.</p>
      ) : (
        <div className="grid-products">
          {list.map((p) => <ProductCard key={`${p.id}-${format}`} product={p} />)}
        </div>
      )}
    </>
  );
}
