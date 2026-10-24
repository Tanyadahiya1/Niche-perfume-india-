import type { ContentPage, Faq, Settings } from "./types";

/**
 * Everything here is a FALLBACK. Once you save a value in Admin > Settings / Content,
 * the database value wins. So you can edit all of this later without touching code.
 */
export const DEFAULT_SETTINGS: Settings = {
  logo_main: "NICHE",
  logo_italic: " perfume india",
  tagline: "Premium perfume decants from the world's finest fragrance houses. 100% authentic, expertly decanted.",
  whatsapp_number: "919999999999",
  contact_email: "hello@nicheperfumeindia.example",
  phone: "+91 99999 99999",
  address: "Saket, New Delhi, India",
  business_hours: "Mon–Sat, 11:00 AM – 8:00 PM IST",
  instagram_url: "https://instagram.com/",
  instagram_handle: "@nicheperfumeindia",
  youtube_url: "https://youtube.com/",
  ticker: [
    "FREE DELIVERY ON ORDERS ABOVE ₹999",
    "COD AVAILABLE",
    "2ML SAMPLES",
    "PREMIUM 10ML DECANTS",
    "100% AUTHENTIC FRAGRANCES",
    "CURATED IN SAKET, NEW DELHI",
  ].join("\n"),
  hero_eyebrow: "A premium fragrance experience",
  hero_line1: "Discover Niche",
  hero_line2: "Perfume Decants",
  hero_description:
    "Explore the world's most captivating fragrances without committing to a full bottle. Authentic scents, thoughtfully curated for your next signature fragrance.",
  hero_btn1: "Explore Decants",
  hero_btn2: "Shop Collection",
  hero_scroll_note: "Find your signature scent",
  stats: ["100% | Authentic", "1K+ | Fragrance lovers", "100+ | Curated scents"].join("\n"),
  free_shipping_threshold: "999",
  shipping_fee: "79",
  cod_enabled: "yes",
  cod_fee: "0",
  why_title: "Why Choose Us",
  why_sub: "Quality, authenticity, and care in every bottle",
  why_items: [
    "100% Authentic | Every fragrance is sourced directly from authorized distributors",
    "Premium Decanting | Expertly transferred using sterile equipment and techniques",
    "Fast Shipping | Free delivery on orders above ₹999 across India",
  ].join("\n"),
  reviews_title: "What Our Customers Say",
  reviews: [
    "5 | Absolutely authentic! The decant smells exactly like the original. Will definitely order again. | Aarav M.",
    "5 | Fast shipping and beautiful packaging. Incredible value for money. | Priya S.",
    "4 | Great way to try luxury fragrances without spending a fortune. The decanting quality is top-notch. | Rohan K.",
    "5 | My go-to for perfume decants. Always authentic, always on time. Love the service! | Ishita D.",
  ].join("\n"),
  reels_title: "Follow Our Fragrance Journey",
  reels_sub: "Watch our latest on Instagram",
  reels: ["/images/reel1.svg | #", "/images/reel2.svg | #", "/images/reel3.svg | #"].join("\n"),
  featured_title: "Featured Fragrances",
  featured_sub: "Hand-picked bestsellers from our curated collection",
  customize_title: "Customize Your Decant",
  customize_text: "Want a unique design on your decant? Tell us your vision on WhatsApp.",
  customize_message: "Hi! I'd like a customized decant design. Here is my idea:",
  customize_points: [
    "Custom label with your name or message | Perfect for gifting on birthdays, weddings and festivals",
    "Choose your fragrance and size | Any fragrance from our collection in 5ml or 10ml",
    "Premium gift packaging | Presented beautifully, ready to give",
  ].join("\n"),
  sell_title: "Sell Your Perfume",
  sell_text:
    "Have a sealed or lightly used niche bottle you no longer wear? Tell us about it and we will send you a fair offer within 24 hours.",
  sell_steps: [
    "Tell us about your bottle | Brand, name, size, batch code and photos",
    "Get a fair offer | We reply on WhatsApp within 24 hours",
    "Get paid | Pickup arranged and payment sent once verified",
  ].join("\n"),
  about_hero: "Fragrance, without the commitment.",
  collection_title: "The Collection",
  collection_sub: "Every fragrance we carry, in every format.",
  decants_title: "Decants",
  decants_sub: "5ml and 10ml travel-ready atomizers of authentic fragrances.",
  partials_title: "Partials",
  partials_sub: "Partially used authentic bottles at a fraction of the retail price.",
  retail_title: "Retail Packs",
  retail_sub: "Sealed, brand-new bottles. 100% authentic with a proof of purchase.",
  samples_title: "Samples",
  samples_sub: "2ml discovery vials. Try before you commit.",
  contact_title: "Get in Touch",
  contact_sub: "Questions about a fragrance, an order or a collaboration? We'd love to hear from you.",
};

