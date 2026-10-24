import "server-only";
import seed from "@/data/seed.json";
import { DEFAULT_FAQS, DEFAULT_PAGES, DEFAULT_SETTINGS } from "./defaults";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { ContentPage, Faq, Product, ProductWithVariants, Settings, Variant, VariantType } from "./types";

/** True when the site is reading from the Supabase database (otherwise it shows built-in demo data). */
export const usingDatabase = () => isSupabaseConfigured();

function seedProducts(): ProductWithVariants[] {
  const vs = seed.variants as Variant[];
  return (seed.products as unknown as Product[]).map((p) => ({
    ...p,
    variants: vs.filter((v) => v.product_id === p.id),
  }));
}

function tidy(list: ProductWithVariants[]): ProductWithVariants[] {
  return list
    .filter((p) => p.is_active)
    .map((p) => ({
      ...p,
      notes: p.notes ?? [],
      variants: (p.variants ?? [])
        .filter((v) => v.is_active)
        .sort((a, b) => a.size_ml - b.size_ml),
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllProducts(): Promise<ProductWithVariants[]> {
  if (!isSupabaseConfigured()) return tidy(seedProducts());
  try {
    const { data, error } = await createPublicClient()
      .from("products")
      .select("*, variants:product_variants(*)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return tidy((data ?? []) as ProductWithVariants[]);
  } catch (e) {
    console.error("getAllProducts failed, using demo data:", e);
    return tidy(seedProducts());
  }
}

/** Products that have at least one variant of the given type; variants limited to that type. */
export async function getProductsByType(type: VariantType): Promise<ProductWithVariants[]> {
  const all = await getAllProducts();
  return all
    .map((p) => ({ ...p, variants: p.variants.filter((v) => v.type === type) }))
    .filter((p) => p.variants.length > 0);
}

export async function getProduct(slug: string): Promise<ProductWithVariants | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) return { ...DEFAULT_SETTINGS };
  try {
    const { data, error } = await createPublicClient().from("settings").select("key,value");
    if (error) throw error;
    const out: Settings = { ...DEFAULT_SETTINGS };
    (data ?? []).forEach((r: { key: string; value: string }) => {
      if (r.value !== null && r.value !== undefined) out[r.key] = r.value;
    });
    return out;
  } catch (e) {
    console.error("getSettings failed:", e);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured()) return DEFAULT_FAQS;
  try {
    const { data, error } = await createPublicClient().from("faqs").select("*").order("sort_order");
    if (error) throw error;
    return data && data.length ? (data as Faq[]) : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export async function getContentPages(): Promise<ContentPage[]> {
  if (!isSupabaseConfigured()) return DEFAULT_PAGES;
  try {
    const { data, error } = await createPublicClient().from("content_pages").select("*");
    if (error) throw error;
    const map = new Map<string, ContentPage>(DEFAULT_PAGES.map((p) => [p.slug, p]));
    (data ?? []).forEach((r: ContentPage) => map.set(r.slug, r));
    return Array.from(map.values());
  } catch {
    return DEFAULT_PAGES;
  }
}

export async function getContentPage(slug: string): Promise<ContentPage | null> {
  const all = await getContentPages();
  return all.find((p) => p.slug === slug) ?? null;
}

/** Cheapest in-stock variant (for "from ₹xxx" labels). */
export function startingPrice(p: ProductWithVariants): number | null {
  const live = p.variants.filter((v) => v.stock > 0);
  const pool = live.length ? live : p.variants;
  return pool.length ? Math.min(...pool.map((v) => v.price)) : null;
}
