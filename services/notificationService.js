import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import i18n from "./i18n";
import { store } from "../store/redux/store";
import {
  setPermissionStatus,
  setExpoPushToken,
  trackScheduledNotification,
  removeScheduledNotification,
  clearUserScheduledNotifications,
  addHistoryItem,
} from "../store/redux/notifications";
import { MEALS } from "../data/dummy-data";
import { MEALS_FA } from "../data/dummy-data.fa";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import { getUseSoonItems } from "../utils/pantry";
import { localizeIngredient } from "../utils/catalogue";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const ANDROID_CHANNELS = {
  timers: {
    name: "Kitchen & Cooking Timers",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    sound: "default",
    lightColor: "#3D5A45",
  },
  meal_plans: {
    name: "Meal Plan Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 100, 200],
    sound: "default",
    lightColor: "#3D5A45",
  },
  pantry_alerts: {
    name: "Pantry & Expiration Alerts",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    lightColor: "#8A6A3D",
  },
  general: {
    name: "Kitchen Updates",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    lightColor: "#3D5A45",
  },
};

/**
 * Configure Android notification channels on startup.
 */
export async function setupNotificationChannels() {
  if (Platform.OS !== "android") return;
  try {
    for (const [channelId, config] of Object.entries(ANDROID_CHANNELS)) {
      await Notifications.setNotificationChannelAsync(channelId, config);
    }
  } catch (err) {
    console.warn(
      "[Notifications] Failed setting up Android channels:",
      err?.message || err,
    );
  }
}

/**
 * Verify or check existing notification permission status.
 */
export async function getNotificationPermissionStatus() {
  if (Platform.OS === "web") return "granted";
  try {
    const { status } = await Notifications.getPermissionsAsync();
    store.dispatch(setPermissionStatus(status));
    return status;
  } catch (err) {
    console.warn(
      "[Notifications] Error getting permissions:",
      err?.message || err,
    );
    return "undetermined";
  }
}

/**
 * Request notification permissions respectfully from the OS.
 */
export async function requestNotificationPermissions() {
  if (Platform.OS === "web") {
    store.dispatch(setPermissionStatus("granted"));
    return "granted";
  }
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status === "granted") {
      store.dispatch(setPermissionStatus("granted"));
      return "granted";
    }
    const requested = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    store.dispatch(setPermissionStatus(requested.status));
    return requested.status;
  } catch (err) {
    console.warn(
      "[Notifications] Permission request failed:",
      err?.message || err,
    );
    return "denied";
  }
}

/**
 * Register for remote push tokens if supported.
 * Note: Remote notifications require an external backend and credentials.
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") return null;
  try {
    const perm = await requestNotificationPermissions();
    if (perm !== "granted") return null;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "028ef2ef-4ffb-473d-a720-c408eed8b434",
    }).catch(() => null);

    if (tokenData?.data) {
      store.dispatch(setExpoPushToken(tokenData.data));
      return tokenData.data;
    }
  } catch (err) {
    console.log(
      "[Notifications] Remote push token registration not available:",
      err?.message || err,
    );
  }
  return null;
}

function getActiveLanguage() {
  return store.getState().preferences?.language === "fa" ? "fa" : "en";
}

/**
 * Helper to resolve meal title based on language.
 */
function getMealTitle(mealId, lang) {
  if (!mealId) return "";
  if (lang === "fa" && MEALS_FA[mealId]?.title) {
    return MEALS_FA[mealId].title;
  }
  const meal = MEALS.find((m) => m.id === mealId);
  return meal ? meal.title : "";
}

/**
 * Schedule a local notification for a kitchen timer or cooking step timer.
 */
export async function scheduleTimerAlert({
  timerId,
  label,
  seconds,
  mealId = null,
  stepIndex = null,
  language = null,
}) {
  if (Platform.OS === "web") return null;
  const state = store.getState();
  const settings = state.notifications?.settings;
  if (!settings?.enabled || !settings?.timerAlerts) return null;

  const perm = await getNotificationPermissionStatus();
  if (perm !== "granted") return null;

  const lang = language || getActiveLanguage();
  const durationSec = Math.max(1, Math.round(seconds));
  const triggerDate = new Date(Date.now() + durationSec * 1000);
  const logicalKey = `timer_${timerId}`;

  await cancelTimerAlert(timerId);

  const title = mealId
    ? i18n.t("notifications.stepTimerReadyTitle", { lng: lang })
    : i18n.t("notifications.timerReadyTitle", { lng: lang });

  const body = mealId
    ? i18n.t("notifications.stepTimerReadyBody", {
        lng: lang,
        meal: getMealTitle(mealId, lang),
        step: label || (lang === "fa" ? "مرحله پخت" : "Cooking step"),
      })
    : i18n.t("notifications.timerReadyBody", {
        lng: lang,
        label: label || (lang === "fa" ? "تایمر" : "Timer"),
      });

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: {
          category: "timer",
          timerId,
          mealId,
          stepIndex,
          label,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: durationSec,
        channelId: "timers",
      },
    });

    store.dispatch(
      trackScheduledNotification({
        logicalKey,
        id: notificationId,
        category: "timer",
        triggerDateIso: triggerDate.toISOString(),
        data: { timerId, label, mealId, stepIndex },
        language: lang,
        content: { title, body },
      }),
    );

    return notificationId;
  } catch (err) {
    console.warn(
      "[Notifications] scheduleTimerAlert failed:",
      err?.message || err,
    );
    return null;
  }
}

