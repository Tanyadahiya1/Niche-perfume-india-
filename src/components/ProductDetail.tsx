"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { rupees } from "@/lib/format";
import { TYPE_LABEL, type ProductWithVariants, type VariantType } from "@/lib/types";
import { useCart } from "./CartProvider";

const ORDER: VariantType[] = ["sample", "decant", "partial", "retail"];

function tileImage(type: VariantType, ml: number, productImage: string) {
  if (type === "sample") return "/images/vial-sample.svg";
  if (type === "decant") return ml >= 10 ? "/images/vial-10.svg" : "/images/vial-5.svg";
  return productImage;
}

export default function ProductDetail({ product }: { product: ProductWithVariants }) {
  const { add } = useCart();
  const router = useRouter();
  const vs = [...product.variants].sort(
    (a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type) || a.size_ml - b.size_ml
  );
  const start = vs.find((v) => v.type === "decant" && v.stock > 0) ?? vs.find((v) => v.stock > 0) ?? vs[0];
  const [sel, setSel] = useState(start?.id);
  const v = vs.find((x) => x.id === sel) ?? start;
  const out = !v || v.stock <= 0;

  return (
    <div className="pd">
      <div className="pd-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url} alt={`${product.brand} ${product.name}`} />
      </div>
      <div>
        <div className="brand">{product.brand}</div>
        <h1 className="pd-title">{product.name}</h1>

        <div className="tiles" role="radiogroup" aria-label="Choose size">
          {vs.map((x) => (
            <button
              key={x.id}
              role="radio"
              aria-checked={x.id === v?.id}
              className={`tile${x.id === v?.id ? " sel" : ""}${x.stock <= 0 ? " out" : ""}`}
              onClick={() => setSel(x.id)}
            >
              <small>{TYPE_LABEL[x.type]}</small>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tileImage(x.type, x.size_ml, product.image_url)} alt="" />
              <strong>{x.size_ml}ml</strong>
              {x.stock <= 0 && <span className="soldout">SOLD OUT</span>}
            </button>
          ))}
        </div>

        <div className="pd-price">{v ? rupees(v.price) : "—"}</div>
        {v && v.stock > 0 && v.stock <= 5 && <p className="stock-note">Only {v.stock} left</p>}

        <div className="pd-actions">
          <button className="btn btn-solid" disabled={out} onClick={() => v && add(product, v)}>
            Add to Cart ♧
          </button>
          <button
            className="btn btn-outline"
            disabled={out}
            onClick={() => {
              if (v) {
                add(product, v);
                router.push("/checkout");
              }
            }}
          >
            Buy Now ⚡
          </button>
        </div>

        {product.inspired_by && (
          <div className="infobox">
            <div className="lbl">Inspired by</div>
            <div className="big">{product.inspired_by}</div>
          </div>
        )}

        <div className="infobox">
          <div className="lbl">Notes</div>
          <div className="note-chips">
            {product.notes.map((n) => <span className="note-chip" key={n}>{n}</span>)}
          </div>
        </div>

        <div className="infobox">
          <div className="lbl">About this fragrance</div>
          <p className="muted" style={{ lineHeight: 1.8, margin: "12px 0 0" }}>{product.description}</p>
          <p className="muted" style={{ fontSize: 13, margin: "12px 0 0" }}>{product.gender} · 100% authentic · Ships in 1–2 days</p>
        </div>
      </div>
    </div>
  );
}
