export const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export const lines = (s: string | undefined): string[] =>
  (s ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

/** "a | b | c" -> ["a","b","c"] */
export const parts = (line: string): string[] => line.split("|").map((p) => p.trim());

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
