import Link from "next/link";
import type { Settings } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";

export default function Footer({ s }: { s: Settings }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" href="/">
              {s.logo_main}
              <span>{s.logo_italic}</span>
            </Link>
            <p className="foot-about">{s.tagline}</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/decants">Decants</Link></li>
              <li><Link href="/partials">Partials</Link></li>
              <li><Link href="/retail">Retail Packs</Link></li>
              <li><Link href="/samples">Samples</Link></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/policies#shipping">Shipping &amp; Returns</Link></li>
              <li><Link href="/policies#terms">Terms of Service</Link></li>
              <li><Link href="/policies#privacy">Privacy Policy</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href={s.instagram_url} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href={waLink(s.whatsapp_number, "Hi! I have a question.")} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={s.youtube_url} target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {s.logo_main}{s.logo_italic}. All rights reserved.</span>
          <span>{s.address}</span>
        </div>
      </div>
    </footer>
  );
}
