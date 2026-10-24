import { requireAdmin } from "@/lib/admin";
import { DEFAULT_SETTINGS, SETTINGS_SCHEMA } from "@/lib/defaults";
import { saveSettings } from "../actions";

export default async function SettingsAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("key,value");
  const vals: Record<string, string> = { ...DEFAULT_SETTINGS };
  (data ?? []).forEach((r: { key: string; value: string }) => (vals[r.key] = r.value));

  return (
    <>
      <h1>Business settings</h1>
      {searchParams.saved && <div className="alert ok" style={{ marginBottom: 20 }}>Saved. Your website is updated.</div>}
      <form action={saveSettings}>
        {SETTINGS_SCHEMA.map((g) => (
          <div className="form-card" key={g.group}>
            <h3>{g.group}</h3>
            {g.fields.map((f) => (
              <div className="field" key={f.key}>
                <label htmlFor={f.key}>{f.label}</label>
                {f.type === "area" ? (
                  <textarea className="input" id={f.key} name={f.key} defaultValue={vals[f.key]} style={{ minHeight: 120 }} />
                ) : (
                  <input className="input" id={f.key} name={f.key} type={f.type === "number" ? "number" : "text"} defaultValue={vals[f.key]} />
                )}
                {f.help && <small>{f.help}</small>}
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-primary" type="submit">Save all settings</button>
      </form>
    </>
  );
}
