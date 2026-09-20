import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { REHYDRATE } from "redux-persist";
import { store, persistor } from "../store/redux/store";

const BACKUP_KEYS = [
  "favoriteMeals",
  "shoppingList",
  "recentMeals",
  "recipeMeta",
  "mealPlan",
  "preferences",
  "pantry",
  "cookbooks",
  "dinnerMenus",
  "prepList",
  "quests",
];

const APP_MARK = "mars-world-cuisine-backup";

export function buildBackupPayload() {
  const state = store.getState();
  const data = {};
  BACKUP_KEYS.forEach((key) => {
    if (state[key] !== undefined) data[key] = state[key];
  });
  return {
    app: APP_MARK,
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export async function exportKitchenBackup() {
  const payload = buildBackupPayload();
  const dir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
  if (!dir) throw new Error("No writable directory on this device.");

  const stamp = new Date().toISOString().slice(0, 10);
  const path = `${dir}mars-world-cuisine-${stamp}.json`;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(payload, null, 2));

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    return { path, shared: false };
  }

  await Sharing.shareAsync(path, {
    mimeType: "application/json",
    dialogTitle: "Save kitchen backup",
    UTI: "public.json",
  });
  return { path, shared: true };
}

export async function importKitchenBackup() {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/json", "public.json"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || !result.assets?.length) {
    return { canceled: true };
  }

  const uri = result.assets[0].uri;
  const text = await FileSystem.readAsStringAsync(uri);
  const parsed = JSON.parse(text);

  if (!parsed || parsed.app !== APP_MARK || !parsed.data) {
    throw new Error("That file is not a Mars World Cuisine backup.");
  }

  const payload = {};
  BACKUP_KEYS.forEach((key) => {
    if (parsed.data[key] !== undefined) payload[key] = parsed.data[key];
  });

  store.dispatch({
    type: REHYDRATE,
    key: "root",
    payload,
  });

  await persistor.flush();
  return { canceled: false, exportedAt: parsed.exportedAt };
}
