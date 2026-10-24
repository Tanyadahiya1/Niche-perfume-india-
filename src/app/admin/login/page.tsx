"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [err, setErr] = useState(params.get("error") === "notadmin" ? "This account is not an admin. Add its email to the admin_users table (see README step 5)." : "");
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured())
    return (
      <div className="alert err">
        <strong>Supabase is not configured yet.</strong>
        <br />Add your keys to <code>.env.local</code> (see README, step 3), restart the dev server, then come back here.
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const f = new FormData(e.currentTarget);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  async function out() {
    await createBrowserSupabase().auth.signOut();
    router.refresh();
  }

  return (
    <form onSubmit={submit}>
      <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" required autoComplete="username" /></div>
      <div className="field"><label htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" required autoComplete="current-password" /></div>
      {err && <div className="alert err" role="alert" style={{ marginBottom: 14 }}>{err}</div>}
      <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      {params.get("error") === "notadmin" && <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={out}>Sign out of this account</button>}
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-box wrap" style={{ width: "min(420px, 90%)" }}>
      <h1 className="serif" style={{ fontSize: 40, textAlign: "center", margin: "0 0 28px", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Admin sign in</h1>
      <Suspense fallback={null}><LoginForm /></Suspense>
    </div>
  );
}
