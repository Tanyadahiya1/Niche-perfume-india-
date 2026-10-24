import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase/config";
import { createSessionClient } from "./supabase/server";

/** Every admin page and every admin server action calls this first. RLS enforces it again in the database. */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const supabase = createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: row } = await supabase.from("admin_users").select("email").maybeSingle();
  if (!row) redirect("/admin/login?error=notadmin");
  return { supabase, email: user.email ?? "" };
}
