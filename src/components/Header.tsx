"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

const NAV = [
  ["DECANTS", "/decants"],
  ["PARTIALS", "/partials"],
  ["RETAIL", "/retail"],
  ["SAMPLES", "/samples"],
  ["COLLECTION", "/collection"],
  ["SELL", "/sell"],
  ["CUSTOMIZE", "/customize"],
  ["ABOUT", "/about"],
] as const;

const THEME_KEY = "niche-perfume-theme"; // same key as your original homepage

export default function Header({ logoMain, logoItalic }: { logoMain: string; logoItalic: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [glass, setGlass] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem(THEME_KEY) === "glass") {
        document.body.classList.add("glass");
        setGlass(true);
      }
    } catch {}
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const toggleTheme = () => {
    document.body.classList.toggle("glass");
    const isGlass = document.body.classList.contains("glass");
    setGlass(isGlass);
    try {
      localStorage.setItem(THEME_KEY, isGlass ? "glass" : "dark");
    } catch {}
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    router.push(`/collection?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <header>
        <Link className="logo" href="/" aria-label="Niche Perfume India home">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img alt="Niche Perfumes India" src="data:image/png;base64,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" />
         {logoMain}
         <span>{logoItalic}</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="tools">
          <button className="icon-btn theme-toggle" id="themeToggle" aria-label="Switch theme" title="Switch theme" onClick={toggleTheme}>
            {glass ? "◐" : "☼"}
          </button>
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>⌕</button>
          <Link className="icon-btn cart-link" aria-label="Shopping bag" href="/cart">
            ♧{count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <button className="icon-btn burger" aria-label="Menu" onClick={() => setMenuOpen((m) => !m)}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-bar">
          <form onSubmit={submit}>
            <input className="input" autoFocus placeholder="Search by name, brand or note…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search fragrances" />
            <button className="btn btn-primary btn-sm" type="submit">Search</button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      )}
    </>
  );
}
