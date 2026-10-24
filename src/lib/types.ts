export type VariantType = "sample" | "decant" | "partial" | "retail";

export interface Variant {
  id: string;
  product_id: string;
  type: VariantType;
  size_ml: number;
  price: number;
  stock: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  inspired_by: string;
  gender: string;
  description: string;
  notes: string[];
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface ProductWithVariants extends Product {
  variants: Variant[];
}

export interface CartItem {
  variantId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  type: VariantType;
  sizeMl: number;
  price: number;
  qty: number;
  maxQty: number;
}

export type Settings = Record<string, string>;

export interface Faq {
  id?: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface ContentPage {
  slug: string;
  title: string;
  body: string;
}

export const TYPE_LABEL: Record<VariantType, string> = {
  sample: "Sample",
  decant: "Decant",
  partial: "Partial",
  retail: "Retail Pack",
};
