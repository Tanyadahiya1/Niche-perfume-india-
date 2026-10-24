import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data";
import { hasServiceRole } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";
import { waLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const s = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

/** Handles the "Sell your perfume" form (kind=sell) and the Contact form (kind=contact). */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (s(b.website)) return NextResponse.json({ ok: true }); // honeypot

  const kind = b.kind === "sell" ? "sell" : "contact";
  const name = s(b.name, 100);
  const phone = s(b.phone, 20).replace(/[^\d+]/g, "");
  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });

  const settings = await getSettings();
  let text = "";
  let persisted = false;
  let error: { message: string } | null = null;

  if (kind === "sell") {
    const row = {
      name, phone, email: s(b.email, 150), brand: s(b.brand, 100), fragrance: s(b.fragrance, 150),
      size_ml: Math.max(0, Math.floor(Number(b.size_ml) || 0)), fill_level: s(b.fill_level, 60),
      batch_code: s(b.batch_code, 60), expected_price: s(b.expected_price, 40), details: s(b.details, 1000),
    };
    if (!row.brand || !row.fragrance) return NextResponse.json({ error: "Please tell us the brand and fragrance name." }, { status: 400 });
    text = [
      "Hi! I'd like to sell a perfume.", "",
      `*Fragrance:* ${row.brand} ${row.fragrance} ${row.size_ml ? row.size_ml + "ml" : ""}`,
      `*Fill level:* ${row.fill_level || "-"}`, `*Batch code:* ${row.batch_code || "-"}`,
      `*Expected price:* ${row.expected_price || "-"}`, row.details ? `*Details:* ${row.details}` : "",
      "", `*Name:* ${name}`, `*Phone:* ${phone}`,
    ].filter(Boolean).join("\n");
    if (hasServiceRole()) ({ error } = await createServiceClient().from("sell_requests").insert(row));
    persisted = hasServiceRole() && !error;
  } else {
    const row = { name, phone, email: s(b.email, 150), subject: s(b.subject, 150), message: s(b.message, 2000) };
    if (row.message.length < 5) return NextResponse.json({ error: "Please write a short message." }, { status: 400 });
    text = [`Hi! ${row.subject ? "*" + row.subject + "*" : ""}`, row.message, "", `*Name:* ${name}`, `*Phone:* ${phone}`].join("\n");
    if (hasServiceRole()) ({ error } = await createServiceClient().from("contact_messages").insert(row));
    persisted = hasServiceRole() && !error;
  }

  if (error) {
    console.error("enquiry insert failed:", error);
    return NextResponse.json({ error: "We couldn't save your message. Please use the WhatsApp button instead." , whatsappUrl: waLink(settings.whatsapp_number, text) }, { status: 500 });
  }
  return NextResponse.json({ ok: true, persisted, whatsappUrl: waLink(settings.whatsapp_number, text) });
}