export const DEFAULT_FAQS: Faq[] = [
  { question: "Are your fragrances 100% authentic?", answer: "Yes. Every fragrance is sourced from authorized distributors and decanted from sealed bottles. Batch codes are available on request.", sort_order: 1 },
  { question: "What is a decant?", answer: "A decant is a small portion of a fragrance transferred from the original bottle into a travel-friendly atomizer. You get the genuine juice in a size that is easy to try, carry and afford.", sort_order: 2 },
  { question: "What is the difference between a decant, a partial and a retail pack?", answer: "Decants are 2ml, 5ml or 10ml atomizers. Partials are original bottles that have been partly used and are sold at a discount. Retail packs are sealed, brand-new bottles in original packaging.", sort_order: 3 },
  { question: "How do you decant safely?", answer: "We use sterile syringes and clean, airtight atomizers, and store the originals away from heat and light so the fragrance stays true.", sort_order: 4 },
  { question: "How long will an order take to arrive?", answer: "Metro cities typically receive orders in 2–4 business days and the rest of India in 4–7 business days.", sort_order: 5 },
  { question: "Do you offer Cash on Delivery?", answer: "Yes, COD is available across most PIN codes in India. You can also confirm your order and pay by UPI over WhatsApp.", sort_order: 6 },
  { question: "How do I place an order?", answer: "Add your fragrances to the cart, fill in your delivery details at checkout and tap the WhatsApp button. We will confirm availability and payment details with you directly.", sort_order: 7 },
  { question: "Can I return a decant?", answer: "Because decants are hygiene-sensitive, we cannot accept returns on opened items. If your order arrives damaged or incorrect, contact us within 48 hours and we will make it right.", sort_order: 8 },
];

export const DEFAULT_PAGES: ContentPage[] = [
  {
    slug: "about",
    title: "About Us",
    body: `Niche Perfume India was started by a small group of fragrance obsessives in Saket, New Delhi, who were tired of blind-buying expensive bottles.

## Our story
Niche fragrances can cost ₹15,000 or more for a single bottle, and you often cannot know whether you will love one until weeks of wear. Decanting solves that. We make the world's finest fragrances accessible, one small, authentic vial at a time.

## What we believe
- Authenticity is non-negotiable. We only buy from authorized distributors.
- Sampling should be affordable, so you only buy a full bottle when you are sure.
- Great service is personal. Every order is packed by hand and every message is answered by a real person.

## Our process
Each decant is filled with sterile equipment, labelled, sealed in tamper-evident packaging and shipped within 24 hours of confirmation.`,
  },
  {
    slug: "shipping",
    title: "Shipping & Returns",
    body: `## Shipping
- Free delivery on orders above ₹999 anywhere in India.
- A flat shipping fee applies on smaller orders.
- Orders are dispatched within 1–2 business days after confirmation.
- Typical delivery time is 2–4 days in metros and 4–7 days elsewhere.

## Returns and replacements
Decants are hygiene-sensitive, so we cannot accept returns on opened or used items.

If your order arrives damaged, leaked or incorrect, message us on WhatsApp within 48 hours with a photo or short video and we will arrange a replacement or refund.

Retail packs and partials can be returned within 7 days only if sealed and unused, with the original packaging intact.`,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    body: `By placing an order with Niche Perfume India you agree to the following.

## Orders
An order is confirmed only after we verify availability and payment details with you on WhatsApp or by phone. Prices and stock can change without notice.

## Authenticity
We guarantee that every fragrance is genuine. Decants are repackaged portions of original products and are not sold in the original manufacturer's packaging.

## Brands
All brand names and trademarks belong to their respective owners. We are an independent reseller and are not affiliated with any brand.

## Liability
Fragrances can cause reactions on sensitive skin. Please patch test first. Our liability is limited to the value of the order.`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    body: `We respect your privacy.

## What we collect
Name, phone number, delivery address and order details that you provide when you place an order or contact us.

## How we use it
Only to confirm, pack, ship and support your order, and to answer your enquiries. We do not sell your data.

## Sharing
Your delivery details are shared with our courier partners solely for delivery.

## Your choices
Contact us at any time to ask for your data to be corrected or deleted.`,
  },
];

