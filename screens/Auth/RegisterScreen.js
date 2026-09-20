import { useState } from "react";
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
import {
  colors,
  radii,
  spacing,
  type,
  shadows,
} from "../../constants/theme";

const RegisterScreen = ({ navigation }) => {
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
      setLocalError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLocalError("");
    setSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: AUTH_EMAIL_REDIRECT_URL,
        data: { full_name: trimmedName },
      },
    });

    setSubmitting(false);

    if (error) {
      const message = error.message || "Could not create account.";
      setLocalError(message);
      dispatch(setError(message));
      return;
    }

    dispatch(setError(null));

    if (data.session) {
      return;
    }

    setConfirmDialog(true);
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
          <View style={styles.brandMark}>
            <View style={styles.brandIcon}>
              <Ionicons name="leaf-outline" size={22} color={colors.surface} />
            </View>
            <Text style={styles.kicker}>Mars World Cuisine</Text>
          </View>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Save your favorites, meal plans, and kitchen data to your account.
          </Text>

          <View style={[styles.card, shadows.soft]}>
            <CustomTextInput
              label="Full name"
              value={fullName}
              onChangeText={(v) => {
                setFullName(v);
                if (localError) setLocalError("");
              }}
              placeholder="Your name"
              leftIcon="person-outline"
              autoCapitalize="words"
              textContentType="name"
              autoComplete="name"
              error={!!localError}
            />

            <CustomTextInput
              label="Email"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (localError) setLocalError("");
              }}
              placeholder="you@example.com"
              leftIcon="mail-outline"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              error={!!localError}
            />

            <CustomTextInput
              label="Password"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (localError) setLocalError("");
              }}
              placeholder="At least 6 characters"
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
              label="Create account"
              onPress={handleRegister}
              loading={submitting}
              style={styles.submit}
              icon="person-add-outline"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.linkRow,
              pressed && styles.linkPressed,
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>Already have an account?</Text>
            <Text style={styles.linkAccent}> Sign in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={confirmDialog}
        variant="success"
        title="Check your email"
        message="We sent a confirmation link. Verify your email, then sign in."
        onClose={() => {
          setConfirmDialog(false);
          navigation.navigate("Login");
        }}
        primaryAction={{
          label: "Go to sign in",
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

const styles = StyleSheet.create({
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
