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
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";
import { PASSWORD_RESET_REDIRECT_URL } from "../../services/authLinking";
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

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleReset = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setLocalError("Please enter the email for your account.");
      return;
    }

    setLocalError("");
    setSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: PASSWORD_RESET_REDIRECT_URL,
    });

    setSubmitting(false);

    if (error) {
      setLocalError(error.message || "Could not send reset link.");
      return;
    }

    setSuccessDialog(true);
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
              <Ionicons name="key-outline" size={22} color={colors.surface} />
            </View>
            <Text style={styles.kicker}>Mars World Cuisine</Text>
          </View>

          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your account email and we&apos;ll send a link to reset your
            password.
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

            <FeedbackBanner
              message={localError}
              variant="error"
              onDismiss={() => setLocalError("")}
            />

            <CustomButton
              label="Send reset link"
              onPress={handleReset}
              loading={submitting}
              style={styles.submit}
              icon="send-outline"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.linkRow,
              pressed && styles.linkPressed,
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="arrow-back" size={16} color={colors.accent} />
            <Text style={styles.linkAccent}> Back to sign in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={successDialog}
        variant="success"
        title="Check your email"
        message="Open that email on this phone (not on a computer). Tap Reset password — it should open Mars World Cuisine so you can choose a new password."
        onClose={() => {
          setSuccessDialog(false);
          navigation.navigate("Login");
        }}
        primaryAction={{
          label: "Back to sign in",
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
  linkAccent: {
    ...type.heading,
    color: colors.accent,
    fontSize: 15,
  },
});
