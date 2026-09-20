import { useState } from "react";
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
import {
  colors,
  radii,
  spacing,
  type,
  shadows,
} from "../../constants/theme";

const ResetPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setLocalError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError("");
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    setSubmitting(false);

    if (error) {
      const message = error.message || "Could not update password.";
      setLocalError(message);
      dispatch(setError(message));
      return;
    }

    dispatch(setError(null));
    setSuccessDialog(true);
  };

  const finishRecovery = () => {
    setSuccessDialog(false);
    dispatch(setPasswordRecovery(false));
    // Session is already active — AppNavigation will show the main app.
    // If somehow unauthenticated, fall back to Login.
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
          <View style={styles.brandMark}>
            <View style={styles.brandIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={colors.surface}
              />
            </View>
            <Text style={styles.kicker}>Mars World Cuisine</Text>
          </View>

          <Text style={styles.title}>Choose a new password</Text>
          <Text style={styles.subtitle}>
            Enter a new password for your account, then confirm it below.
          </Text>

          <View style={[styles.card, shadows.soft]}>
            <CustomTextInput
              label="New password"
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

            <CustomTextInput
              label="Confirm password"
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v);
                if (localError) setLocalError("");
              }}
              placeholder="Re-enter new password"
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
              label="Update password"
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
        title="Password updated"
        message="Your password has been changed. You can continue using the app."
        onClose={finishRecovery}
        primaryAction={{
          label: "Continue",
          onPress: finishRecovery,
        }}
      />
    </View>
  );
};

export default ResetPasswordScreen;

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
});
