import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getSettings } from "@/lib/data";
import { lines, parts } from "@/lib/format";

const ICONS = ["⛉", "✦", "➜"];

export default async function HomePage() {
  const [s, products] = await Promise.all([getSettings(), getAllProducts()]);
  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const stats = lines(s.stats).map(parts);
  const why = lines(s.why_items).map(parts);
  const reviews = lines(s.reviews).map(parts);
  const reels = lines(s.reels).map(parts);

  return (
    <>
      {/* ===== YOUR ORIGINAL HERO — markup, classes and styling unchanged ===== */}
      <section className="hero" id="home">
        <div className="glow" aria-hidden="true"></div>

        {/* eslint-disable @next/next/no-img-element */}
        <img className="product p1" src="/images/image1.png" alt="" aria-hidden="true" {...({ fetchpriority: "high" } as object)} />
        <img className="product p2" src="/images/image2.png" alt="" aria-hidden="true" loading="lazy" />
        <img className="product p3" src="/images/image3.png" alt="" aria-hidden="true" loading="lazy" />
        <img className="product p4" src="/images/image4.png" alt="" aria-hidden="true" loading="lazy" />
        {/* eslint-enable @next/next/no-img-element */}

        <div className="hero-content">
          <div className="eyebrow">{s.hero_eyebrow}</div>
          <h1>
            <span>{s.hero_line1}</span>
            <span>{s.hero_line2}</span>
          </h1>
          <p className="description">{s.hero_description}</p>
          <div className="actions">
            <Link className="btn btn-outline" href="/decants">{s.hero_btn1}</Link>
            <Link className="btn btn-primary" href="/collection">
              {s.hero_btn2} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="stats">
            {stats.map(([value, label], i) => (
              <div className="stat" key={i}>
                <strong>{value}</strong>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-note">{s.hero_scroll_note}</div>
      </section>
      {/* ===== end original hero ===== */}

      <div className="greek-border" aria-hidden="true" />

      <div className="framed">
        <section className="section">
          <div className="wrap">
            <h2 className="section-title">{s.featured_title}</h2>
            <p className="page-sub">{s.featured_sub}</p>
            <div className="grid-products mt">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="cta-center">
              <Link className="btn btn-outline" href="/collection">View full collection →</Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <h2 className="section-title">{s.why_title}</h2>
            <p className="page-sub">{s.why_sub}</p>
            <div className="why">
              {why.map(([title, text], i) => (
                <div className="why-card" key={i}>
                  <div className="why-ic" aria-hidden="true">{ICONS[i % ICONS.length]}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <h2 className="section-title">{s.reviews_title}</h2>
            <div className="reviews">
              {reviews.map(([stars, text, name], i) => {
                const n = Math.max(1, Math.min(5, parseInt(stars, 10) || 5));
                return (
                  <div className="review" key={i}>
                    <div className="stars" aria-label={`${n} out of 5 stars`}>{"★".repeat(n)}{"☆".repeat(5 - n)}</div>
                    <p>“{text}”</p>
                    <small>{name}</small>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center">
            <h2 className="section-title">{s.reels_title}</h2>
            <p className="page-sub">{s.reels_sub}</p>
            <div className="reels">
              {reels.map(([img, link], i) => (
                <a className="reel" key={i} href={link && link !== "#" ? link : s.instagram_url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Instagram reel ${i + 1}`} loading="lazy" />
                </a>
              ))}
            </div>
            <div className="cta-center">
              <a className="btn btn-outline" href={s.instagram_url} target="_blank" rel="noopener noreferrer">◎ {s.instagram_handle}</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}