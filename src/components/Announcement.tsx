import { lines } from "@/lib/format";

export default function Announcement({ ticker }: { ticker: string }) {
  const items = lines(ticker);
  const twice = [...items, ...items]; // duplicated so the marquee loops seamlessly (as in your original)
  return (
    <div className="announcement" aria-label="Store announcements">
      <div className="ticker">
        {twice.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
