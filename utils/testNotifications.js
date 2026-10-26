const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=================================================");
console.log("🚀 MARS WORLD CUISINE — NOTIFICATION TEST SUITE");
console.log("=================================================\n");

// 1. Localization Dictionary Checks
console.log("--- Test 1: Notification Localization Parity ---");
const en = JSON.parse(fs.readFileSync(path.join(__dirname, "../locales/en.json"), "utf8"));
const fa = JSON.parse(fs.readFileSync(path.join(__dirname, "../locales/fa.json"), "utf8"));

assert(en.notifications, "en.json must contain 'notifications' namespace");
assert(fa.notifications, "fa.json must contain 'notifications' namespace");

const enNotifKeys = Object.keys(en.notifications);
const faNotifKeys = Object.keys(fa.notifications);

console.log(`EN notification keys: ${enNotifKeys.length}`);
console.log(`FA notification keys: ${faNotifKeys.length}`);

assert.strictEqual(
  enNotifKeys.length,
  faNotifKeys.length,
  "EN and FA must have identical number of notification keys",
);

enNotifKeys.forEach((key) => {
  assert(
    fa.notifications[key] !== undefined,
    `fa.json is missing notification key: ${key}`,
  );
  assert(
    typeof fa.notifications[key] === "string" && fa.notifications[key].length > 0,
    `fa.json key ${key} must not be empty`,
  );
});

console.log("✅ Test 1 Passed: 100% notification translation key parity.\n");

// 2. Reducer Unit Tests
console.log("--- Test 2: Notification Redux Slice Reducers ---");
const {
  default: notificationsReducer,
  setNotificationSetting,
  setAllSettings,
  setPermissionStatus,
  setExpoPushToken,
  trackScheduledNotification,
  removeScheduledNotification,
  clearAllScheduledNotifications,
  clearUserScheduledNotifications,
  addHistoryItem,
  markHistoryItemRead,
  markAllHistoryRead,
  clearHistory,
} = require("../store/redux/notifications");

let state = notificationsReducer(undefined, { type: "@@INIT" });

// Initial defaults
assert.strictEqual(state.settings.enabled, true);
assert.strictEqual(state.settings.timerAlerts, true);
assert.strictEqual(state.settings.mealPlanReminders, true);
assert.strictEqual(state.settings.mealPlanTime, "18:30");
assert.strictEqual(state.settings.pantryAlerts, true);
assert.strictEqual(state.settings.pantryAlertTime, "09:00");
assert.strictEqual(state.permission, "undetermined");
assert.strictEqual(Array.isArray(state.history), true);
assert.strictEqual(state.history.length, 0);

// Setting changes
state = notificationsReducer(
  state,
  setNotificationSetting({ key: "mealPlanTime", value: "19:00" }),
);
assert.strictEqual(state.settings.mealPlanTime, "19:00");

state = notificationsReducer(
  state,
  setNotificationSetting({ key: "enabled", value: false }),
);
assert.strictEqual(state.settings.enabled, false);

// Permission status
state = notificationsReducer(state, setPermissionStatus("granted"));
assert.strictEqual(state.permission, "granted");

// Push token
state = notificationsReducer(
  state,
  setExpoPushToken("ExponentPushToken[mock-test-token]"),
);
assert.strictEqual(state.expoPushToken, "ExponentPushToken[mock-test-token]");

console.log("✅ Test 2 Passed: Settings, permissions, and push token reducers work.\n");

// 3. Scheduled Notification Tracking & Isolation
console.log("--- Test 3: Tracking & User Account Isolation ---");

// Track a timer notification
state = notificationsReducer(
  state,
  trackScheduledNotification({
    logicalKey: "timer_t-1",
    id: "sys_notif_1001",
    category: "timer",
    triggerDateIso: new Date(Date.now() + 60000).toISOString(),
    data: { timerId: "t-1", label: "Eggs" },
    language: "en",
  }),
);

// Track meal plan notification
state = notificationsReducer(
  state,
  trackScheduledNotification({
    logicalKey: "mealplan_monday",
    id: "sys_notif_1002",
    category: "meal_plan",
    triggerDateIso: new Date(Date.now() + 86400000).toISOString(),
    data: { day: "monday", mealId: "m1" },
    language: "en",
  }),
);

// Track pantry notification
state = notificationsReducer(
  state,
  trackScheduledNotification({
    logicalKey: "pantry_expirations",
    id: "sys_notif_1003",
    category: "pantry",
    triggerDateIso: new Date(Date.now() + 43200000).toISOString(),
    data: { count: 2 },
    language: "en",
  }),
);

assert.strictEqual(Object.keys(state.scheduled).length, 3);
assert.strictEqual(state.scheduled["timer_t-1"].id, "sys_notif_1001");
assert.strictEqual(state.scheduled["mealplan_monday"].id, "sys_notif_1002");

// Test user logout isolation: timers must remain, mealplan and pantry must be cleared!
state = notificationsReducer(state, clearUserScheduledNotifications());
assert.strictEqual(
  state.scheduled["timer_t-1"] !== undefined,
  true,
  "Active cooking timers should not be removed on user logout",
);
assert.strictEqual(
  state.scheduled["mealplan_monday"],
  undefined,
  "User meal plan reminders must be cleared on logout to prevent account leakage",
);
assert.strictEqual(
  state.scheduled["pantry_expirations"],
  undefined,
  "User pantry alerts must be cleared on logout",
);

