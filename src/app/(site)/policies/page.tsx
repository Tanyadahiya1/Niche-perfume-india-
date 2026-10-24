import TextBlock from "@/components/TextBlock";
import { getContentPage } from "@/lib/data";

export const metadata = { title: "Policies — Niche Perfume India" };

const SLUGS = ["shipping", "terms", "privacy"];

export default async function PoliciesPage() {
  const pages = await Promise.all(SLUGS.map((s) => getContentPage(s)));
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Policies</h1>
        <p className="page-sub">Shipping &amp; returns, terms of service and privacy.</p>
      </div>
      <section className="section" style={{ paddingTop: 30 }}>
        {pages.map((p, i) =>
          p ? (
            <div key={SLUGS[i]} id={SLUGS[i]} style={{ marginBottom: 64, scrollMarginTop: 30 }}>
              <h2 className="section-title" style={{ marginBottom: 26 }}>{p.title}</h2>
              <TextBlock body={p.body} />
            </div>
          ) : null
        )}
      </section>
    </div>
  );
}
