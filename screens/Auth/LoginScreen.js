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
import { setError } from "../../store/redux/authSlice";
import CustomTextInput from "../../components/UI/CustomTextInput";
import CustomButton from "../../components/UI/CustomButton";
import FeedbackBanner from "../../components/UI/FeedbackBanner";
import {
  colors,
  radii,
  spacing,
  type,
  shadows,
} from "../../constants/theme";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    setLocalError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    setSubmitting(false);

    if (error) {
      const message = error.message || "Could not sign in.";
      setLocalError(message);
      dispatch(setError(message));
      return;
    }

    dispatch(setError(null));
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
              <Ionicons name="restaurant-outline" size={22} color={colors.surface} />
            </View>
            <Text style={styles.kicker}>Mars World Cuisine</Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to sync your kitchen across devices.
          </Text>

          <View style={[styles.card, shadows.soft]}>
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
              placeholder="Your password"
              leftIcon="lock-closed-outline"
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              error={!!localError}
            />

            <Pressable
              style={({ pressed }) => [
                styles.forgotRow,
                pressed && styles.linkPressed,
              ]}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <FeedbackBanner
              message={localError}
              variant="error"
              onDismiss={() => setLocalError("")}
            />

            <CustomButton
              label="Sign in"
              onPress={handleLogin}
              loading={submitting}
              style={styles.submit}
              icon="arrow-forward"
              iconPosition="right"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.linkRow,
              pressed && styles.linkPressed,
            ]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.linkText}>Don&apos;t have an account?</Text>
            <Text style={styles.linkAccent}> Create one</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