/** Admin form description for Settings. type: text | area | number */
export const SETTINGS_SCHEMA: { group: string; fields: { key: string; label: string; type: "text" | "area" | "number"; help?: string }[] }[] = [
  { group: "Business", fields: [
    { key: "logo_main", label: "Logo (bold part)", type: "text" },
    { key: "logo_italic", label: "Logo (italic part)", type: "text", help: "Keep the leading space." },
    { key: "tagline", label: "Footer tagline", type: "area" },
    { key: "whatsapp_number", label: "WhatsApp number", type: "text", help: "Country code + number, digits only. Example: 919876543210. ALL orders are sent here." },
    { key: "contact_email", label: "Contact email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "address", label: "Address", type: "text" },
    { key: "business_hours", label: "Business hours", type: "text" },
    { key: "instagram_url", label: "Instagram URL", type: "text" },
    { key: "instagram_handle", label: "Instagram handle", type: "text" },
    { key: "youtube_url", label: "YouTube URL", type: "text" },
  ]},
  { group: "Shipping & payment", fields: [
    { key: "free_shipping_threshold", label: "Free shipping above (₹)", type: "number" },
    { key: "shipping_fee", label: "Shipping fee below that (₹)", type: "number" },
    { key: "cod_enabled", label: "Cash on Delivery enabled (yes/no)", type: "text" },
    { key: "cod_fee", label: "COD extra fee (₹)", type: "number" },
  ]},
  { group: "Announcement bar", fields: [
    { key: "ticker", label: "Scrolling announcements", type: "area", help: "One per line." },
  ]},
  { group: "Home page", fields: [
    { key: "hero_eyebrow", label: "Hero tag", type: "text" },
    { key: "hero_line1", label: "Hero headline line 1", type: "text" },
    { key: "hero_line2", label: "Hero headline line 2", type: "text" },
    { key: "hero_description", label: "Hero description", type: "area" },
    { key: "hero_btn1", label: "Hero button 1 (links to Decants)", type: "text" },
    { key: "hero_btn2", label: "Hero button 2 (links to Collection)", type: "text" },
    { key: "hero_scroll_note", label: "Scroll note", type: "text" },
    { key: "stats", label: "Hero stats", type: "area", help: "One per line: value | label" },
    { key: "featured_title", label: "Featured title", type: "text" },
    { key: "featured_sub", label: "Featured subtitle", type: "text" },
    { key: "why_title", label: "'Why choose us' title", type: "text" },
    { key: "why_sub", label: "'Why choose us' subtitle", type: "text" },
    { key: "why_items", label: "'Why choose us' cards", type: "area", help: "One per line: title | text" },
    { key: "reviews_title", label: "Reviews title", type: "text" },
    { key: "reviews", label: "Reviews", type: "area", help: "One per line: stars(1-5) | review | name" },
    { key: "reels_title", label: "Instagram title", type: "text" },
    { key: "reels_sub", label: "Instagram subtitle", type: "text" },
    { key: "reels", label: "Instagram reels", type: "area", help: "One per line: image URL | link URL" },
  ]},
  { group: "Page headings", fields: [
    { key: "collection_title", label: "Collection title", type: "text" },
    { key: "collection_sub", label: "Collection subtitle", type: "text" },
    { key: "decants_title", label: "Decants title", type: "text" },
    { key: "decants_sub", label: "Decants subtitle", type: "text" },
    { key: "partials_title", label: "Partials title", type: "text" },
    { key: "partials_sub", label: "Partials subtitle", type: "text" },
    { key: "retail_title", label: "Retail title", type: "text" },
    { key: "retail_sub", label: "Retail subtitle", type: "text" },
    { key: "samples_title", label: "Samples title", type: "text" },
    { key: "samples_sub", label: "Samples subtitle", type: "text" },
    { key: "contact_title", label: "Contact title", type: "text" },
    { key: "contact_sub", label: "Contact subtitle", type: "text" },
  ]},
  { group: "Customize & Sell pages", fields: [
    { key: "customize_title", label: "Customize title", type: "text" },
    { key: "customize_text", label: "Customize text", type: "area" },
    { key: "customize_message", label: "Customize WhatsApp message", type: "text" },
    { key: "customize_points", label: "Customize highlights", type: "area", help: "One per line: title | text" },
    { key: "sell_title", label: "Sell title", type: "text" },
    { key: "sell_text", label: "Sell text", type: "area" },
    { key: "sell_steps", label: "Sell steps", type: "area", help: "One per line: title | text" },
  ]},
];
