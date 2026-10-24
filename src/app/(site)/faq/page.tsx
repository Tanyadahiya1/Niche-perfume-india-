import { getFaqs } from "@/lib/data";

export const metadata = { title: "FAQ — Niche Perfume India" };

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-sub">Everything you need to know about decants, orders and delivery.</p>
      </div>
      <section className="section faq" style={{ paddingTop: 36, maxWidth: 780, marginInline: "auto" }}>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
