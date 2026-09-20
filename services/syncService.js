import { supabase } from "./supabase";

/**
 * Expected Supabase tables (create in your project if missing):
 *
 * public.favorites
 *   id uuid PK default gen_random_uuid()
 *   user_id uuid not null references auth.users(id) on delete cascade
 *   meal_id text not null
 *   unique (user_id, meal_id)
 *
 * public.shopping_list_items
 *   user_id uuid not null references auth.users(id) on delete cascade
 *   item_id text not null   -- Redux item id, e.g. `${mealId}-${ingredientName}`
 *   name text not null
 *   meal_id text not null
 *   meal_title text
 *   checked boolean not null default false
 *   primary key (user_id, item_id)
 *
 * Enable RLS so users can only read/write their own rows.
 */

function isOfflineError(error) {
  if (!error) return false;
  const message = String(error.message || error).toLowerCase();
  return (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("offline") ||
    message.includes("failed to fetch")
  );
}

function logSyncWarning(scope, error) {
  if (!error) return;
  console.warn(`[sync:${scope}]`, error.message || error);
}

/** Fetch favorites meal IDs for the signed-in user. */
export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("meal_id")
    .eq("user_id", userId);

  if (error) {
    logSyncWarning("fetchFavorites", error);
    return { ids: null, error, offline: isOfflineError(error) };
  }

  return {
    ids: (data || []).map((row) => row.meal_id).filter(Boolean),
    error: null,
    offline: false,
  };
}

/** Fetch shopping list items for the signed-in user. */
export async function fetchShoppingList(userId) {
  const { data, error } = await supabase
    .from("shopping_list_items")
    .select("item_id, name, meal_id, meal_title, checked")
    .eq("user_id", userId);

  if (error) {
    logSyncWarning("fetchShoppingList", error);
    return { items: null, error, offline: isOfflineError(error) };
  }

  return {
    items: (data || []).map((row) => ({
      id: row.item_id,
      name: row.name,
      mealId: row.meal_id,
      mealTitle: row.meal_title || "",
      checked: !!row.checked,
    })),
    error: null,
    offline: false,
  };
}

/**
 * Pull remote favorites + shopping list.
 * On network failure returns null payloads so callers keep local Redux state.
 */
export async function pullUserKitchenData(userId) {
  const [favoritesResult, shoppingResult] = await Promise.all([
    fetchFavorites(userId),
    fetchShoppingList(userId),
  ]);

  const offline = favoritesResult.offline || shoppingResult.offline;
  const failed = favoritesResult.error || shoppingResult.error;

  if (failed) {
    return {
      favorites: null,
      shoppingList: null,
      offline,
      error: favoritesResult.error || shoppingResult.error,
    };
  }

  return {
    favorites: favoritesResult.ids,
    shoppingList: shoppingResult.items,
    offline: false,
    error: null,
  };
}

export async function addFavoriteRemote(userId, mealId) {
  const { error } = await supabase.from("favorites").upsert(
    { user_id: userId, meal_id: mealId },
    { onConflict: "user_id,meal_id" },
  );
  if (error) logSyncWarning("addFavoriteRemote", error);
  return { error, offline: isOfflineError(error) };
}

export async function removeFavoriteRemote(userId, mealId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("meal_id", mealId);
  if (error) logSyncWarning("removeFavoriteRemote", error);
  return { error, offline: isOfflineError(error) };
}

export async function upsertShoppingItemsRemote(userId, items) {
  if (!items?.length) return { error: null, offline: false };

  const rows = items.map((item) => ({
    user_id: userId,
    item_id: item.id,
    name: item.name,
    meal_id: item.mealId,
    meal_title: item.mealTitle || "",
    checked: !!item.checked,
  }));

  const { error } = await supabase
    .from("shopping_list_items")
    .upsert(rows, { onConflict: "user_id,item_id" });
  if (error) logSyncWarning("upsertShoppingItemsRemote", error);
  return { error, offline: isOfflineError(error) };
}

export async function updateShoppingItemCheckedRemote(userId, itemId, checked) {
  const { error } = await supabase
    .from("shopping_list_items")
    .update({ checked })
    .eq("user_id", userId)
    .eq("item_id", itemId);
  if (error) logSyncWarning("updateShoppingItemCheckedRemote", error);
  return { error, offline: isOfflineError(error) };
}

export async function removeShoppingItemRemote(userId, itemId) {
  const { error } = await supabase
    .from("shopping_list_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);
  if (error) logSyncWarning("removeShoppingItemRemote", error);
  return { error, offline: isOfflineError(error) };
}

export async function removeShoppingItemsRemote(userId, itemIds) {
  if (!itemIds?.length) return { error: null, offline: false };

  const { error } = await supabase
    .from("shopping_list_items")
    .delete()
    .eq("user_id", userId)
    .in("item_id", itemIds);
  if (error) logSyncWarning("removeShoppingItemsRemote", error);
  return { error, offline: isOfflineError(error) };
}

export async function clearShoppingListRemote(userId) {
  const { error } = await supabase
    .from("shopping_list_items")
    .delete()
    .eq("user_id", userId);
  if (error) logSyncWarning("clearShoppingListRemote", error);
  return { error, offline: isOfflineError(error) };
}

/**
 * Push local Redux changes to Supabase after a kitchen mutation.
 * Never throws — offline / API failures leave local state intact.
 */
export async function syncActionToSupabase(action, prevState, nextState) {
  const userId = nextState.auth?.user?.id;
  if (!userId || !nextState.auth?.isAuthenticated) return;

  const type = action.type;

  try {
    switch (type) {
      case "favorites/addFavorite": {
        await addFavoriteRemote(userId, action.payload.id);
        break;
      }
      case "favorites/removeFavorite": {
        await removeFavoriteRemote(userId, action.payload.id);
        break;
      }
      case "shoppingList/addIngredients": {
        const prevIds = new Set(
          (prevState.shoppingList?.items || []).map((i) => i.id),
        );
        const added = (nextState.shoppingList?.items || []).filter(
          (item) => !prevIds.has(item.id),
        );
        await upsertShoppingItemsRemote(userId, added);
        break;
      }
      case "shoppingList/toggleItem": {
        const item = (nextState.shoppingList?.items || []).find(
          (i) => i.id === action.payload,
        );
        if (item) {
          await updateShoppingItemCheckedRemote(
            userId,
            item.id,
            item.checked,
          );
        }
        break;
      }
      case "shoppingList/removeItem": {
        await removeShoppingItemRemote(userId, action.payload);
        break;
      }
      case "shoppingList/clearChecked": {
        const nextIds = new Set(
          (nextState.shoppingList?.items || []).map((i) => i.id),
        );
        const removed = (prevState.shoppingList?.items || [])
          .filter((i) => !nextIds.has(i.id))
          .map((i) => i.id);
        await removeShoppingItemsRemote(userId, removed);
        break;
      }
      case "shoppingList/clearAll": {
        await clearShoppingListRemote(userId);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    logSyncWarning("syncActionToSupabase", err);
  }
}
