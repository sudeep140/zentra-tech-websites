import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.trim().length > 0 &&
  supabaseKey &&
  supabaseKey.trim().length > 0 &&
  !supabaseUrl.includes('example.com')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('[Supabase] Client initialized with PostgreSQL connection.');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client, activating local fallback.', err);
    supabase = null;
  }
} else {
  console.log('[Persistence] Supabase credentials not configured. Operating in automated local persistent fallback mode.');
}