/**
 * Cancel a kitchen timer notification.
 */
export async function cancelTimerAlert(timerId) {
  if (Platform.OS === "web") return;
  const logicalKey = `timer_${timerId}`;
  const tracked = store.getState().notifications?.scheduled?.[logicalKey];
  if (tracked?.id) {
    try {
      await Notifications.cancelScheduledNotificationAsync(tracked.id);
    } catch (e) {}
  }
  store.dispatch(removeScheduledNotification(logicalKey));
}

function getNextWeekdayDate(dayKey, timeStr = "18:30") {
  const [hoursStr, minutesStr] = String(timeStr).split(":");
  const targetHour = parseInt(hoursStr || "18", 10);
  const targetMinute = parseInt(minutesStr || "30", 10);

  const dayIndexMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  const targetDayOfWeek = dayIndexMap[dayKey.toLowerCase()];
  if (targetDayOfWeek === undefined) return null;

  const now = new Date();
  const currentDayOfWeek = now.getDay();
  let daysDiff = (targetDayOfWeek - currentDayOfWeek + 7) % 7;

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysDiff);
  targetDate.setHours(targetHour, targetMinute, 0, 0);

  if (daysDiff === 0 && targetDate.getTime() <= now.getTime()) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  return targetDate;
}

export async function syncMealPlanReminders({
  week = null,
  language = null,
  enabled = null,
  timePreference = null,
} = {}) {
  if (Platform.OS === "web") return;
  const state = store.getState();
  const settings = state.notifications?.settings;
  const isEnabled =
    enabled !== null
      ? enabled
      : settings?.enabled && settings?.mealPlanReminders;
  const time = timePreference || settings?.mealPlanTime || "18:30";
  const activeWeek = week || state.mealPlan?.week || {};
  const lang = language || getActiveLanguage();

  for (const day of WEEK_DAYS) {
    const logicalKey = `mealplan_${day}`;
    const plannedIds = activeWeek[day] || [];
    const tracked = state.notifications?.scheduled?.[logicalKey];

    if (!isEnabled || plannedIds.length === 0) {
      if (tracked?.id) {
        try {
          await Notifications.cancelScheduledNotificationAsync(tracked.id);
        } catch (e) {}
        store.dispatch(removeScheduledNotification(logicalKey));
      }
      continue;
    }

    const firstMealId = plannedIds[0];
    const mealTitle = getMealTitle(firstMealId, lang);
    const dayLabel = i18n.t(`mealPlan.days.${day}`, {
      lng: lang,
      defaultValue: day,
    });

    const triggerDate = getNextWeekdayDate(day, time);
    if (!triggerDate) continue;

    if (
      tracked?.id &&
      tracked?.language === lang &&
      tracked?.data?.mealId === firstMealId &&
      Math.abs(
        new Date(tracked.triggerDateIso).getTime() - triggerDate.getTime(),
      ) < 60000
    ) {
      continue;
    }

    if (tracked?.id) {
      try {
        await Notifications.cancelScheduledNotificationAsync(tracked.id);
      } catch (e) {}
    }

    const title = i18n.t("notifications.mealPlanTitle", { lng: lang });
    const body = i18n.t("notifications.mealPlanBody", {
      lng: lang,
      day: dayLabel,
      meal: mealTitle,
    });

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: {
            category: "meal_plan",
            day,
            mealId: firstMealId,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: "meal_plans",
        },
      });

      store.dispatch(
        trackScheduledNotification({
          logicalKey,
          id: notificationId,
          category: "meal_plan",
          triggerDateIso: triggerDate.toISOString(),
          data: { day, mealId: firstMealId },
          language: lang,
          content: { title, body },
        }),
      );
    } catch (err) {
      console.warn(
        `[Notifications] Failed scheduling meal plan for ${day}:`,
        err?.message || err,
      );
    }
  }
}

