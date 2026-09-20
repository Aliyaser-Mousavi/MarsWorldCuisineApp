import { hydrateFavorites } from "../store/redux/favorites";
import { hydrateShoppingList } from "../store/redux/shoppingList";
import { pullUserKitchenData } from "./syncService";

/**
 * Pull favorites + shopping list from Supabase and hydrate Redux.
 * On network / API failure, leaves existing local Redux state untouched.
 */
export async function hydrateKitchenFromRemote(userId, dispatch) {
  if (!userId || !dispatch) return { hydrated: false };

  const result = await pullUserKitchenData(userId);

  if (result.error || result.offline) {
    console.warn(
      "[sync] Keeping local favorites/shopping list — remote pull failed.",
      result.error?.message || "offline",
    );
    return { hydrated: false, offline: !!result.offline };
  }

  dispatch(hydrateFavorites(result.favorites));
  dispatch(hydrateShoppingList(result.shoppingList));
  return { hydrated: true, offline: false };
}
