import { useState } from "react";
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
import {
  setPreference,
  resetPreferences,
  setDarkMode,
  toggleDarkMode,
} from "../store/redux/preferences";
import ThemeToggle from "../components/UI/ThemeToggle";
import { clearAuth } from "../store/redux/authSlice";
import {
  exportKitchenBackup,
  importKitchenBackup,
} from "../utils/backup";
import { supabase } from "../services/supabase";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/UI/CustomButton";
import FeedbackToast from "../components/UI/FeedbackToast";
import {
  colors,
  radii,
  spacing,
  type,
  shadows,
} from "../constants/theme";

const PreferencesScreen = () => {
  const prefs = useSelector((state) => state.preferences);
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch();
  const [busy, setBusy] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);

  const toggle = (key) => (value) =>
    dispatch(setPreference({ key, value }));

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
          title: "Backup ready",
          message: `Saved on this device at:\n${result.path}`,
          primaryAction: {
            label: "Done",
            onPress: () => setDialog(null),
          },
        });
      } else {
        showToast("Backup shared successfully.");
      }
    } catch (err) {
      setDialog({
        variant: "danger",
        title: "Export failed",
        message: err?.message || "Could not create backup.",
        primaryAction: {
          label: "Close",
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
      await supabase.auth.signOut();
      dispatch(clearAuth());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setDialog({
        variant: "danger",
        title: "Sign out failed",
        message: err?.message || "Could not sign out.",
        primaryAction: {
          label: "Close",
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
      title: "Sign out?",
      message: "You will need to sign in again to access your account.",
      secondaryAction: {
        label: "Cancel",
        variant: "secondary",
        onPress: () => setDialog(null),
      },
      primaryAction: {
        label: "Sign out",
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
        title: "Restored",
        message: result.exportedAt
          ? `Loaded backup from ${new Date(result.exportedAt).toLocaleString()}.`
          : "Your kitchen data is back on this phone.",
        primaryAction: {
          label: "Done",
          onPress: () => setDialog(null),
        },
      });
    } catch (err) {
      setDialog({
        variant: "danger",
        title: "Restore failed",
        message: err?.message || "Could not read that backup file.",
        primaryAction: {
          label: "Close",
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
      title: "Restore backup?",
      message:
        "This replaces favorites, lists, plans, pantry, cookbooks, and preferences on this phone with the file you pick.",
      secondaryAction: {
        label: "Cancel",
        variant: "secondary",
        onPress: () => setDialog(null),
      },
      primaryAction: {
        label: "Choose file",
        variant: "danger",
        onPress: performImport,
      },
    });
  };

  const onResetPreferences = () => {
    setDialog({
      variant: "warning",
      title: "Reset preferences?",
      message: "Dietary filters and default prep time will return to defaults.",
      secondaryAction: {
        label: "Cancel",
        variant: "secondary",
        onPress: () => setDialog(null),
      },
      primaryAction: {
        label: "Reset",
        variant: "danger",
        onPress: () => {
          dispatch(resetPreferences());
          setDialog(null);
          showToast("Preferences reset.");
        },
      },
    });
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "Signed in";

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.accountCard, shadows.soft]}>
          <View style={styles.accountHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>
                {(displayName || "U").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.accountMeta}>
              <Text style={styles.accountKicker}>Account</Text>
              <Text style={styles.accountTitle}>{displayName}</Text>
              {user?.email ? (
                <Text style={styles.accountEmail}>{user.email}</Text>
              ) : null}
            </View>
          </View>
          <Text style={styles.accountBody}>
            Your session is managed securely on this device.
          </Text>

          <CustomButton
            label="Sign out"
            onPress={onLogout}
            loading={busy === "logout"}
            disabled={!!busy}
            variant="outlineDanger"
            icon="log-out-outline"
          />
        </View>

        {/* Appearance & Theme Section */}
        <View style={[styles.appearanceCard, shadows.soft]}>
          <View style={styles.appearanceHeader}>
            <Text style={styles.cardTitle}>Appearance & Theme</Text>
            <Text style={styles.cardBody}>
              {prefs.darkMode
                ? "Night Kitchen is active. Warm obsidian tones reduce eye strain during cooking."
                : "Daylight Kitchen is active. Crisp parchment tones for bright environments."}
            </Text>
          </View>

          <ThemeToggle variant="card" style={styles.themeToggleRow} />

          <View style={styles.themePresetsRow}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                dispatch(setDarkMode(false));
              }}
              style={[
                styles.themePreset,
                !prefs.darkMode && styles.themePresetActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select Daylight Kitchen theme"
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
                style={[
                  styles.presetText,
                  !prefs.darkMode && styles.presetTextActive,
                ]}
              >
                Daylight
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                dispatch(setDarkMode(true));
              }}
              style={[
                styles.themePreset,
                prefs.darkMode && styles.themePresetActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select Night Kitchen theme"
            >
              <View style={[styles.presetSwatch, styles.darkSwatch]}>
                <Ionicons name="moon" size={18} color="#A5B4FC" />
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
                style={[
                  styles.presetText,
                  prefs.darkMode && styles.presetTextActive,
                ]}
              >
                Night Kitchen
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Default dietary filters</Text>
          <Text style={styles.cardBody}>
            Applied automatically when you open a category.
          </Text>

          <PrefRow
            label="Gluten-free"
            value={prefs.glutenFree}
            onChange={toggle("glutenFree")}
          />
          <PrefRow
            label="Vegan"
            value={prefs.vegan}
            onChange={toggle("vegan")}
          />
          <PrefRow
            label="Vegetarian"
            value={prefs.vegetarian}
            onChange={toggle("vegetarian")}
          />
          <PrefRow
            label="Lactose-free"
            value={prefs.lactoseFree}
            onChange={toggle("lactoseFree")}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Default max prep time</Text>
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
                    style={[
                      styles.timeText,
                      active && styles.timeTextActive,
                    ]}
                  >
                    {time === 240 ? "Any" : `${time}m`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.backupCard, shadows.soft]}>
          <Text style={styles.backupKicker}>On this phone</Text>
          <Text style={styles.backupTitle}>Kitchen backup</Text>
          <Text style={[styles.cardBody, styles.backupBody]}>
            Export a JSON file you can save to Files, Drive, or AirDrop — then
            restore anytime. Nothing leaves your device unless you share it.
          </Text>

          <CustomButton
            label="Export backup"
            onPress={onExport}
            loading={busy === "export"}
            disabled={!!busy}
            variant="accent"
            icon="share-outline"
            style={styles.backupPrimary}
          />

          <CustomButton
            label="Restore from file"
            onPress={onImport}
            loading={busy === "import"}
            disabled={!!busy}
            variant="secondary"
            icon="download-outline"
            style={styles.backupSecondary}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data on this phone</Text>
          <Text style={styles.cardBody}>
            Favorites and shopping list sync to your account when online.
            Other kitchen data stays local on this device.
          </Text>
        </View>

        <CustomButton
          label="Reset preferences"
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

      <FeedbackToast
        visible={!!toast}
        message={toast?.message}
        variant={toast?.variant || "success"}
        onHide={() => setToast(null)}
      />
    </View>
  );
};

const PrefRow = ({ label, value, onChange }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={Platform.OS === "android" ? colors.surface : undefined}
      ios_backgroundColor={colors.border}
    />
  </View>
);

export default PreferencesScreen;

const styles = StyleSheet.create({
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
    flexDirection: "row",
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
  },
  accountKicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 2,
  },
  accountTitle: {
    ...type.title,
    fontSize: 20,
    marginBottom: 2,
  },
  accountEmail: {
    ...type.caption,
    color: colors.inkMuted,
  },
  accountBody: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
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
  },
  backupTitle: {
    ...type.title,
    fontSize: 22,
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  backupBody: {
    color: colors.onBrandSoft,
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
    marginBottom: spacing.xs,
  },
  cardBody: {
    ...type.body,
    fontSize: 14,
    marginBottom: spacing.sm,
    color: colors.inkMuted,
  },
  row: {
    flexDirection: "row",
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
    flexDirection: "row",
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
    color: colors.surface,
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
});
