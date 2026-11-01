import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";

const TECH_STACK = [
  "React Native",
  "Expo",
  "React.js",
  "Next.js",
  "JavaScript (ES6+)",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Redux Toolkit",
  "REST APIs",
];

const CONTACTS = [
  {
    key: "portfolio",
    icon: "globe-outline",
    url: "https://aliyaser-mousavi-portfolio.onrender.com/",
    staticSubtitle: null,
  },
  {
    key: "email",
    icon: "mail-outline",
    url: "mailto:aliyasermousavi@gmail.com",
    staticSubtitle: "aliyasermousavi@gmail.com",
  },
  {
    key: "whatsapp",
    icon: "logo-whatsapp",
    url: "https://wa.me/93782899827",
    staticSubtitle: "+93 782 899 827",
  },
  {
    key: "telegram",
    icon: "paper-plane-outline",
    url: "https://t.me/+93782899827",
    staticSubtitle: "+93 782 899 827",
  },
  {
    key: "phone",
    icon: "call-outline",
    url: "tel:+93782899827",
    staticSubtitle: "+93 782 899 827",
  },
];

async function openLink(url) {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  } catch {
    // Ignore — device may not support the scheme.
  }
}

const AboutDeveloperScreen = () => {
  const { colors, type, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 20,
  );
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL, topInset),
    [colors, type, spacing, radii, isRTL, topInset],
  );
  const [isImageVisible, setIsImageVisible] = useState(false);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setIsImageVisible(true);
          }}
          style={styles.avatarWrapper}
          accessibilityRole="button"
          accessibilityLabel="View full photo"
        >
          <Image
            source={require("../assets/creator.png")}
            style={styles.avatar}
            accessibilityLabel={t("aboutDeveloper.title")}
          />
          <View style={styles.avatarBadge}>
            <Ionicons name="checkmark-sharp" size={14} color="#fff" />
          </View>
        </Pressable>

        <Modal
          visible={isImageVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setIsImageVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setIsImageVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
            <Pressable
              style={styles.modalImageContainer}
              onPress={() => setIsImageVisible(false)}
            >
              <Image
                source={require("../assets/creator.png")}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </Modal>

        <Text style={styles.name}>{t("aboutDeveloper.title")}</Text>
        <Text style={styles.title}>{t("aboutDeveloper.role")}</Text>

        <View style={styles.badgeRowContainer}>
          <View style={styles.noteChip}>
            <Ionicons
              name="code-slash-outline"
              size={15}
              color={colors.accent}
            />
            <Text style={styles.noteText}>{t("aboutDeveloper.badge")}</Text>
          </View>
        </View>

        <View style={styles.statusChip}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {t("aboutDeveloper.status", {
              defaultValue: "Available for innovative projects",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardKicker}>{t("aboutDeveloper.aboutKicker")}</Text>
        <Text style={styles.cardTitle}>{t("aboutDeveloper.bioTitle")}</Text>
        <Text style={styles.bio}>{t("aboutDeveloper.bio")}</Text>

        <Text style={styles.stackLabel}>{t("aboutDeveloper.techStack")}</Text>
        <View style={styles.badgeRow}>
          {TECH_STACK.map((tech) => (
            <View key={tech} style={styles.badge}>
              <Text style={styles.badgeText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.supportCard,
          pressed && styles.supportCardPressed,
        ]}
        onPress={() => openLink("https://www.marscoders.tech/")}
        accessibilityRole="link"
        accessibilityLabel={`${t("aboutDeveloper.supportedBy")} - https://www.marscoders.tech/`}
      >
        <View style={styles.supportIcon}>
          <Ionicons name="sparkles" size={20} color={colors.onBrand} />
        </View>
        <View style={styles.supportMeta}>
          <Text style={styles.supportKicker}>
            {t("aboutDeveloper.affiliation")}
          </Text>
          <Text style={styles.supportTitle}>
            {t("aboutDeveloper.supportedBy")}
          </Text>
          <Text style={styles.supportUrl}>www.marscoders.tech</Text>
        </View>
        <Ionicons
          name={isRTL ? "open-outline" : "open-outline"}
          size={18}
          color={colors.onBrandMuted}
        />
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardKicker}>{t("aboutDeveloper.connect")}</Text>
        <Text style={styles.cardTitle}>{t("aboutDeveloper.connectTitle")}</Text>
        <View style={styles.contactList}>
          {CONTACTS.map((item) => {
            const label = t(`aboutDeveloper.contacts.${item.key}`);
            const subtitle =
              item.staticSubtitle ||
              (item.key === "portfolio"
                ? t("aboutDeveloper.contacts.portfolioSub")
                : "");
            return (
              <Pressable
                key={item.key}
                onPress={() => openLink(item.url)}
                style={({ pressed }) => [
                  styles.contactBtn,
                  pressed && styles.contactPressed,
                ]}
                accessibilityRole="link"
                accessibilityLabel={label}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.accent} />
                </View>
                <View style={styles.contactMeta}>
                  <Text style={styles.contactLabel}>{label}</Text>
                  <Text style={styles.contactSubtitle}>{subtitle}</Text>
                </View>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
                  size={18}
                  color={colors.inkSoft}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.appName}>{t("aboutDeveloper.appName")}</Text>
        <Text style={styles.version}>{t("aboutDeveloper.version")}</Text>
        <Text style={styles.copyright}>
          {t("aboutDeveloper.copyright", { year: new Date().getFullYear() })}
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutDeveloperScreen;

const createStyles = (colors, type, spacing, radii, isRTL, topInset = 20) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    headerCard: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      alignItems: "center",
      marginBottom: spacing.md,
    },
    avatarWrapper: {
      position: "relative",
      marginBottom: spacing.md,
    },
    avatar: {
      width: 116,
      height: 116,
      borderRadius: radii.lg,
      backgroundColor: colors.accentSoft,
      borderWidth: 2,
      borderColor: colors.border,
    },
    avatarBadge: {
      position: "absolute",
      bottom: -4,
      right: -4,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.surface,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.92)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalCloseBtn: {
      position: "absolute",
      top: topInset + 8,
      right: 20,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalImageContainer: {
      width: "100%",
      height: "80%",
      justifyContent: "center",
      alignItems: "center",
    },
    fullImage: {
      width: "90%",
      height: "90%",
    },
    name: {
      ...type.title,
      textAlign: "center",
      marginBottom: spacing.xs,
    },
    title: {
      ...type.heading,
      fontSize: 15,
      color: colors.accent,
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    badgeRowContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: spacing.sm,
    },
    noteChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs + 2,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm - 2,
      borderRadius: radii.pill,
    },
    noteText: {
      ...type.label,
      color: colors.accent,
      textAlign: "center",
    },
    statusChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: 4,
      borderRadius: radii.pill,
      marginTop: 2,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#10b981",
    },
    statusText: {
      ...type.caption,
      color: colors.inkSoft,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    cardKicker: {
      ...type.label,
      color: colors.accent,
      marginBottom: spacing.xs,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    cardTitle: {
      ...type.heading,
      marginBottom: spacing.sm,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    bio: {
      ...type.body,
      marginBottom: spacing.md,
      lineHeight: 22,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    stackLabel: {
      ...type.label,
      color: colors.ink,
      marginBottom: spacing.sm,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    badgeRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    badge: {
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.md - 2,
      paddingVertical: spacing.xs + 2,
    },
    badgeText: {
      ...type.label,
      color: colors.ink,
    },
    supportCard: {
      backgroundColor: colors.brand,
      borderRadius: radii.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: spacing.md,
    },
    supportIcon: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    supportMeta: {
      flex: 1,
    },
    supportKicker: {
      ...type.label,
      color: colors.onBrandMuted,
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    supportTitle: {
      ...type.heading,
      color: colors.onBrand,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    supportUrl: {
      ...type.caption,
      color: colors.onBrandMuted,
      marginTop: 2,
      fontSize: 12,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    supportCardPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.99 }],
    },
    contactList: {
      gap: spacing.sm,
    },
    contactBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.bg,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md - 2,
    },
    contactPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: radii.sm,
      backgroundColor: colors.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    contactMeta: {
      flex: 1,
    },
    contactLabel: {
      ...type.heading,
      fontSize: 15,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    contactSubtitle: {
      ...type.caption,
      marginTop: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    footer: {
      alignItems: "center",
      paddingVertical: spacing.lg,
      gap: spacing.xs,
    },
    appName: {
      ...type.heading,
      fontSize: 15,
    },
    version: {
      ...type.label,
    },
    copyright: {
      ...type.caption,
      textAlign: "center",
    },
  });
