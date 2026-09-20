import * as Linking from "expo-linking";
import { supabase } from "./supabase";

/**
 * Stable deep link used in auth emails. Must match a Supabase Redirect URL
 * exactly (Site URL should also be this value for password recovery).
 *
 * Do not use Linking.createURL() here — in some builds it collapses to
 * marsworldcuisine:// which opens a blank Chrome tab instead of the app.
 */
export const PASSWORD_RESET_REDIRECT_URL = "marsworldcuisine://reset-password";
export const AUTH_EMAIL_REDIRECT_URL = "marsworldcuisine://auth";

/**
 * Parse auth tokens / PKCE code from a Supabase deep-link URL
 * and establish a session in the client.
 */
export async function createSessionFromUrl(url) {
  if (!url) return { session: null, error: null };

  try {
    const parsed = Linking.parse(url);
    const query = parsed.queryParams || {};

    // Hash fragments (implicit flow): marsworldcuisine://reset-password#access_token=...&refresh_token=...
    let hashParams = {};
    const hashIndex = url.indexOf("#");
    if (hashIndex >= 0) {
      const hash = url.slice(hashIndex + 1);
      hashParams = Object.fromEntries(
        hash.split("&").map((pair) => {
          const [key, ...rest] = pair.split("=");
          return [key, decodeURIComponent(rest.join("=") || "")];
        }),
      );
    }

    const access_token = query.access_token || hashParams.access_token;
    const refresh_token = query.refresh_token || hashParams.refresh_token;
    const code = query.code || hashParams.code;
    const type = query.type || hashParams.type;

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        String(code),
      );
      if (error) {
        console.warn("[linking] exchangeCodeForSession:", error.message);
        return { session: null, error, type };
      }
      return { session: data.session, error: null, type };
    }

    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token: String(access_token),
        refresh_token: String(refresh_token),
      });
      if (error) {
        console.warn("[linking] setSession:", error.message);
        return { session: null, error, type };
      }
      return { session: data.session, error: null, type };
    }

    return { session: null, error: null, type };
  } catch (err) {
    console.warn("[linking] createSessionFromUrl:", err?.message || err);
    return { session: null, error: err };
  }
}

export function isPasswordRecoveryUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("reset-password") ||
    lower.includes("type=recovery") ||
    lower.includes("type%3drecovery")
  );
}
