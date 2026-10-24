import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

const noStore: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" });

/** Logged-in user's session (used by the admin area; RLS decides what they may do). */
export function createSessionClient() {
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // called from a Server Component: middleware refreshes the session instead
        }
      },
    },
  });
}

/** Public read-only client for the storefront (no cookies, respects RLS). */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: noStore },
  });
}

/** SERVER ONLY. Bypasses RLS. Used for placing orders and saving enquiries. */
export function createServiceClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: noStore },
  });
}
