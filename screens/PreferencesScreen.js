import { useState, useMemo } from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import { setPreference, resetPreferences } from "../store/redux/preferences";

import ThemeToggle from "../components/UI/ThemeToggle";

import { clearAuth } from "../store/redux/authSlice";

import { exportKitchenBackup, importKitchenBackup } from "../utils/backup";

import { supabase } from "../services/supabase";

import CustomModal from "../components/CustomModal";

import CustomButton from "../components/UI/CustomButton";

import FeedbackToast from "../components/UI/FeedbackToast";

import NotificationCenterModal from "../components/NotificationCenterModal";

import { setNotificationSetting } from "../store/redux/notifications";

import {
  sendTestNotification,
  requestNotificationPermissions,
  syncMealPlanReminders,
  syncPantryExpirationAlerts,
  cancelUserScopedNotifications,
} from "../services/notificationService";

import { useNavigation } from "@react-navigation/native";

import { toPersianDigits } from "../utils/formatters";

import { useTheme } from "../constants/theme";

import { useLocale } from "../constants/locale";

const PreferencesScreen = () => {
  const { isDark, colors, type, spacing, radii, setDarkMode } = useTheme();

  const { t, language, isRTL, changeLanguage, requestAppRestart } = useLocale();

  const prefs = useSelector((state) => state.preferences);

  const user = useSelector((state) => state.auth.user);

  const profile = useSelector((state) => state.auth.profile);

  const notifSettings = useSelector(
    (state) => state.notifications?.settings || {},
  );

  const notifHistory = useSelector(
    (state) => state.notifications?.history || [],
  );

  const notifPermission = useSelector(
    (state) => state.notifications?.permission || "undetermined",
  );

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [busy, setBusy] = useState(null);

  const [dialog, setDialog] = useState(null);

  const [toast, setToast] = useState(null);

  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),

    [colors, type, spacing, radii, isRTL],
  );

  const onToggleNotif = (key) => (value) => {
    Haptics.selectionAsync();

    dispatch(setNotificationSetting({ key, value }));

    if (key === "mealPlanReminders" || key === "enabled") {
      const isEnabled =
        key === "enabled" ? value : notifSettings.enabled && value;

      syncMealPlanReminders({ enabled: isEnabled }).catch(() => {});
    }

    if (key === "pantryAlerts" || key === "enabled") {
      const isEnabled =
        key === "enabled" ? value : notifSettings.enabled && value;

      syncPantryExpirationAlerts({ enabled: isEnabled }).catch(() => {});
    }
  };

  const onSelectMealPlanTime = (time) => {
    Haptics.selectionAsync();

    dispatch(setNotificationSetting({ key: "mealPlanTime", value: time }));

    syncMealPlanReminders({ timePreference: time }).catch(() => {});
  };

  const onSendTestNotification = async () => {
    try {
      setBusy("testNotif");

      const res = await sendTestNotification({ language });

      if (res === "permission_denied") {
        showToast(t("notifications.permissionDenied"), "danger");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      showToast(err?.message || "Failed to send notification", "danger");
    } finally {
      setBusy(null);
    }
  };

  const onRequestPermission = async () => {
    Haptics.selectionAsync();

    const status = await requestNotificationPermissions();

    if (status === "granted") {
      showToast(
        language === "fa" ? "دسترسی اعلان‌ها فعال شد" : "Notifications enabled",
      );
    } else {
      showToast(t("notifications.permissionDenied"), "danger");
    }
  };

  const handleHistoryNavigation = (item) => {
    const category = item?.category;

    const data = item?.data || {};

    if (category === "timer") {
      if (data?.mealId) {
        navigation.navigate("CookingMode", { mealId: data.mealId });
      } else {
        navigation.navigate("Timers");
      }
    } else if (category === "meal_plan") {
      if (data?.mealId) {
        navigation.navigate("MealDetail", { mealId: data.mealId });
      } else {
        navigation.navigate("MealPlan");
      }
    } else if (category === "pantry") {
      navigation.navigate("UseSoon");
    } else if (category === "quest") {
      navigation.navigate("Quests");
    }
  };

  const onSelectLanguage = (targetLang) => {
    if (targetLang === language) return;

    Haptics.selectionAsync();

    changeLanguage(targetLang);

    showToast(
      targetLang === "fa"
        ? "زبان برنامه به فارسی تغییر کرد"
        : "Language changed to English",

      "success",
    );
  };

  const toggle = (key) => (value) => dispatch(setPreference({ key, value }));

  const showToast = (message, variant = "success") => {
    setToast({ message, variant });
  };

  const onExport = async () => {
    try {
      setBusy("export");

      const result = await exportKitchenBackup();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (!result.shared) {
        setDialog({
          variant: "success",

          title: t("preferences.backupReady"),

          message: t("preferences.savedOnDevice", { path: result.path }),

          primaryAction: {
            label: t("common.done"),

            onPress: () => setDialog(null),
          },
        });
      } else {
        showToast(t("preferences.backupSharedSuccess"));
      }
    } catch (err) {
      setDialog({
        variant: "danger",

        title: t("preferences.exportFailed"),

        message: err?.message || t("preferences.couldNotCreateBackup"),

        primaryAction: {
          label: t("common.close"),

          onPress: () => setDialog(null),
        },
      });
    } finally {
      setBusy(null);
    }
  };

  const performLogout = async () => {
    setDialog(null);

    try {
      setBusy("logout");

      cancelUserScopedNotifications().catch(() => {});

      if (supabase) await supabase.auth.signOut();

      dispatch(clearAuth());

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setDialog({
        variant: "danger",

        title: t("preferences.signOutFailed"),

        message: err?.message || t("preferences.couldNotSignOut"),

        primaryAction: {
          label: t("common.close"),

          onPress: () => setDialog(null),
        },
      });
    } finally {
      setBusy(null);
    }
  };

  const onLogout = () => {
    setDialog({
      variant: "warning",

      title: t("preferences.signOutQuestion"),

      message: t("preferences.signOutWarning"),

      secondaryAction: {
        label: t("common.cancel"),

        variant: "secondary",

        onPress: () => setDialog(null),
      },

      primaryAction: {
        label: t("preferences.signOut"),

        variant: "danger",

        onPress: performLogout,
      },
    });
  };

  const performImport = async () => {
    setDialog(null);

    try {
      setBusy("import");

      const result = await importKitchenBackup();

      if (result.canceled) return;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setDialog({
        variant: "success",

        title: t("preferences.restored"),

        message: result.exportedAt
          ? t("preferences.loadedBackupFrom", {
              date: new Date(result.exportedAt).toLocaleString(),
            })
          : t("preferences.kitchenDataBack"),

        primaryAction: {
          label: t("common.done"),

          onPress: () => setDialog(null),
        },
      });
    } catch (err) {
      setDialog({
        variant: "danger",

        title: t("preferences.restoreFailed"),

        message: err?.message || t("preferences.couldNotReadBackup"),

        primaryAction: {
          label: t("common.close"),

          onPress: () => setDialog(null),
        },
      });
    } finally {
      setBusy(null);
    }
  };

  const onImport = () => {
    setDialog({
      variant: "warning",

      title: t("preferences.restoreBackupQuestion"),

      message: t("preferences.restoreBackupWarning"),

      secondaryAction: {
        label: t("common.cancel"),

        variant: "secondary",

        onPress: () => setDialog(null),
      },

      primaryAction: {
        label: t("preferences.chooseFile"),

        variant: "danger",

        onPress: performImport,
      },
    });
  };

  const onResetPreferences = () => {
    setDialog({
      variant: "warning",

      title: t("preferences.resetPreferencesQuestion"),

      message: t("preferences.resetPreferencesWarning"),

      secondaryAction: {
        label: t("common.cancel"),

        variant: "secondary",

        onPress: () => setDialog(null),
      },

      primaryAction: {
        label: t("common.reset"),

        variant: "danger",

        onPress: () => {
          dispatch(resetPreferences());

          setDialog(null);

          showToast(t("preferences.preferencesResetToast"));
        },
      },
    });
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    t("preferences.account");

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>
                {(displayName || "U").charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.accountMeta}>
              <Text style={styles.accountKicker}>
                {t("preferences.account")}
              </Text>

              <Text style={styles.accountTitle}>{displayName}</Text>

              {user?.email ? (
                <Text style={styles.accountEmail}>{user.email}</Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.accountBody}>
            {t("preferences.sessionManagedSecurely")}
          </Text>

          <CustomButton
            label={t("preferences.signOut")}
            onPress={onLogout}
            loading={busy === "logout"}
            disabled={!!busy}
            variant="outlineDanger"
            icon="log-out-outline"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("preferences.languageSection")}
          </Text>

          <Text style={styles.cardBody}>{t("preferences.languageBody")}</Text>

          <View style={styles.langRow}>
            <Pressable
              onPress={() => onSelectLanguage("en")}
              style={[
                styles.langBtn,

                language === "en" && styles.langBtnActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select English"
            >
              <Ionicons
                name="globe-outline"
                size={18}
                color={language === "en" ? colors.onBrand : colors.ink}
              />

              <Text
                style={[
                  styles.langBtnText,

                  language === "en" && styles.langBtnTextActive,
                ]}
              >
                {t("preferences.english")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onSelectLanguage("fa")}
              style={[
                styles.langBtn,

                language === "fa" && styles.langBtnActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="انتخاب فارسی"
            >
              <Ionicons
                name="globe-outline"
                size={18}
                color={language === "fa" ? colors.onBrand : colors.ink}
              />

              <Text
                style={[
                  styles.langBtnText,

                  language === "fa" && styles.langBtnTextActive,
                ]}
              >
                {t("preferences.persian")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.appearanceCard}>
          <View style={styles.appearanceHeader}>
            <Text style={styles.cardTitle}>
              {t("preferences.appearanceAndTheme")}
            </Text>

            <Text style={styles.cardBody}>
              {isDark
                ? t("preferences.nightKitchenActive")
                : t("preferences.daylightKitchenActive")}
            </Text>
          </View>

          <ThemeToggle variant="card" style={styles.themeToggleRow} />

          <View style={styles.themePresetsRow}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();

                setDarkMode(false);
              }}
              style={[styles.themePreset, !isDark && styles.themePresetActive]}
              accessibilityRole="button"
              accessibilityLabel={t("preferences.selectDaylightTheme")}
            >
              <View style={[styles.presetSwatch, styles.lightSwatch]}>
                <Ionicons name="sunny" size={18} color="#D97706" />

                <View style={styles.swatchMiniRow}>
                  <View
                    style={[styles.swatchDot, { backgroundColor: "#3D5A45" }]}
                  />

                  <View
                    style={[styles.swatchDot, { backgroundColor: "#1A1410" }]}
                  />
                </View>
              </View>

              <Text
                style={[styles.presetText, !isDark && styles.presetTextActive]}
              >
                {t("preferences.daylightLabel")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();

                setDarkMode(true);
              }}
              style={[styles.themePreset, isDark && styles.themePresetActive]}
              accessibilityRole="button"
              accessibilityLabel={t("preferences.selectNightTheme")}
            >
              <View style={[styles.presetSwatch, styles.darkSwatch]}>
                <Ionicons name="moon" size={18} color={colors.accent} />

                <View style={styles.swatchMiniRow}>
                  <View
                    style={[styles.swatchDot, { backgroundColor: "#5E8B68" }]}
                  />

                  <View
                    style={[styles.swatchDot, { backgroundColor: "#F5F2ED" }]}
                  />
                </View>
              </View>

              <Text
                style={[styles.presetText, isDark && styles.presetTextActive]}
              >
                {t("preferences.nightKitchenLabel")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("preferences.defaultDietaryFilters")}
          </Text>

          <Text style={styles.cardBody}>
            {t("preferences.appliedAutomatically")}
          </Text>

          <PrefRow
            label={t("preferences.glutenFree")}
            value={prefs.glutenFree}
            onChange={toggle("glutenFree")}
            colors={colors}
            styles={styles}
            isRTL={isRTL}
          />

          <PrefRow
            label={t("preferences.vegan")}
            value={prefs.vegan}
            onChange={toggle("vegan")}
            colors={colors}
            styles={styles}
            isRTL={isRTL}
          />

          <PrefRow
            label={t("preferences.vegetarian")}
            value={prefs.vegetarian}
            onChange={toggle("vegetarian")}
            colors={colors}
            styles={styles}
            isRTL={isRTL}
          />

          <PrefRow
            label={t("preferences.lactoseFree")}
            value={prefs.lactoseFree}
            onChange={toggle("lactoseFree")}
            colors={colors}
            styles={styles}
            isRTL={isRTL}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("preferences.defaultMaxPrepTime")}
          </Text>

          <View style={styles.durationRow}>
            {[30, 60, 120, 240].map((time) => {
              const active = prefs.defaultMaxDuration === time;

              return (
                <Pressable
                  key={time}
                  style={({ pressed }) => [
                    styles.timeBtn,

                    active && styles.timeBtnActive,

                    pressed && styles.timeBtnPressed,
                  ]}
                  onPress={() =>
                    dispatch(
                      setPreference({ key: "defaultMaxDuration", value: time }),
                    )
                  }
                >
                  <Text
                    style={[styles.timeText, active && styles.timeTextActive]}
                  >
                    {time === 240
                      ? t("preferences.anyTime")
                      : t("preferences.minutesShort", { time })}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.notifHeader,

              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.notifIconWrap,

                { backgroundColor: colors.accentSoft },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.accent}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {t("notifications.settingsTitle")}
              </Text>

              <Text style={styles.cardBody}>
                {t("notifications.settingsSubtitle")}
              </Text>
            </View>
          </View>

          {notifPermission === "denied" && (
            <View
              style={[
                styles.permissionBanner,

                {
                  backgroundColor: colors.dangerSoft,

                  borderColor: colors.danger,
                },
              ]}
            >
              <Ionicons name="alert-circle" size={18} color={colors.danger} />

              <View style={{ flex: 1 }}>
                <Text style={[styles.permissionText, { color: colors.danger }]}>
                  {t("notifications.permissionDeniedDesc")}
                </Text>
              </View>

              <Pressable
                onPress={onRequestPermission}
                style={[
                  styles.permissionBtn,

                  { backgroundColor: colors.danger },
                ]}
              >
                <Text style={styles.permissionBtnText}>
                  {t("common.confirm")}
                </Text>
              </Pressable>
            </View>
          )}

          <PrefRow
            label={t("notifications.masterToggle")}
            value={notifSettings.enabled}
            onChange={onToggleNotif("enabled")}
            colors={colors}
            styles={styles}
            isRTL={isRTL}
          />

          {notifSettings.enabled && (
            <>
              <PrefRow
                label={t("notifications.timerAlerts")}
                value={notifSettings.timerAlerts}
                onChange={onToggleNotif("timerAlerts")}
                colors={colors}
                styles={styles}
                isRTL={isRTL}
              />

              <PrefRow
                label={t("notifications.mealPlanReminders")}
                value={notifSettings.mealPlanReminders}
                onChange={onToggleNotif("mealPlanReminders")}
                colors={colors}
                styles={styles}
                isRTL={isRTL}
              />

              {notifSettings.mealPlanReminders && (
                <View style={styles.notifSubSection}>
                  <Text
                    style={[
                      styles.subLabel,

                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                  >
                    {t("notifications.mealPlanTime")}
                  </Text>

                  <View style={styles.durationRow}>
                    {["17:00", "18:00", "18:30", "19:00", "20:00"].map(
                      (timeStr) => {
                        const active = notifSettings.mealPlanTime === timeStr;

                        const displayTime = isRTL
                          ? toPersianDigits(timeStr)
                          : timeStr;

                        return (
                          <Pressable
                            key={timeStr}
                            style={({ pressed }) => [
                              styles.timeBtn,

                              active && styles.timeBtnActive,

                              pressed && styles.timeBtnPressed,
                            ]}
                            onPress={() => onSelectMealPlanTime(timeStr)}
                          >
                            <Text
                              style={[
                                styles.timeText,

                                active && styles.timeTextActive,
                              ]}
                            >
                              {displayTime}
                            </Text>
                          </Pressable>
                        );
                      },
                    )}
                  </View>
                </View>
              )}

              <PrefRow
                label={t("notifications.pantryAlerts")}
                value={notifSettings.pantryAlerts}
                onChange={onToggleNotif("pantryAlerts")}
                colors={colors}
                styles={styles}
                isRTL={isRTL}
              />

              <View style={styles.notifActions}>
                <CustomButton
                  label={t("notifications.sendTest")}
                  onPress={onSendTestNotification}
                  loading={busy === "testNotif"}
                  disabled={!!busy}
                  variant="accent"
                  icon="paper-plane-outline"
                  style={styles.notifPrimaryButton}
                />
                <Pressable
                  onPress={() => setShowNotificationCenter(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("notifications.historyTitle")}
                  style={({ pressed }) => [
                    styles.notifHistoryButton,
                    pressed && styles.notifHistoryButtonPressed,
                  ]}
                >
                  <View style={styles.notifHistoryIcon}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.notifHistoryCopy}>
                    <Text style={styles.notifHistoryTitle}>
                      {t("notifications.historyTitle")}
                    </Text>
                    <Text style={styles.notifHistorySubtitle}>
                      {language === "fa"
                        ? "مشاهده اعلان‌های قبلی"
                        : "View past notifications"}
                    </Text>
                  </View>
                  {notifHistory.filter((h) => !h.read).length > 0 && (
                    <View style={styles.notifUnreadBadge}>
                      <Text style={styles.notifUnreadBadgeText}>
                        {isRTL
                          ? toPersianDigits(
                              notifHistory.filter((h) => !h.read).length,
                            )
                          : notifHistory.filter((h) => !h.read).length}
                      </Text>
                    </View>
                  )}
                  <Ionicons
                    name={isRTL ? "chevron-back" : "chevron-forward"}
                    size={18}
                    color={colors.inkMuted}
                  />
                </Pressable>
              </View>
            </>
          )}
        </View>

        <View style={styles.backupCard}>
          <Text style={styles.backupKicker}>
            {t("preferences.onThisPhone")}
          </Text>

          <Text style={styles.backupTitle}>
            {t("preferences.kitchenBackup")}
          </Text>

          <Text style={[styles.cardBody, styles.backupBody]}>
            {t("preferences.kitchenBackupBody")}
          </Text>

          <CustomButton
            label={t("preferences.exportBackup")}
            onPress={onExport}
            loading={busy === "export"}
            disabled={!!busy}
            variant="accent"
            icon="share-outline"
            style={styles.backupPrimary}
          />

          <CustomButton
            label={t("preferences.restoreFromFile")}
            onPress={onImport}
            loading={busy === "import"}
            disabled={!!busy}
            variant="secondary"
            icon="download-outline"
            style={styles.backupSecondary}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("preferences.dataOnThisPhone")}
          </Text>

          <Text style={styles.cardBody}>
            {t("preferences.syncDescription")}
          </Text>
        </View>

        <CustomButton
          label={t("preferences.resetPreferencesBtn")}
          onPress={onResetPreferences}
          variant="ghost"
          style={styles.resetBtn}
          textStyle={styles.resetText}
        />
      </ScrollView>

      <CustomModal
        visible={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        variant={dialog?.variant || "info"}
        primaryAction={dialog?.primaryAction}
        secondaryAction={dialog?.secondaryAction}
        onClose={() => setDialog(null)}
      />

      <NotificationCenterModal
        visible={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onNavigate={(item) => {
          setShowNotificationCenter(false);

          handleHistoryNavigation(item);
        }}
      />

      <FeedbackToast
        visible={!!toast}
        message={toast?.message}
        variant={toast?.variant || "success"}
        onHide={() => setToast(null)}
      />
    </View>
  );
};

const PrefRow = ({ label, value, onChange, colors, styles, isRTL }) => (
  <View style={[styles.row, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
    <Text
      style={[
        styles.rowLabel,

        {
          textAlign: isRTL ? "right" : "left",

          writingDirection: isRTL ? "rtl" : "ltr",

          fontFamily: isRTL ? undefined : "DMSans_400Regular",
        },
      ]}
    >
      {label}
    </Text>

    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={Platform.OS === "android" ? colors.onBrand : undefined}
      ios_backgroundColor={colors.border}
    />
  </View>
);

export default PreferencesScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
    root: {
      flex: 1,

      backgroundColor: colors.bg,
    },

    container: {
      flex: 1,

      backgroundColor: colors.bg,
    },

    content: {
      padding: spacing.md,

      paddingBottom: spacing.xl,
    },

    accountCard: {
      backgroundColor: colors.surface,

      borderRadius: radii.lg,

      borderWidth: 1,

      borderColor: colors.border,

      padding: spacing.md,

      marginBottom: spacing.md,
    },

    accountHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",

      alignItems: "center",

      gap: spacing.md,

      marginBottom: spacing.sm,
    },

    avatar: {
      width: 52,

      height: 52,

      borderRadius: radii.md,

      backgroundColor: colors.accentSoft,

      alignItems: "center",

      justifyContent: "center",
    },

    avatarLetter: {
      ...type.title,

      fontSize: 22,

      color: colors.accent,
    },

    accountMeta: {
      flex: 1,

      alignItems: isRTL ? "flex-end" : "flex-start",
    },

    accountKicker: {
      ...type.label,

      color: colors.accent,

      marginBottom: 2,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    accountTitle: {
      ...type.title,

      fontSize: 20,

      color: colors.ink,

      marginBottom: 2,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    accountEmail: {
      ...type.caption,

      color: colors.inkMuted,

      textAlign: isRTL ? "right" : "left",
    },

    accountBody: {
      ...type.body,

      fontSize: 14,

      color: colors.inkMuted,

      marginBottom: spacing.md,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    card: {
      backgroundColor: colors.surface,

      borderRadius: radii.md,

      borderWidth: 1,

      borderColor: colors.border,

      padding: spacing.md,

      marginBottom: spacing.md,
    },

    langRow: {
      flexDirection: isRTL ? "row-reverse" : "row",

      gap: spacing.md,

      marginTop: spacing.xs,
    },

    langBtn: {
      flex: 1,

      flexDirection: isRTL ? "row-reverse" : "row",

      alignItems: "center",

      justifyContent: "center",

      gap: spacing.sm,

      paddingVertical: spacing.sm + 4,

      borderRadius: radii.md,

      backgroundColor: colors.bg,

      borderWidth: 1.5,

      borderColor: colors.border,
    },

    langBtnActive: {
      backgroundColor: colors.brand,

      borderColor: colors.brand,
    },

    langBtnText: {
      ...type.label,

      fontSize: 14,

      color: colors.ink,
    },

    langBtnTextActive: {
      color: colors.onBrand,

      fontFamily: isRTL ? undefined : "DMSans_600SemiBold",
    },

    backupCard: {
      backgroundColor: colors.brand,

      borderRadius: radii.lg,

      padding: spacing.md,

      marginBottom: spacing.md,
    },

    backupKicker: {
      ...type.label,

      color: colors.onBrandMuted,

      marginBottom: spacing.xs,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    backupTitle: {
      ...type.title,

      fontSize: 22,

      color: colors.onBrand,

      marginBottom: spacing.sm,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    backupBody: {
      color: colors.onBrandSoft,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    backupPrimary: {
      marginTop: spacing.sm,
    },

    backupSecondary: {
      marginTop: spacing.sm,
    },

    cardTitle: {
      ...type.heading,

      fontSize: 15,

      color: colors.ink,

      marginBottom: spacing.xs,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    cardBody: {
      ...type.body,

      fontSize: 14,

      marginBottom: spacing.sm,

      color: colors.inkMuted,

      textAlign: isRTL ? "right" : "left",

      writingDirection: isRTL ? "rtl" : "ltr",
    },

    row: {
      justifyContent: "space-between",

      alignItems: "center",

      paddingVertical: spacing.sm + 4,

      borderTopWidth: StyleSheet.hairlineWidth,

      borderTopColor: colors.border,
    },

    rowLabel: {
      ...type.body,

      color: colors.ink,
    },

    durationRow: {
      flexDirection: isRTL ? "row-reverse" : "row",

      gap: spacing.sm,

      marginTop: spacing.sm,
    },

    timeBtn: {
      flex: 1,

      paddingVertical: spacing.sm + 2,

      borderRadius: radii.sm,

      backgroundColor: colors.bg,

      alignItems: "center",

      borderWidth: 1,

      borderColor: colors.border,
    },

    timeBtnActive: {
      backgroundColor: colors.brand,

      borderColor: colors.brand,
    },

    timeBtnPressed: {
      opacity: 0.85,
    },

    timeText: {
      ...type.label,

      color: colors.ink,
    },

    timeTextActive: {
      color: colors.onBrand,
    },

    resetBtn: {
      marginTop: spacing.xs,
    },

    resetText: {
      color: colors.danger,
    },

    appearanceCard: {
      backgroundColor: colors.surface,

      borderRadius: radii.lg,

      borderWidth: 1,

      borderColor: colors.border,

      padding: spacing.md,

      marginBottom: spacing.md,
    },

    appearanceHeader: {
      marginBottom: spacing.sm,
    },

    themeToggleRow: {
      marginBottom: spacing.md,
    },

    themePresetsRow: {
      flexDirection: "row",

      gap: spacing.md,
    },

    themePreset: {
      flex: 1,

      padding: spacing.sm + 4,

      borderRadius: radii.md,

      backgroundColor: colors.bg,

      borderWidth: 1.5,

      borderColor: colors.border,

      alignItems: "center",
    },

    themePresetActive: {
      borderColor: colors.accent,

      backgroundColor: colors.accentSoft,
    },

    presetSwatch: {
      width: "100%",

      height: 48,

      borderRadius: radii.sm,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "space-between",

      paddingHorizontal: spacing.sm + 2,

      marginBottom: spacing.xs + 2,
    },

    lightSwatch: {
      backgroundColor: "#F2F0ED",

      borderWidth: 1,

      borderColor: "#E5E1DC",
    },

    darkSwatch: {
      backgroundColor: "#12100E",

      borderWidth: 1,

      borderColor: "#2D2621",
    },

    swatchMiniRow: {
      flexDirection: "row",

      gap: 4,
    },

    swatchDot: {
      width: 10,

      height: 10,

      borderRadius: radii.pill,
    },

    presetText: {
      ...type.label,

      fontSize: 13,

      color: colors.inkMuted,
    },

    presetTextActive: {
      color: colors.ink,

      fontFamily: "DMSans_600SemiBold",
    },

    notifHeader: {
      alignItems: "center",

      gap: spacing.sm,

      marginBottom: spacing.xs,
    },

    notifIconWrap: {
      width: 36,

      height: 36,

      borderRadius: radii.md,

      alignItems: "center",

      justifyContent: "center",
    },

    notifSubSection: {
      paddingVertical: spacing.sm,

      borderTopWidth: StyleSheet.hairlineWidth,

      borderTopColor: colors.border,
    },

    subLabel: {
      ...type.label,

      fontSize: 13,

      color: colors.inkMuted,

      marginBottom: spacing.xs,
    },

    notifActions: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    notifPrimaryButton: {
      width: "100%",
      minHeight: 50,
      borderRadius: radii.md,
    },
    notifHistoryButton: {
      minHeight: 68,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
    },
    notifHistoryButtonPressed: {
      opacity: 0.78,
    },
    notifHistoryIcon: {
      width: 38,
      height: 38,
      borderRadius: radii.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentSoft,
    },
    notifHistoryCopy: {
      flex: 1,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    notifHistoryTitle: {
      ...type.label,
      color: colors.ink,
      fontSize: 14,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    notifHistorySubtitle: {
      ...type.caption,
      color: colors.inkMuted,
      fontSize: 12,
      marginTop: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    notifUnreadBadge: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 6,
      borderRadius: radii.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
    },
    notifUnreadBadgeText: {
      ...type.label,
      color: colors.onBrand,
      fontSize: 11,
    },
    permissionBanner: {
      flexDirection: isRTL ? "row-reverse" : "row",

      alignItems: "center",

      gap: spacing.sm,

      padding: spacing.sm + 2,

      borderRadius: radii.md,

      borderWidth: 1,

      marginBottom: spacing.sm,
    },

    permissionText: {
      ...type.caption,

      fontSize: 12,

      textAlign: isRTL ? "right" : "left",
    },

    permissionBtn: {
      paddingHorizontal: spacing.sm + 2,

      paddingVertical: spacing.xs,

      borderRadius: radii.sm,
    },

    permissionBtnText: {
      ...type.label,

      fontSize: 11,

      color: "#FFFFFF",
    },
  });
