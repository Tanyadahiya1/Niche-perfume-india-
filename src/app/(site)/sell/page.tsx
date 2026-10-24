import EnquiryForm from "@/components/EnquiryForm";
import { getSettings } from "@/lib/data";
import { lines, parts } from "@/lib/format";

export const metadata = { title: "Sell Your Perfume — Niche Perfume India" };

export default async function SellPage() {
  const s = await getSettings();
  const steps = lines(s.sell_steps).map(parts);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">{s.sell_title}</h1>
        <p className="page-sub">{s.sell_text}</p>
      </div>
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="steps">
          {steps.map(([t, d], i) => (
            <div className="step" key={i}><b>{i + 1}</b><h3 style={{ margin: "6px 0" }}>{t}</h3><p>{d}</p></div>
          ))}
        </div>
        <div style={{ maxWidth: 720, margin: "50px auto 0" }}>
          <EnquiryForm kind="sell" />
        </div>
      </section>
    </div>
  );
}
