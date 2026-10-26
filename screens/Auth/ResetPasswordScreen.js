import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { supabase } from "../../services/supabase";
import { setPasswordRecovery, setError } from "../../store/redux/authSlice";
import CustomTextInput from "../../components/UI/CustomTextInput";
import CustomButton from "../../components/UI/CustomButton";
import FeedbackBanner from "../../components/UI/FeedbackBanner";
import CustomModal from "../../components/CustomModal";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

const ResetPasswordScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setLocalError(t("auth.enterAndConfirmPassword"));
      return;
    }

    if (password.length < 6) {
      setLocalError(t("auth.passwordLengthError"));
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(t("auth.passwordsDoNotMatch"));
      return;
    }

    setLocalError("");
    setSubmitting(true);

    if (!supabase) {
      setSubmitting(false);
      setLocalError(
        "Authentication service is not available. Please check your network connection.",
      );
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        const message = error.message || t("auth.couldNotUpdatePassword");
        setLocalError(message);
        dispatch(setError(message));
        return;
      }

      dispatch(setError(null));
      setSuccessDialog(true);
    } catch (err) {
      const message =
        err?.message ||
        t("auth.couldNotUpdatePassword") ||
        "Could not update password.";
      setLocalError(message);
      dispatch(setError(message));
    } finally {
      setSubmitting(false);
    }
  };

  const finishRecovery = () => {
    setSuccessDialog(false);
    dispatch(setPasswordRecovery(false));

    if (navigation?.canGoBack?.()) {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.accentSoft, colors.bg, colors.bg]}
        locations={[0, 0.38, 1]}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.brandMark,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View style={styles.brandIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={colors.onBrand}
              />
            </View>
            <Text style={styles.kicker}>{t("common.appName")}</Text>
          </View>

          <Text
            style={[
              styles.title,
              {
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {t("auth.chooseNewPassword")}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {t("auth.chooseNewPasswordSubtitle")}
          </Text>

          <View style={styles.card}>
            <CustomTextInput
              label={t("auth.newPassword")}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (localError) setLocalError("");
              }}
              placeholder={t("auth.passwordMinChars")}
              leftIcon="lock-closed-outline"
              secureTextEntry
              textContentType="newPassword"
              autoComplete="password-new"
              error={!!localError}
            />

            <CustomTextInput
              label={t("auth.confirmPassword")}
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v);
                if (localError) setLocalError("");
              }}
              placeholder={t("auth.reenterPasswordPlaceholder")}
              leftIcon="lock-closed-outline"
              secureTextEntry
              textContentType="newPassword"
              autoComplete="password-new"
              error={!!localError}
            />

            <FeedbackBanner
              message={localError}
              variant="error"
              onDismiss={() => setLocalError("")}
            />

            <CustomButton
              label={t("auth.updatePassword")}
              onPress={handleSubmit}
              loading={submitting}
              style={styles.submit}
              icon="checkmark-circle-outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={successDialog}
        variant="success"
        title={t("auth.passwordUpdated")}
        message={t("auth.passwordUpdatedMessage")}
        onClose={finishRecovery}
        primaryAction={{
          label: t("common.done"),
          onPress: finishRecovery,
        }}
      />
    </View>
  );
};

export default ResetPasswordScreen;

const createStyles = (colors, type, spacing, radii) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    flex: { flex: 1 },
    container: {
      flexGrow: 1,
      padding: spacing.lg,
      paddingTop: spacing.xl + spacing.md,
      justifyContent: "center",
    },
    brandMark: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    brandIcon: {
      width: 40,
      height: 40,
      borderRadius: radii.sm,
      backgroundColor: colors.brand,
      alignItems: "center",
      justifyContent: "center",
    },
    kicker: {
      ...type.label,
      color: colors.accent,
    },
    title: {
      ...type.display,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...type.body,
      marginBottom: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md + 2,
    },
    submit: {
      marginTop: spacing.lg,
    },
  });
