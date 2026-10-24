import EnquiryForm from "@/components/EnquiryForm";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

export const metadata = { title: "Contact — Niche Perfume India" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">{s.contact_title}</h1>
        <p className="page-sub">{s.contact_sub}</p>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="two-col">
          <div className="panel">
            <h3>Reach us directly</h3>
            <p><span className="muted">WhatsApp</span><br /><a className="link-u" href={waLink(s.whatsapp_number, "Hi! I have a question.")} target="_blank" rel="noopener noreferrer">{s.phone}</a></p>
            <p><span className="muted">Email</span><br /><a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></p>
            <p><span className="muted">Location</span><br />{s.address}</p>
            <p><span className="muted">Hours</span><br />{s.business_hours}</p>
            <p><span className="muted">Instagram</span><br /><a className="link-u" href={s.instagram_url} target="_blank" rel="noopener noreferrer">{s.instagram_handle}</a></p>
          </div>
          <EnquiryForm kind="contact" />
        </div>
      </section>
    </div>
  );
}
