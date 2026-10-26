import { createSlice } from "@reduxjs/toolkit";

const initialSettings = {
  enabled: true,
  timerAlerts: true,
  mealPlanReminders: true,
  mealPlanTime: "18:30",
  pantryAlerts: true,
  pantryAlertTime: "09:00",
  questAlerts: true,
};

const initialState = {
  settings: initialSettings,
  permission: "undetermined", // 'undetermined' | 'granted' | 'denied'
  expoPushToken: null,
  /**
   * Tracks scheduled notifications by logical key.
   * e.g., 'timer_t-1', 'mealplan_monday', 'pantry_expirations'
   * Storing: { id, logicalKey, category, triggerDateIso, data, language, content }
   */
  scheduled: {},
  /** In-app notification center / history log (max 40) */
  history: [],
  /** Active in-app notification banner */
  activeBanner: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationSetting: (state, action) => {
      const { key, value } = action.payload || {};
      if (key && key in state.settings) {
        state.settings[key] = value;
      }
    },
    setAllSettings: (state, action) => {
      state.settings = { ...state.settings, ...(action.payload || {}) };
    },
    setPermissionStatus: (state, action) => {
      state.permission = action.payload;
    },
    setExpoPushToken: (state, action) => {
      state.expoPushToken = action.payload;
    },
    trackScheduledNotification: (state, action) => {
      const { logicalKey, id, category, triggerDateIso, data, language, content } =
        action.payload || {};
      if (!logicalKey) return;
      state.scheduled[logicalKey] = {
        id,
        logicalKey,
        category: category || "general",
        triggerDateIso,
        data: data || {},
        language: language || "en",
        content: content || {},
      };
    },
    removeScheduledNotification: (state, action) => {
      const logicalKey = action.payload;
      if (logicalKey && state.scheduled[logicalKey]) {
        delete state.scheduled[logicalKey];
      }
    },
    clearAllScheduledNotifications: (state) => {
      state.scheduled = {};
    },
    clearUserScheduledNotifications: (state) => {
      // Keeps active timers ('timer_...'), clears user-account-specific schedules
      const remaining = {};
      Object.keys(state.scheduled || {}).forEach((key) => {
        if (key.startsWith("timer_")) {
          remaining[key] = state.scheduled[key];
        }
      });
      state.scheduled = remaining;
    },
    addHistoryItem: (state, action) => {
      const item = action.payload;
      if (!item || !item.title) return;
      const historyItem = {
        id: item.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: item.title,
        body: item.body || "",
        date: item.date || new Date().toISOString(),
        category: item.category || "general",
        data: item.data || {},
        read: false,
      };
      // Keep most recent 40 items, deduplicate by ID if exists
      const filtered = (state.history || []).filter((h) => h.id !== historyItem.id);
      state.history = [historyItem, ...filtered].slice(0, 40);
      if (item.showBanner !== false) {
        state.activeBanner = historyItem;
      }
    },
    showNotificationBanner: (state, action) => {
      state.activeBanner = action.payload;
    },
    dismissNotificationBanner: (state) => {
      state.activeBanner = null;
    },
    markHistoryItemRead: (state, action) => {
      const id = action.payload;
      const found = (state.history || []).find((h) => h.id === id);
      if (found) found.read = true;
    },
    markAllHistoryRead: (state) => {
      (state.history || []).forEach((h) => {
        h.read = true;
      });
    },
    clearHistory: (state) => {
      state.history = [];
    },
    resetNotificationState: () => initialState,
  },
});

export const {
  setNotificationSetting,
  setAllSettings,
  setPermissionStatus,
  setExpoPushToken,
  trackScheduledNotification,
  removeScheduledNotification,
  clearAllScheduledNotifications,
  clearUserScheduledNotifications,
  addHistoryItem,
  showNotificationBanner,
  dismissNotificationBanner,
  markHistoryItemRead,
  markAllHistoryRead,
  clearHistory,
  resetNotificationState,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
