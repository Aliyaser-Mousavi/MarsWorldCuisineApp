import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";
import { PASSWORD_RESET_REDIRECT_URL } from "../../services/authLinking";
import CustomTextInput from "../../components/UI/CustomTextInput";
import CustomButton from "../../components/UI/CustomButton";
import FeedbackBanner from "../../components/UI/FeedbackBanner";
import CustomModal from "../../components/CustomModal";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleReset = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setLocalError(t("auth.pleaseEnterAccountEmail"));
      return;
    }

    setLocalError("");
    setSubmitting(true);

    if (!supabase) {
      setSubmitting(false);
      setLocalError("Authentication service is not available. Please check your network connection.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: PASSWORD_RESET_REDIRECT_URL,
      });

      if (error) {
        setLocalError(error.message || t("auth.couldNotSendResetLink"));
        return;
      }

      setSuccessDialog(true);
    } catch (err) {
      setLocalError(err?.message || t("auth.couldNotSendResetLink") || "Could not send reset link.");
    } finally {
      setSubmitting(false);
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
              <Ionicons name="key-outline" size={22} color={colors.onBrand} />
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
            {t("auth.forgotPassword")}
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
            {t("auth.resetSubtitle")}
          </Text>

          <View style={styles.card}>
            <CustomTextInput
              label={t("auth.email")}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (localError) setLocalError("");
              }}
              placeholder={t("auth.emailPlaceholder")}
              leftIcon="mail-outline"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              error={!!localError}
            />

            <FeedbackBanner
              message={localError}
              variant="error"
              onDismiss={() => setLocalError("")}
            />

            <CustomButton
              label={t("auth.sendResetLink")}
              onPress={handleReset}
              loading={submitting}
              style={styles.submit}
              icon="send-outline"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.linkRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
              pressed && styles.linkPressed,
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons
              name={isRTL ? "arrow-forward" : "arrow-back"}
              size={16}
              color={colors.accent}
            />
            <Text style={styles.linkAccent}> {t("auth.backToSignIn")}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={successDialog}
        variant="success"
        title={t("auth.checkYourEmail")}
        message={t("auth.resetEmailInstructions")}
        onClose={() => {
          setSuccessDialog(false);
          navigation.navigate("Login");
        }}
        primaryAction={{
          label: t("auth.backToSignIn"),
          onPress: () => {
            setSuccessDialog(false);
            navigation.navigate("Login");
          },
        }}
      />
    </View>
  );
};

export default ForgotPasswordScreen;

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
  linkRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkAccent: {
    ...type.heading,
    color: colors.accent,
    fontSize: 15,
  },
});
