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
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";
import { setError } from "../../store/redux/authSlice";
import CustomTextInput from "../../components/UI/CustomTextInput";
import CustomButton from "../../components/UI/CustomButton";
import FeedbackBanner from "../../components/UI/FeedbackBanner";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

const LoginScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setLocalError(t("auth.pleaseEnterEmailAndPassword"));
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
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        const message = error.message || t("auth.couldNotSignIn");
        setLocalError(message);
        dispatch(setError(message));
        return;
      }

      dispatch(setError(null));
    } catch (err) {
      const message =
        err?.message ||
        t("auth.couldNotSignIn") ||
        "Could not sign in. Please try again.";
      setLocalError(message);
      dispatch(setError(message));
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
              <Ionicons
                name="restaurant-outline"
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
            {t("auth.welcomeBack")}
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
            {t("auth.signInSubtitle")}
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

            <CustomTextInput
              label={t("auth.password")}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (localError) setLocalError("");
              }}
              placeholder={t("auth.passwordPlaceholder")}
              leftIcon="lock-closed-outline"
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              error={!!localError}
            />

            <Pressable
              style={({ pressed }) => [
                styles.forgotRow,
                { alignSelf: isRTL ? "flex-start" : "flex-end" },
                pressed && styles.linkPressed,
              ]}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>
                {t("auth.forgotPasswordQuestion")}
              </Text>
            </Pressable>

            <FeedbackBanner
              message={localError}
              variant="error"
              onDismiss={() => setLocalError("")}
            />

            <CustomButton
              label={t("auth.signIn")}
              onPress={handleLogin}
              loading={submitting}
              style={styles.submit}
              icon={isRTL ? "arrow-back" : "arrow-forward"}
              iconPosition={isRTL ? "left" : "right"}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.linkRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
              pressed && styles.linkPressed,
            ]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.linkText}>
              {t("auth.dontHaveAccount")}
            </Text>
            <Text style={styles.linkAccent}> {t("auth.createOne")}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  forgotText: {
    ...type.label,
    color: colors.accent,
  },
  submit: {
    marginTop: spacing.md,
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
  linkText: {
    ...type.body,
    color: colors.inkMuted,
  },
  linkAccent: {
    ...type.heading,
    color: colors.accent,
    fontSize: 15,
  },
});
