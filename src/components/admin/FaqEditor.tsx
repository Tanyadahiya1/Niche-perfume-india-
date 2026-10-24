"use client";
import { useState } from "react";
import { saveFaqs } from "@/app/admin/(panel)/actions";

export default function FaqEditor({ initial }: { initial: { question: string; answer: string }[] }) {
  const [items, setItems] = useState(initial);
  const set = (i: number, p: Partial<{ question: string; answer: string }>) => setItems((x) => x.map((it, k) => (k === i ? { ...it, ...p } : it)));
  const move = (i: number, d: number) =>
    setItems((x) => {
      const j = i + d;
      if (j < 0 || j >= x.length) return x;
      const c = [...x];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  return (
    <form action={saveFaqs}>
      <input type="hidden" name="faqs" value={JSON.stringify(items)} readOnly />
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 14 }}>
          <div className="field"><label>Question {i + 1}</label><input className="input" value={it.question} onChange={(e) => set(i, { question: e.target.value })} /></div>
          <div className="field"><label>Answer</label><textarea className="input" style={{ minHeight: 80 }} value={it.answer} onChange={(e) => set(i, { answer: e.target.value })} /></div>
          <div className="actions-row">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => move(i, 1)}>↓</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setItems((x) => x.filter((_, k) => k !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <div className="actions-row">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setItems((x) => [...x, { question: "", answer: "" }])}>+ Add question</button>
        <button className="btn btn-primary btn-sm" type="submit">Save FAQ</button>
      </div>
    </form>
  );
}
