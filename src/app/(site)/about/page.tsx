import Link from "next/link";
import TextBlock from "@/components/TextBlock";
import { getContentPage, getSettings } from "@/lib/data";

export const metadata = { title: "About — Niche Perfume India" };

export default async function AboutPage() {
  const [page, s] = await Promise.all([getContentPage("about"), getSettings()]);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">{page?.title ?? "About Us"}</h1>
        <p className="page-sub">{s.about_hero}</p>
      </div>
      <section className="section" style={{ paddingTop: 30 }}>
        <TextBlock body={page?.body ?? ""} />
        <div className="cta-center">
          <Link className="btn btn-primary" href="/collection">Explore the collection →</Link>
        </div>
      </section>
    </div>
  );
}
