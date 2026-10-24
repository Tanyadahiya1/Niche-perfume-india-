import Link from "next/link";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin";
import { rupees } from "@/lib/format";
import type { ProductWithVariants } from "@/lib/types";
import { deleteProduct } from "../actions";

export default async function ProductsAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("*, variants:product_variants(*)").order("sort_order");
  const products = (data ?? []) as ProductWithVariants[];

  return (
    <>
      <div className="actions-row" style={{ justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Products ({products.length})</h1>
        <Link className="btn btn-primary btn-sm" href="/admin/products/new">+ New product</Link>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th></th><th>Product</th><th>Sizes</th><th>Stock</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td><img src={p.image_url} alt="" /></td>
                <td><strong>{p.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{p.brand}{p.is_featured ? " · ★ featured" : ""}</span></td>
                <td style={{ fontSize: 12 }}>{[...p.variants].sort((a, b) => a.size_ml - b.size_ml).map((v) => `${v.size_ml}ml ${rupees(v.price)}`).join(" · ") || "—"}</td>
                <td>{p.variants.reduce((n, v) => n + v.stock, 0)}</td>
                <td><span className={`status ${p.is_active ? "done" : "cancelled"}`}>{p.is_active ? "visible" : "hidden"}</span></td>
                <td>
                  <div className="actions-row">
                    <Link className="btn btn-outline btn-sm" href={`/admin/products/${p.id}`}>Edit</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton className="btn btn-danger btn-sm" message={`Delete ${p.name}? This cannot be undone.`}>Delete</ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={6} className="muted">No products yet. Did you run the demo-products SQL (README step 4)?</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
