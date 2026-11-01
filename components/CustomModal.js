import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./UI/CustomButton";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";

const CustomModal = ({
  visible,
  title,
  message,
  variant = "info",
  primaryAction,
  secondaryAction,
  onClose,
}) => {
  const { colors, shadows, radii, spacing, type } = useTheme();
  const { isRTL, t } = useLocale();
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const iconMeta = {
    success: {
      name: "checkmark-circle-outline",
      color: colors.success,
      bg: colors.successSoft,
    },
    danger: {
      name: "alert-circle-outline",
      color: colors.danger,
      bg: colors.dangerSoft,
    },
    warning: {
      name: "warning-outline",
      color: colors.warning,
      bg: colors.warningSoft,
    },
    info: {
      name: "information-circle-outline",
      color: colors.accent,
      bg: colors.accentSoft,
    },
  }[variant] || {
    name: "information-circle-outline",
    color: colors.accent,
    bg: colors.accentSoft,
  };

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
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheet,
            shadows.lift,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: iconMeta.bg,
                alignSelf: isRTL ? "flex-end" : "flex-start",
              },
            ]}
          >
            <Ionicons name={iconMeta.name} size={26} color={iconMeta.color} />
          </View>

          {title ? (
            <Text
              style={[
                styles.title,
                type.title,
                {
                  color: colors.ink,
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                  marginBottom: 8,
                  fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
                },
              ]}
            >
              {title}
            </Text>
          ) : null}
          {message ? (
            <Text
              style={[
                styles.message,
                type.body,
                {
                  color: colors.inkMuted,
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                  marginBottom: 24,
                  fontFamily: isRTL ? undefined : "DMSans_400Regular",
                },
              ]}
            >
              {message}
            </Text>
          ) : null}

          <View style={styles.actions}>
            {secondaryAction ? (
              <CustomButton
                label={secondaryAction.label}
                onPress={secondaryAction.onPress}
                variant={secondaryAction.variant || "secondary"}
                fullWidth
              />
            ) : null}
            {primaryAction ? (
              <CustomButton
                label={primaryAction.label}
                onPress={primaryAction.onPress}
                variant={primaryAction.variant || "primary"}
                fullWidth
              />
            ) : (
              <CustomButton
                label={t("common.confirm", { defaultValue: "OK" })}
                onPress={onClose}
                variant="primary"
                fullWidth
              />
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
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 8,
  },
  message: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    width: "100%",
    gap: 8,
  },
});
