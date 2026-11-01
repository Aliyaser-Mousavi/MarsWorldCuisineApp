import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

export const OFFLINE_AUTH_RECORD_KEY = "@mars_offline_auth_record";

/**
 * Checks whether an error or network state indicates an offline / unreachable network failure.
 */
export function isNetworkOrOfflineError(error, netState) {
  if (netState && (netState.isConnected === false || netState.isInternetReachable === false)) {
    return true;
  }
  if (!error) return false;
  if (error.name === "AuthRetryableFetchError") return true;
  if (error.status === 0) return true;

  const message = String(error.message || error || "").toLowerCase();
  return (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed to fetch") ||
    message.includes("offline") ||
    message.includes("timeout") ||
    message.includes("network request failed") ||
    message.includes("abort") ||
    message.includes("connection")
  );
}

/**
 * Save reliable evidence of an authenticated user for offline cold-start access.
 * Does not store sensitive tokens. Only stores user identity and profile metadata.
 */
export async function saveOfflineAuthRecord(user, profile) {
  if (!user?.id) return;
  try {
    const existingRaw = await AsyncStorage.getItem(OFFLINE_AUTH_RECORD_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};

    const record = {
      userId: user.id,
      email: user.email || existing.email || "",
      userMetadata: user.user_metadata || existing.userMetadata || {},
      profile: profile || existing.profile || null,
      lastAuthenticatedAt: Date.now(),
    };

    await AsyncStorage.setItem(OFFLINE_AUTH_RECORD_KEY, JSON.stringify(record));
  } catch (err) {
    console.warn("[offlineAuth] Failed to save offline auth record:", err?.message || err);
  }
}

/**
 * Read the saved offline auth record.
 */
export async function getOfflineAuthRecord() {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_AUTH_RECORD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.userId) return null;
    return parsed;
  } catch (err) {
    console.warn("[offlineAuth] Failed to read offline auth record:", err?.message || err);
    return null;
  }
}

/**
 * Clear the offline auth record. Called on explicit sign out or confirmed auth rejection.
 */
export async function clearOfflineAuthRecord() {
  try {
    await AsyncStorage.removeItem(OFFLINE_AUTH_RECORD_KEY);
  } catch (err) {
    console.warn("[offlineAuth] Failed to clear offline auth record:", err?.message || err);
  }
}

/**
 * Inspect Supabase's own cached session directly from AsyncStorage.
 * This provides complementary evidence that Supabase had saved a session on this device.
 */
export async function getCachedSupabaseSession() {
  if (!supabase?.auth?.storageKey) return null;
  try {
    const raw = await AsyncStorage.getItem(supabase.auth.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.user && parsed.user.id) {
      return parsed;
    }
    return null;
  } catch (err) {
    return null;
  }
}