/**
 * Calculates next date for morning pantry alert (e.g., 09:00).
 */
function getNextPantryAlertDate(timeStr = "09:00") {
  const [hoursStr, minutesStr] = String(timeStr).split(":");
  const targetHour = parseInt(hoursStr || "9", 10);
  const targetMinute = parseInt(minutesStr || "0", 10);

  const now = new Date();
  const target = new Date(now);
  target.setHours(targetHour, targetMinute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

/**
 * Syncs pantry expiration alerts based on items nearing use-by dates.
 */
export async function syncPantryExpirationAlerts({
  pantry = null,
  useBy = null,
  language = null,
  enabled = null,
  timePreference = null,
} = {}) {
  if (Platform.OS === "web") return;
  const state = store.getState();
  const settings = state.notifications?.settings;
  const isEnabled =
    enabled !== null ? enabled : settings?.enabled && settings?.pantryAlerts;
  const items = pantry || state.pantry?.items || [];
  const useByMap = useBy || state.pantry?.useBy || {};
  const time = timePreference || settings?.pantryAlertTime || "09:00";
  const lang = language || getActiveLanguage();
  const logicalKey = "pantry_expirations";

  const tracked = state.notifications?.scheduled?.[logicalKey];

  if (!isEnabled || items.length === 0) {
    if (tracked?.id) {
      try {
        await Notifications.cancelScheduledNotificationAsync(tracked.id);
      } catch (e) {}
      store.dispatch(removeScheduledNotification(logicalKey));
    }
    return;
  }

  // Items expiring within 1-2 days
  const urgent = getUseSoonItems(items, useByMap, 2);
  if (urgent.length === 0) {
    if (tracked?.id) {
      try {
        await Notifications.cancelScheduledNotificationAsync(tracked.id);
      } catch (e) {}
      store.dispatch(removeScheduledNotification(logicalKey));
    }
    return;
  }

  const triggerDate = getNextPantryAlertDate(time);

  if (
    tracked?.id &&
    tracked?.language === lang &&
    Math.abs(
      new Date(tracked.triggerDateIso).getTime() - triggerDate.getTime(),
    ) < 60000
  ) {
    return;
  }

  if (tracked?.id) {
    try {
      await Notifications.cancelScheduledNotificationAsync(tracked.id);
    } catch (e) {}
  }

  const localizedNames = urgent
    .slice(0, 3)
    .map((item) => localizeIngredient(item, lang))
    .join(lang === "fa" ? "، " : ", ");

  const title = i18n.t("notifications.pantryExpiryTitle", { lng: lang });
  const body = i18n.t("notifications.pantryExpiryBody", {
    lng: lang,
    items: localizedNames,
  });

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: {
          category: "pantry",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: "pantry_alerts",
      },
    });

    store.dispatch(
      trackScheduledNotification({
        logicalKey,
        id: notificationId,
        category: "pantry",
        triggerDateIso: triggerDate.toISOString(),
        data: { count: urgent.length },
        language: lang,
        content: { title, body },
      }),
    );
  } catch (err) {
    console.warn(
      "[Notifications] Failed scheduling pantry expiry alert:",
      err?.message || err,
    );
  }
}

/**
 * Triggered on app language switch.
 * Finds all pending scheduled notifications and safely updates them
 * with the new language content at their exact scheduled trigger time!
 */
