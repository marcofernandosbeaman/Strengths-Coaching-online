import { createClient } from "@supabase/supabase-js";

// Login is off unless VITE_AUTH_ENABLED=true, so the site stays open until Supabase is set up.
export const authEnabled = import.meta.env.VITE_AUTH_ENABLED === "true";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Null when the env vars are missing, so the app can show a setup message instead of crashing.
export const supabase = url && key ? createClient(url, key) : null;

export const signOut = () => supabase?.auth.signOut();
