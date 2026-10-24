import Announcement from "@/components/Announcement";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import GiftButton from "@/components/GiftButton";
import Header from "@/components/Header";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <CartProvider>
      <Announcement ticker={s.ticker} />
      <Header logoMain={s.logo_main} logoItalic={s.logo_italic} />
      <div className="greek-border greek-top" aria-hidden="true" />   {/* ADD */}
      <main>{children}</main>
      <div className="greek-border" aria-hidden="true" />             {/* ADD */}
      <Footer s={s} />  
      <GiftButton whatsapp={s.whatsapp_number} />
    </CartProvider>
  );
}
