"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, ProductWithVariants, Variant } from "@/lib/types";

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (p: ProductWithVariants, v: Variant, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  notify: (msg: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "niche-perfume-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const add = useCallback(
    (p: ProductWithVariants, v: Variant, qty = 1) => {
      setItems((prev) => {
        const max = Math.max(1, v.stock);
        const found = prev.find((i) => i.variantId === v.id);
        if (found) {
          return prev.map((i) =>
            i.variantId === v.id ? { ...i, price: v.price, maxQty: max, qty: Math.min(max, i.qty + qty) } : i
          );
        }
        return [
          ...prev,
          {
            variantId: v.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand,
            image: p.image_url,
            type: v.type,
            sizeMl: v.size_ml,
            price: v.price,
            qty: Math.min(max, qty),
            maxQty: max,
          },
        ];
      });
      notify(`${p.name} (${v.size_ml}ml) added to cart`);
    },
    [notify]
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.variantId === id ? { ...i, qty: Math.max(1, Math.min(i.maxQty, qty)) } : i))
    );
  }, []);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.variantId !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
      notify,
    }),
    [items, ready, add, setQty, remove, clear, notify]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