export async function rescheduleAllOnLanguageChange(newLang) {
  if (Platform.OS === "web") return;
  const state = store.getState();
  const scheduled = state.notifications?.scheduled || {};
  const now = Date.now();

  for (const [logicalKey, item] of Object.entries(scheduled)) {
    if (!item?.id || !item?.triggerDateIso) continue;

    const triggerMs = new Date(item.triggerDateIso).getTime();
    if (triggerMs <= now) {
      store.dispatch(removeScheduledNotification(logicalKey));
      continue;
    }

    // Cancel existing scheduled notification
    try {
      await Notifications.cancelScheduledNotificationAsync(item.id);
    } catch (e) {}

    let title = "";
    let body = "";
    let channelId = "general";

    if (item.category === "timer") {
      channelId = "timers";
      const { label, mealId } = item.data || {};
      title = mealId
        ? i18n.t("notifications.stepTimerReadyTitle", { lng: newLang })
        : i18n.t("notifications.timerReadyTitle", { lng: newLang });

      body = mealId
        ? i18n.t("notifications.stepTimerReadyBody", {
            lng: newLang,
            meal: getMealTitle(mealId, newLang),
            step: label || (newLang === "fa" ? "مرحله پخت" : "Cooking step"),
          })
        : i18n.t("notifications.timerReadyBody", {
            lng: newLang,
            label: label || (newLang === "fa" ? "تایمر" : "Timer"),
          });
    } else if (item.category === "meal_plan") {
      channelId = "meal_plans";
      const { day, mealId } = item.data || {};
      const mealTitle = getMealTitle(mealId, newLang);
      const dayLabel = i18n.t(`mealPlan.days.${day}`, {
        lng: newLang,
        defaultValue: day,
      });
      title = i18n.t("notifications.mealPlanTitle", { lng: newLang });
      body = i18n.t("notifications.mealPlanBody", {
        lng: newLang,
        day: dayLabel,
        meal: mealTitle,
      });
    } else if (item.category === "pantry") {
      channelId = "pantry_alerts";
      const urgent = getUseSoonItems(
        state.pantry?.items || [],
        state.pantry?.useBy || {},
        2,
      );
      const localizedNames = urgent
        .slice(0, 3)
        .map((it) => localizeIngredient(it, newLang))
        .join(newLang === "fa" ? "، " : ", ");
      title = i18n.t("notifications.pantryExpiryTitle", { lng: newLang });
      body = i18n.t("notifications.pantryExpiryBody", {
        lng: newLang,
        items: localizedNames,
      });
    } else {
      title = i18n.t("notifications.testTitle", { lng: newLang });
      body = i18n.t("notifications.testBody", { lng: newLang });
    }

    try {
      const newNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: item.data || {},
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(triggerMs),
          channelId,
        },
      });

      store.dispatch(
        trackScheduledNotification({
          logicalKey,
          id: newNotificationId,
          category: item.category,
          triggerDateIso: item.triggerDateIso,
          data: item.data,
          language: newLang,
          content: { title, body },
        }),
      );
    } catch (err) {
      console.warn(
        `[Notifications] Failed rescheduling ${logicalKey} for ${newLang}:`,
        err?.message || err,
      );
    }
  }
}

/**
 * Cancel user-scoped notifications on logout to prevent leak between accounts.
 */
export async function cancelUserScopedNotifications() {
  if (Platform.OS === "web") return;
  const scheduled = store.getState().notifications?.scheduled || {};
  for (const [key, item] of Object.entries(scheduled)) {
    if (!key.startsWith("timer_") && item?.id) {
      try {
        await Notifications.cancelScheduledNotificationAsync(item.id);
      } catch (e) {}
    }
  }
  store.dispatch(clearUserScheduledNotifications());
}

/**
 * Send an immediate test notification in the user's selected language.
 */
export async function sendTestNotification({ language = null } = {}) {
  const lang = language || getActiveLanguage();
  const title = i18n.t("notifications.testTitle", { lng: lang });
  const body = i18n.t("notifications.testBody", { lng: lang });

  const historyPayload = {
    id: `test_${Date.now()}`,
    title,
    body,
    category: "test",
    date: new Date().toISOString(),
    data: { category: "test" },
  };

  store.dispatch(addHistoryItem(historyPayload));

  if (Platform.OS === "web") return "web_simulated";

  const perm = await requestNotificationPermissions();
  if (perm !== "granted") {
    return "permission_denied";
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        subtitle: lang === "fa" ? "مارس ورلد کوزین" : "Mars World Cuisine",
        color: "#3D5A45",
        data: { category: "test" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
        channelId: "general",
      },
    });
    return id;
  } catch (err) {
    console.warn(
      "[Notifications] sendTestNotification failed:",
      err?.message || err,
    );
    return null;
  }
}

/**
 * Unified notification-tap navigation handler.
 */
export function handleNotificationNavigation(response, navigationRef) {
  if (!response || !navigationRef?.isReady()) return;
  const data = response?.notification?.request?.content?.data || {};
  const category = data?.category;

  if (category === "timer") {
    if (data?.mealId) {
      navigationRef.navigate("CookingMode", { mealId: data.mealId });
    } else {
      navigationRef.navigate("Timers");
    }
  } else if (category === "meal_plan") {
    if (data?.mealId) {
      navigationRef.navigate("MealDetail", { mealId: data.mealId });
    } else {
      navigationRef.navigate("MealPlan");
    }
  } else if (category === "pantry") {
    navigationRef.navigate("UseSoon");
  } else if (category === "quest") {
    navigationRef.navigate("Quests");
  } else {
    // Default fallback to Preferences screen
    navigationRef.navigate("Preferences");
  }
}
