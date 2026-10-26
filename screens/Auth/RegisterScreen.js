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
import { PASSWORD_RESET_REDIRECT_URL, AUTH_EMAIL_REDIRECT_URL } from "../../services/authLinking";
import { setError } from "../../store/redux/authSlice";
import CustomTextInput from "../../components/UI/CustomTextInput";
import CustomButton from "../../components/UI/CustomButton";
import FeedbackBanner from "../../components/UI/FeedbackBanner";
import CustomModal from "../../components/CustomModal";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

const RegisterScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleRegister = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setLocalError(t("auth.pleaseFillAllFields"));
      return;
    }

    if (password.length < 6) {
      setLocalError(t("auth.passwordLengthError"));
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
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: AUTH_EMAIL_REDIRECT_URL,
          data: { full_name: trimmedName },
        },
      });

      if (error) {
        const message = error.message || t("auth.couldNotCreateAccount");
        setLocalError(message);
        dispatch(setError(message));
        return;
      }

      dispatch(setError(null));

      if (data.session) {
        return;
      }

      setConfirmDialog(true);
    } catch (err) {
      const message =
        err?.message ||
        t("auth.couldNotCreateAccount") ||
        "Could not create account. Please try again.";
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
              <Ionicons name="leaf-outline" size={22} color={colors.onBrand} />
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
            {t("auth.createAccount")}
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
            {t("auth.registerSubtitle")}
          </Text>

          <View style={styles.card}>
            <CustomTextInput
              label={t("auth.fullName")}
              value={fullName}
              onChangeText={(v) => {
                setFullName(v);
                if (localError) setLocalError("");
              }}
              placeholder={t("auth.fullNamePlaceholder")}
              leftIcon="person-outline"
              autoCapitalize="words"
              textContentType="name"
              autoComplete="name"
              error={!!localError}
            />

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
              placeholder={t("auth.passwordMinChars")}
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
              label={t("auth.createAccount")}
              onPress={handleRegister}
              loading={submitting}
              style={styles.submit}
              icon="person-add-outline"
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
            <Text style={styles.linkText}>{t("auth.alreadyHaveAccount")}</Text>
            <Text style={styles.linkAccent}> {t("auth.signIn")}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={confirmDialog}
        variant="success"
        title={t("auth.checkYourEmail")}
        message={t("auth.checkEmailMessage")}
        onClose={() => {
          setConfirmDialog(false);
          navigation.navigate("Login");
        }}
        primaryAction={{
          label: t("auth.goToSignIn"),
          onPress: () => {
            setConfirmDialog(false);
            navigation.navigate("Login");
          },
        }}
      />
    </View>
  );
};

export default RegisterScreen;

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
