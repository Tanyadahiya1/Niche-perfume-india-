"use client";
import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { saveProduct, type ProductFormState } from "@/app/admin/(panel)/actions";
import type { ProductWithVariants, VariantType } from "@/lib/types";

type Row = { id?: string; type: VariantType; size_ml: number; price: number; stock: number; is_active: boolean };

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Saving…" : "Save product"}</button>;
}

export default function ProductForm({ product }: { product: ProductWithVariants | null }) {
  const [state, action] = useFormState<ProductFormState, FormData>(saveProduct, {});
  const [rows, setRows] = useState<Row[]>(
    product?.variants.map((v) => ({ id: v.id, type: v.type, size_ml: v.size_ml, price: v.price, stock: v.stock, is_active: v.is_active })) ?? [
      { type: "sample", size_ml: 2, price: 0, stock: 10, is_active: true },
      { type: "decant", size_ml: 5, price: 0, stock: 10, is_active: true },
      { type: "decant", size_ml: 10, price: 0, stock: 10, is_active: true },
    ]
  );
  const [img, setImg] = useState(product?.image_url ?? "/images/bottle-generic.svg");
  const [uploading, setUploading] = useState(false);
  const [upErr, setUpErr] = useState("");

  const patch = (i: number, p: Partial<Row>) => setRows((r) => r.map((x, k) => (k === i ? { ...x, ...p } : x)));

  async function upload(file: File) {
    setUploading(true);
    setUpErr("");
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const sb = createBrowserSupabase();
      const { error } = await sb.storage.from("product-images").upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) throw error;
      setImg(sb.storage.from("product-images").getPublicUrl(path).data.publicUrl);
    } catch (e) {
      setUpErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" defaultValue={product?.id ?? ""} />
      <input type="hidden" name="variants" value={JSON.stringify(rows)} readOnly />
      <input type="hidden" name="image_url" value={img} readOnly />

      <div className="form-card">
        <h3>Details</h3>
        <div className="row2">
          <div className="field"><label htmlFor="name">Name</label><input className="input" id="name" name="name" defaultValue={product?.name} required /></div>
          <div className="field"><label htmlFor="brand">Brand</label><input className="input" id="brand" name="brand" defaultValue={product?.brand} required /></div>
        </div>
        <div className="row2">
          <div className="field"><label htmlFor="slug">URL slug</label><input className="input" id="slug" name="slug" defaultValue={product?.slug} placeholder="auto-generated if empty" /></div>
          <div className="field"><label htmlFor="gender">Gender</label>
            <select className="input" id="gender" name="gender" defaultValue={product?.gender ?? "Unisex"}><option>Men</option><option>Women</option><option>Unisex</option></select>
          </div>
        </div>
        <div className="field"><label htmlFor="inspired_by">Inspired by (optional)</label><input className="input" id="inspired_by" name="inspired_by" defaultValue={product?.inspired_by} placeholder="Giorgio Armani Power of You" /></div>
        <div className="field"><label htmlFor="notes">Notes</label><input className="input" id="notes" name="notes" defaultValue={product?.notes.join(", ")} placeholder="Pineapple, Birch, Musk" /><small>Comma separated.</small></div>
        <div className="field"><label htmlFor="description">Description</label><textarea className="input" id="description" name="description" defaultValue={product?.description} /></div>
        <div className="row2">
          <div className="field"><label htmlFor="sort_order">Sort order</label><input className="input" id="sort_order" name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} /><small>Lower numbers appear first.</small></div>
          <div className="field">
            <label>Visibility</label>
            <label style={{ textTransform: "none", letterSpacing: 0, fontSize: 14, color: "var(--fg)", display: "flex", gap: 8 }}><input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} /> Visible on website</label>
            <label style={{ textTransform: "none", letterSpacing: 0, fontSize: 14, color: "var(--fg)", display: "flex", gap: 8 }}><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} /> Featured on home page</label>
          </div>
        </div>
      </div>

      <div className="form-card">
        <h3>Image</h3>
        <div className="actions-row" style={{ alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" style={{ width: 120, height: 120, objectFit: "contain", border: "1px solid var(--line)", borderRadius: 14, background: "var(--panel)" }} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="field"><label htmlFor="imgurl">Image URL</label><input className="input" id="imgurl" value={img} onChange={(e) => setImg(e.target.value)} /></div>
            <div className="field"><label htmlFor="file">…or upload (transparent PNG/WebP looks best)</label>
              <input className="input" id="file" type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              {uploading && <small>Uploading…</small>}{upErr && <small style={{ color: "#e0786f" }}>{upErr}</small>}
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <h3>Sizes &amp; prices</h3>
        {rows.map((r, i) => (
          <div className="var-row" key={r.id ?? `n${i}`}>
            <select className="input" value={r.type} onChange={(e) => patch(i, { type: e.target.value as VariantType })} aria-label="Type">
              <option value="sample">Sample</option><option value="decant">Decant</option><option value="partial">Partial</option><option value="retail">Retail pack</option>
            </select>
            <input className="input" type="number" min={1} value={r.size_ml} onChange={(e) => patch(i, { size_ml: Number(e.target.value) })} aria-label="Size in ml" title="Size (ml)" />
            <input className="input" type="number" min={0} value={r.price} onChange={(e) => patch(i, { price: Number(e.target.value) })} aria-label="Price" title="Price (₹)" />
            <input className="input" type="number" min={0} value={r.stock} onChange={(e) => patch(i, { stock: Number(e.target.value) })} aria-label="Stock" title="Stock" />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setRows((x) => x.filter((_, k) => k !== i))}>Remove</button>
          </div>
        ))}
        <p className="muted" style={{ fontSize: 12 }}>Columns: type · size (ml) · price (₹) · stock. Stock 0 shows “Sold out”.</p>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setRows((x) => [...x, { type: "decant", size_ml: 5, price: 0, stock: 10, is_active: true }])}>+ Add size</button>
      </div>

      {state.error && <div className="alert err" role="alert" style={{ marginBottom: 16 }}>{state.error}</div>}
      <div className="actions-row"><Submit /><a className="btn btn-outline" href="/admin/products">Cancel</a></div>
    </form>
  );
}
