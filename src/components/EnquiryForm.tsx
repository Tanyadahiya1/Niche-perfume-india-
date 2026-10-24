"use client";
import { useState } from "react";

export default function EnquiryForm({ kind }: { kind: "sell" | "contact" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [wa, setWa] = useState("");
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, kind }) });
      const data = await res.json();
      if (!res.ok) {
        if (data.whatsappUrl) setWa(data.whatsappUrl);
        throw new Error(data.error || "Something went wrong.");
      }
      setWa(data.whatsappUrl);
      setOk(true);
      form.reset();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="row2">
        <div className="field"><label htmlFor="n">Your name</label><input className="input" id="n" name="name" required minLength={2} /></div>
        <div className="field"><label htmlFor="p">Phone / WhatsApp</label><input className="input" id="p" name="phone" required inputMode="tel" /></div>
      </div>
      <div className="field"><label htmlFor="e">Email (optional)</label><input className="input" id="e" name="email" type="email" /></div>

      {kind === "sell" ? (
        <>
          <div className="row2">
            <div className="field"><label htmlFor="b">Brand</label><input className="input" id="b" name="brand" required placeholder="e.g. Creed" /></div>
            <div className="field"><label htmlFor="f">Fragrance</label><input className="input" id="f" name="fragrance" required placeholder="e.g. Aventus" /></div>
          </div>
          <div className="row2">
            <div className="field"><label htmlFor="sz">Bottle size (ml)</label><input className="input" id="sz" name="size_ml" type="number" min={1} placeholder="100" /></div>
            <div className="field"><label htmlFor="fl">Condition</label>
              <select className="input" id="fl" name="fill_level" defaultValue="Sealed">
                <option>Sealed</option><option>Over 90% full</option><option>50–90% full</option><option>Under 50% full</option>
              </select>
            </div>
          </div>
          <div className="row2">
            <div className="field"><label htmlFor="bc">Batch code (optional)</label><input className="input" id="bc" name="batch_code" /></div>
            <div className="field"><label htmlFor="ep">Expected price (₹)</label><input className="input" id="ep" name="expected_price" /></div>
          </div>
          <div className="field"><label htmlFor="d">Anything else?</label><textarea className="input" id="d" name="details" placeholder="Box available? Year of purchase? Photos can be shared on WhatsApp." /></div>
        </>
      ) : (
        <>
          <div className="field"><label htmlFor="s">Subject</label><input className="input" id="s" name="subject" /></div>
          <div className="field"><label htmlFor="m">Message</label><textarea className="input" id="m" name="message" required minLength={5} /></div>
        </>
      )}

      {err && <div className="alert err" role="alert" style={{ marginBottom: 14 }}>{err}</div>}
      {ok && <div className="alert ok" role="status" style={{ marginBottom: 14 }}>Thank you! We have received your {kind === "sell" ? "request" : "message"} and will reply shortly.</div>}

      <div className="actions-row">
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending…" : kind === "sell" ? "Get my offer" : "Send message"}</button>
        {wa && <a className="btn btn-outline" href={wa} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>}
      </div>
    </form>
  );
}
