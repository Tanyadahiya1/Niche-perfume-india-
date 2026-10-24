import React from "react";

/** Tiny formatter for admin-editable text: blank line = paragraph, "## " = heading, "- " = bullet list. */
export default function TextBlock({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const ls = block.split("\n");
        const out: React.ReactNode[] = [];
        let bullets: string[] = [];
        const flush = () => {
          if (bullets.length) {
            out.push(<ul key={`u${out.length}`}>{bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>);
            bullets = [];
          }
        };
        ls.forEach((l) => {
          if (l.startsWith("- ")) bullets.push(l.slice(2));
          else if (l.startsWith("## ")) {
            flush();
            out.push(<h2 key={`h${out.length}`}>{l.slice(3)}</h2>);
          } else if (l.trim()) {
            flush();
            out.push(<p key={`p${out.length}`}>{l}</p>);
          }
        });
        flush();
        return <React.Fragment key={i}>{out}</React.Fragment>;
      })}
    </div>
  );
}
