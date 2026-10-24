import FaqEditor from "@/components/admin/FaqEditor";
import { requireAdmin } from "@/lib/admin";
import { DEFAULT_FAQS, DEFAULT_PAGES } from "@/lib/defaults";
import { importDefaults, savePage } from "../actions";

export default async function ContentAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  const { supabase } = await requireAdmin();
  const [pagesRes, faqRes] = await Promise.all([
    supabase.from("content_pages").select("*"),
    supabase.from("faqs").select("*").order("sort_order"),
  ]);
  const map = new Map(DEFAULT_PAGES.map((p) => [p.slug, p]));
  (pagesRes.data ?? []).forEach((p: { slug: string; title: string; body: string }) => map.set(p.slug, p));
  const faqs = faqRes.data && faqRes.data.length ? faqRes.data : DEFAULT_FAQS;

  return (
    <>
      <h1>Pages &amp; FAQ</h1>
      {searchParams.saved && <div className="alert ok" style={{ marginBottom: 20 }}>Saved ({searchParams.saved}). Your website is updated.</div>}
      <p className="muted" style={{ maxWidth: 680, lineHeight: 1.7 }}>
        Formatting: leave a blank line between paragraphs, start a line with <code>## </code> for a heading and <code>- </code> for a bullet.
      </p>

      <div className="form-card"><h3>FAQ</h3><FaqEditor initial={faqs.map((f: { question: string; answer: string }) => ({ question: f.question, answer: f.answer }))} /></div>

      {Array.from(map.values()).map((p) => (
        <form action={savePage} className="form-card" key={p.slug}>
          <h3>{p.slug === "about" ? "About page" : `Policy: ${p.slug}`}</h3>
          <input type="hidden" name="slug" value={p.slug} />
          <div className="field"><label>Title</label><input className="input" name="title" defaultValue={p.title} /></div>
          <div className="field"><label>Body</label><textarea className="input" name="body" defaultValue={p.body} style={{ minHeight: 260 }} /></div>
          <button className="btn btn-primary btn-sm" type="submit">Save</button>
        </form>
      ))}

      <form action={importDefaults} className="form-card">
        <h3>Import default content</h3>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>Copies the built-in settings, FAQ and page text into your database (existing values are kept). Optional: everything above already works without it.</p>
        <button className="btn btn-outline btn-sm" type="submit">Import defaults</button>
      </form>
    </>
  );
}
