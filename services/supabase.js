import "react-native-url-polyfill/auto";
import * as ExpoCrypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Ensure getRandomValues is available for secure random tokens / UUIDs
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = {};
}
if (typeof globalThis.crypto.getRandomValues === "undefined") {
  globalThis.crypto.getRandomValues = (array) => ExpoCrypto.getRandomValues(array);
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. " +
    "Supabase features will be disabled. " +
    "Make sure your .env.local file exists and the Expo dev server was restarted after adding it."
  );
}

/** @type {import("@supabase/supabase-js").SupabaseClient} */
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // PKCE puts ?code= in the redirect (query) instead of #access_token in the
        // hash. Android/Chrome often drop hash fragments on custom-scheme handoff.
        flowType: "pkce",
      },
    })
  : null;
