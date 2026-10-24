"use client";
import Link from "next/link";
import { useState } from "react";
import { rupees } from "@/lib/format";
import type { ProductWithVariants } from "@/lib/types";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }: { product: ProductWithVariants }) {
  const { add } = useCart();
  const vs = product.variants;
  const firstLive = vs.find((v) => v.stock > 0) ?? vs[0];
  const [sel, setSel] = useState(firstLive?.id);
  const v = vs.find((x) => x.id === sel) ?? firstLive;
  const allOut = vs.every((x) => x.stock <= 0);

  return (
    <article className="pcard">
      <Link href={`/product/${product.slug}`} className="pcard-img" aria-label={`${product.brand} ${product.name}`}>
        {allOut && <span className="badge out">SOLD OUT</span>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url} alt={`${product.brand} ${product.name}`} loading="lazy" />
      </Link>
      <div className="pcard-body">
        <div className="brand">{product.brand}</div>
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <p className="notes-line">{product.notes.join(" · ")}</p>
        <div className="chips">
          {vs.map((x) => (
            <button
              key={x.id}
              className={`chip${x.id === v?.id ? " sel" : ""}`}
              disabled={x.stock <= 0}
              onClick={() => setSel(x.id)}
              aria-pressed={x.id === v?.id}
              title={x.stock <= 0 ? "Sold out" : undefined}
            >
              {x.size_ml}ML
            </button>
          ))}
        </div>
        <div className="pcard-foot">
          <span className="price">{v ? rupees(v.price) : "—"}</span>
          <button className="add-btn" disabled={!v || v.stock <= 0} onClick={() => v && add(product, v)}>
            ♧ ADD
          </button>
        </div>
      </div>
    </article>
  );
}
