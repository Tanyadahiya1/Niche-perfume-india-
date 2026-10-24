"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { DEFAULT_FAQS, DEFAULT_PAGES, DEFAULT_SETTINGS, SETTINGS_SCHEMA } from "@/lib/defaults";
import { slugify } from "@/lib/format";

const refresh = () => revalidatePath("/", "layout");
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const int = (v: unknown, d = 0) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? n : d;
};

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------------- Products ---------------- */
export interface ProductFormState { error?: string }

export async function saveProduct(_prev: ProductFormState, f: FormData): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();
  const id = str(f, "id");
  const name = str(f, "name");
  const brand = str(f, "brand");
  if (!name || !brand) return { error: "Name and brand are required." };
  const slug = slugify(str(f, "slug") || `${brand} ${name}`);
  if (!slug) return { error: "Could not create a URL slug from the name." };

  let variants: { id?: string; type: string; size_ml: number; price: number; stock: number; is_active: boolean }[] = [];
  try {
    variants = JSON.parse(str(f, "variants") || "[]");
  } catch {
    return { error: "Variants data was invalid." };
  }
  const seen = new Set<string>();
  for (const v of variants) {
    if (!["sample", "decant", "partial", "retail"].includes(v.type)) return { error: "Invalid variant type." };
    if (int(v.size_ml) <= 0) return { error: "Every size must be greater than 0 ml." };
    if (int(v.price) < 0 || int(v.stock) < 0) return { error: "Price and stock cannot be negative." };
    const key = `${v.type}-${int(v.size_ml)}`;
    if (seen.has(key)) return { error: `Duplicate variant: ${v.type} ${v.size_ml}ml.` };
    seen.add(key);
  }

  const row = {
    slug,
    name,
    brand,
    inspired_by: str(f, "inspired_by"),
    gender: ["Men", "Women", "Unisex"].includes(str(f, "gender")) ? str(f, "gender") : "Unisex",
    description: str(f, "description"),
    notes: str(f, "notes").split(",").map((n) => n.trim()).filter(Boolean),
    image_url: str(f, "image_url") || "/images/bottle-generic.svg",
    is_featured: f.get("is_featured") === "on",
    is_active: f.get("is_active") === "on",
    sort_order: int(f.get("sort_order")),
  };

  let productId = id;
  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) return { error: error.message.includes("duplicate") ? "Another product already uses this URL slug." : error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error || !data) return { error: error?.message.includes("duplicate") ? "Another product already uses this URL slug." : error?.message ?? "Could not create product." };
    productId = data.id;
  }

  // remove variants that were deleted in the form
  const keepIds = variants.map((v) => v.id).filter(Boolean) as string[];
  const { data: existing } = await supabase.from("product_variants").select("id").eq("product_id", productId);
  const toDelete = (existing ?? []).map((e: { id: string }) => e.id).filter((x: string) => !keepIds.includes(x));
  if (toDelete.length) await supabase.from("product_variants").delete().in("id", toDelete);

  for (const v of variants) {
    const vr = { product_id: productId, type: v.type, size_ml: int(v.size_ml), price: int(v.price), stock: int(v.stock), is_active: v.is_active !== false };
    const { error } = v.id
      ? await supabase.from("product_variants").update(vr).eq("id", v.id)
      : await supabase.from("product_variants").insert(vr);
    if (error) return { error: `Variant error: ${error.message}` };
  }

  refresh();
  redirect("/admin/products");
  return {};
}

export async function deleteProduct(f: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").delete().eq("id", str(f, "id"));
  refresh();
  redirect("/admin/products");
}

/* ---------------- Orders & inbox ---------------- */
export async function updateOrder(f: FormData) {
  const { supabase } = await requireAdmin();
  const status = str(f, "status");
  if (!["new", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) return;
  await supabase.from("orders").update({ status, admin_notes: str(f, "admin_notes") }).eq("id", str(f, "id"));
  revalidatePath("/admin", "layout");
}

export async function deleteOrder(f: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("orders").delete().eq("id", str(f, "id"));
  revalidatePath("/admin", "layout");
}

export async function updateInquiry(f: FormData) {
  const { supabase } = await requireAdmin();
  const table = str(f, "table") === "sell_requests" ? "sell_requests" : "contact_messages";
  if (str(f, "intent") === "delete") await supabase.from(table).delete().eq("id", str(f, "id"));
  else await supabase.from(table).update({ status: str(f, "status") }).eq("id", str(f, "id"));
  revalidatePath("/admin", "layout");
}

/* ---------------- Settings & content ---------------- */
export async function saveSettings(f: FormData) {
  const { supabase } = await requireAdmin();
  const rows: { key: string; value: string }[] = [];
  SETTINGS_SCHEMA.forEach((g) =>
    g.fields.forEach((fl) => {
      const v = f.get(fl.key);
      if (v !== null) rows.push({ key: fl.key, value: String(v).replace(/\r\n/g, "\n") });
    })
  );
  await supabase.from("settings").upsert(rows, { onConflict: "key" });
  refresh();
  redirect("/admin/settings?saved=1");
}

export async function saveFaqs(f: FormData) {
  const { supabase } = await requireAdmin();
  let items: { question: string; answer: string }[] = [];
  try {
    items = JSON.parse(str(f, "faqs") || "[]");
  } catch {
    return;
  }
  items = items.filter((i) => i.question?.trim() && i.answer?.trim());
  await supabase.from("faqs").delete().not("id", "is", null);
  if (items.length)
    await supabase.from("faqs").insert(items.map((i, n) => ({ question: i.question.trim(), answer: i.answer.trim(), sort_order: n + 1 })));
  refresh();
  redirect("/admin/content?saved=faq");
}

export async function savePage(f: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("content_pages").upsert({ slug: str(f, "slug"), title: str(f, "title"), body: String(f.get("body") ?? "").replace(/\r\n/g, "\n") }, { onConflict: "slug" });
  refresh();
  redirect(`/admin/content?saved=${str(f, "slug")}`);
}

/** One-click: copy the built-in default text into the database so everything is editable. */
export async function importDefaults() {
  const { supabase } = await requireAdmin();
  await supabase.from("settings").upsert(Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })), { onConflict: "key", ignoreDuplicates: true });
  await supabase.from("content_pages").upsert(DEFAULT_PAGES, { onConflict: "slug", ignoreDuplicates: true });
  const { count } = await supabase.from("faqs").select("id", { count: "exact", head: true });
  if (!count) await supabase.from("faqs").insert(DEFAULT_FAQS.map(({ question, answer, sort_order }) => ({ question, answer, sort_order })));
  refresh();
  redirect("/admin/content?saved=defaults");
}
