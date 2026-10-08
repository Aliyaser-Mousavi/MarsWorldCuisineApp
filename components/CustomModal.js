import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./UI/CustomButton";
import {
  colors,
  radii,
  spacing,
  type,
  shadows,
} from "../constants/theme";

const getIconMeta = (variant) => {
  switch (variant) {
    case "success":
      return {
        name: "checkmark-circle-outline",
        color: colors.success,
        bg: colors.successSoft,
      };
    case "danger":
      return {
        name: "alert-circle-outline",
        color: colors.danger,
        bg: colors.dangerSoft,
      };
    case "warning":
      return {
        name: "warning-outline",
        color: colors.warning,
        bg: colors.warningSoft,
      };
    case "info":
    default:
      return {
        name: "information-circle-outline",
        color: colors.accent,
        bg: colors.accentSoft,
      };
  }
};

/**
 * Custom-styled dialog replacing system Alert.alert.
 */
const CustomModal = ({
  visible,
  title,
  message,
  variant = "info",
  primaryAction,
  secondaryAction,
  onClose,
}) => {
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const iconMeta = getIconMeta(variant);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.94);
    }
  }, [visible, opacity, scale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheet,
            shadows.lift,
            { opacity, transform: [{ scale }] },
          ]}
        >
          <View style={[styles.iconBadge, { backgroundColor: iconMeta.bg }]}>
            <Ionicons name={iconMeta.name} size={26} color={iconMeta.color} />
          </View>

          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            {secondaryAction ? (
              <CustomButton
                label={secondaryAction.label}
                onPress={secondaryAction.onPress}
                variant={secondaryAction.variant || "secondary"}
              />
            ) : null}
            {primaryAction ? (
              <CustomButton
                label={primaryAction.label}
                onPress={primaryAction.onPress}
                variant={primaryAction.variant || "primary"}
              />
            ) : (
              <CustomButton label="OK" onPress={onClose} variant="primary" />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...type.title,
    marginBottom: spacing.sm,
  },
  message: {
    ...type.body,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
});
