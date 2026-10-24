import { getSettings } from "@/lib/data";
import { lines, parts } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export const metadata = { title: "Customize Your Decant — Niche Perfume India" };

export default async function CustomizePage() {
  const s = await getSettings();
  const points = lines(s.customize_points).map(parts);
  return (
    <>
      <section className="hero" style={{ minHeight: "56vh", padding: "70px 24px" }}>
        <div className="glow" aria-hidden="true"></div>
        <div className="hero-content">
          <h1 className="page-title" style={{ fontSize: "clamp(40px,5.5vw,70px)", margin: "0 0 22px" }}>{s.customize_title}</h1>
          <p className="description">{s.customize_text}</p>
          <div className="actions">
            <a className="btn btn-solid" style={{ background: "var(--fg)", color: "var(--bg)" }} href={waLink(s.whatsapp_number, s.customize_message)} target="_blank" rel="noopener noreferrer">
              ◌ Customize on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="why">
            {points.map(([t, d], i) => (
              <div className="why-card" key={i}>
                <div className="why-ic" aria-hidden="true">{["✎", "◈", "❖"][i % 3]}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
