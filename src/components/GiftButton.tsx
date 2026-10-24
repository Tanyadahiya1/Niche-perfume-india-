"use client";
import { waLink } from "@/lib/whatsapp";

export default function GiftButton({ whatsapp }: { whatsapp: string }) {
  return (
    <button
      className="gift"
      aria-label="Gift and offers"
      title="Gift and offers"
      onClick={() =>
        window.open(waLink(whatsapp, "Hi! I'd like to know about your current offers and gift sets."), "_blank", "noopener")
      }
    >
      ♔
    </button>
  );
}
