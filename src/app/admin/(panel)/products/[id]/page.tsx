import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import type { ProductWithVariants } from "@/lib/types";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const { supabase } = await requireAdmin();
  let product: ProductWithVariants | null = null;
  if (params.id !== "new") {
    const { data } = await supabase.from("products").select("*, variants:product_variants(*)").eq("id", params.id).maybeSingle();
    if (!data) return notFound();
    product = { ...(data as ProductWithVariants), notes: (data as ProductWithVariants).notes ?? [] };
  }
  return (
    <>
      <h1>{product ? `Edit: ${product.name}` : "New product"}</h1>
      <ProductForm product={product} />
    </>
  );
}