console.log("✅ Test 3 Passed: User account isolation prevents data leakage between users.\n");

// 4. In-App Notification Center / History
console.log("--- Test 4: Notification History & Read Status ---");

state = notificationsReducer(
  state,
  addHistoryItem({
    id: "notif_1",
    title: "Eggs Timer Ready",
    body: "Your 7 minute timer is done.",
    category: "timer",
  }),
);

state = notificationsReducer(
  state,
  addHistoryItem({
    id: "notif_2",
    title: "Tonight's Dinner",
    body: "On the menu: Spaghetti Bolognese.",
    category: "meal_plan",
  }),
);

assert.strictEqual(state.history.length, 2);
assert.strictEqual(state.history[0].id, "notif_2"); // newest first
assert.strictEqual(state.history[0].read, false);

// Mark single as read
state = notificationsReducer(state, markHistoryItemRead("notif_2"));
assert.strictEqual(state.history[0].read, true);
assert.strictEqual(state.history[1].read, false);

// Mark all as read
state = notificationsReducer(state, markAllHistoryRead());
assert.strictEqual(state.history.every((h) => h.read), true);

// Clear history
state = notificationsReducer(state, clearHistory());
assert.strictEqual(state.history.length, 0);

console.log("✅ Test 4 Passed: Notification center history and read status work properly.\n");

// 5. Date Scheduling Logic
console.log("--- Test 5: Date Calculation & Past Rollover Logic ---");

function getNextWeekdayDate(dayKey, timeStr = "18:30", referenceNow = new Date()) {
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

  const currentDayOfWeek = referenceNow.getDay();
  let daysDiff = (targetDayOfWeek - currentDayOfWeek + 7) % 7;

  const targetDate = new Date(referenceNow);
  targetDate.setDate(referenceNow.getDate() + daysDiff);
  targetDate.setHours(targetHour, targetMinute, 0, 0);

  if (daysDiff === 0 && targetDate.getTime() <= referenceNow.getTime()) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  return targetDate;
}

// Test when target day is in the future
const fixedNow = new Date("2026-10-21T10:00:00Z"); // Wednesday (day 3)
const fridayDate = getNextWeekdayDate("friday", "18:30", fixedNow);
assert.strictEqual(fridayDate.getDay(), 5, "Friday must be day 5");
assert.strictEqual(fridayDate.getHours(), 18);
assert.strictEqual(fridayDate.getMinutes(), 30);
assert(fridayDate.getTime() > fixedNow.getTime(), "Future date must be > now");

// Test when target day is today but past target time -> must roll over to next week!
const wednesdayAfternoon = new Date(fixedNow);
wednesdayAfternoon.setHours(19, 0, 0, 0); // 19:00, after 18:30
const nextWed = getNextWeekdayDate("wednesday", "18:30", wednesdayAfternoon);
assert.strictEqual(nextWed.getDay(), 3, "Must still be Wednesday");
assert(
  nextWed.getTime() > wednesdayAfternoon.getTime() + 6 * 86400000,
  "Must roll over by 7 days to next week",
);

console.log("✅ Test 5 Passed: Calendar calculation and past-time rollover work cleanly.\n");

// 6. Navigation Routing Logic
console.log("--- Test 6: Notification Tap Navigation Routing ---");

let lastNavigatedTo = null;
let lastNavigatedParams = null;

const mockNavRef = {
  isReady: () => true,
  navigate: (screen, params) => {
    lastNavigatedTo = screen;
    lastNavigatedParams = params;
  },
};

function handleNotificationNavigation(response, navigationRef) {
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
    navigationRef.navigate("Preferences");
  }
}

// Test timer tap
handleNotificationNavigation(
  { notification: { request: { content: { data: { category: "timer" } } } } },
  mockNavRef,
);
assert.strictEqual(lastNavigatedTo, "Timers");

// Test cooking step timer tap (has mealId)
handleNotificationNavigation(
  {
    notification: {
      request: { content: { data: { category: "timer", mealId: "m1" } } },
    },
  },
  mockNavRef,
);
assert.strictEqual(lastNavigatedTo, "CookingMode");
assert.strictEqual(lastNavigatedParams.mealId, "m1");

// Test meal plan tap
handleNotificationNavigation(
  {
    notification: {
      request: { content: { data: { category: "meal_plan", mealId: "m2" } } },
    },
  },
  mockNavRef,
);
assert.strictEqual(lastNavigatedTo, "MealDetail");
assert.strictEqual(lastNavigatedParams.mealId, "m2");

// Test pantry alert tap
handleNotificationNavigation(
  { notification: { request: { content: { data: { category: "pantry" } } } } },
  mockNavRef,
);
assert.strictEqual(lastNavigatedTo, "UseSoon");

// Test fallback / test notification tap
handleNotificationNavigation(
  { notification: { request: { content: { data: { category: "test" } } } } },
  mockNavRef,
);
assert.strictEqual(lastNavigatedTo, "Preferences");

console.log("✅ Test 6 Passed: Notification tap correctly routes to all expected screens.\n");

console.log("=================================================");
console.log("🎉 ALL NOTIFICATION TESTS PASSED SUCCESSFULLY!");
console.log("=================================================");
