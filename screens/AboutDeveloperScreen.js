import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from "react-native";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, type, shadows } from "../constants/theme";
import { useState } from "react";

const TECH_STACK = [
  "HTML and CSS",
  "Tailwind",
  "JS",
  "React",
  "React Native",
  "Next.js",
  "Supabase",
  "PostgreSQL",
];

const CONTACTS = [
  {
    key: "portfolio",
    label: "Portfolio",
    subtitle: "View projects online",
    icon: "globe-outline",
    url: "https://aliyaser-mousavi-portfolio.onrender.com/",
  },
  {
    key: "email",
    label: "Email",
    subtitle: "aliyasermousavi@gmail.com",
    icon: "mail-outline",
    url: "mailto:aliyasermousavi@gmail.com",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    subtitle: "+93 782 899 827",
    icon: "logo-whatsapp",
    url: "https://wa.me/93782899827",
  },
  {
    key: "telegram",
    label: "Telegram",
    subtitle: "+93 782 899 827",
    icon: "paper-plane-outline",
    url: "https://t.me/+93782899827",
  },
  {
    key: "phone",
    label: "Phone",
    subtitle: "+93 782 899 827",
    icon: "call-outline",
    url: "tel:+93782899827",
  },
];

async function openLink(url) {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  } catch {
    // Ignore — device may not support the scheme.
  }
}

const AboutDeveloperScreen = () => {
  const [isImageVisible, setIsImageVisible] = useState(false);
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerCard, shadows.soft]}>
        <Pressable onPress={() => setIsImageVisible(true)}>
          <Image
            source={require("../assets/creator.png")}
            style={styles.avatar}
            accessibilityLabel="Developer profile photo"
          />
        </Pressable>

        <Modal
          visible={isImageVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setIsImageVisible(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "#000",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setIsImageVisible(false)}
          >
            <Image
              source={require("../assets/creator.png")}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
        <Text style={styles.name}>Sayeed Ali Ya Ser Mousavi</Text>
        <Text style={styles.title}>Junior Software Developer</Text>
        <View style={styles.noteChip}>
          <Ionicons name="school-outline" size={14} color={colors.accent} />
          <Text style={styles.noteText}>
            17-year-old · 11th Grade · High School Student
          </Text>
        </View>
      </View>

      <View style={[styles.card, shadows.soft]}>
        <Text style={styles.cardKicker}>About</Text>
        <Text style={styles.cardTitle}>Bio & experience</Text>
        <Text style={styles.bio}>
          A passionate 17-year-old developer (11th Grade) with proven experience
          in building real-world web and mobile applications. Enthusiastic about
          modern software development using HTML and CSS, Tailwind, JS, React,
          React Native, Next.js, and Supabase.
        </Text>

        <Text style={styles.stackLabel}>Tech stack</Text>
        <View style={styles.badgeRow}>
          {TECH_STACK.map((tech) => (
            <View key={tech} style={styles.badge}>
              <Text style={styles.badgeText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.supportCard, shadows.soft]}>
        <View style={styles.supportIcon}>
          <Ionicons name="people-outline" size={20} color={colors.surface} />
        </View>
        <View style={styles.supportMeta}>
          <Text style={styles.supportKicker}>Affiliation</Text>
          <Text style={styles.supportTitle}>Supported by Mars Coders</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardKicker}>Get in touch</Text>
        <Text style={styles.cardTitle}>Contact & social</Text>
        <View style={styles.contactList}>
          {CONTACTS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => openLink(item.url)}
              style={({ pressed }) => [
                styles.contactBtn,
                pressed && styles.contactPressed,
              ]}
              accessibilityRole="link"
              accessibilityLabel={item.label}
            >
              <View style={styles.contactIcon}>
                <Ionicons name={item.icon} size={20} color={colors.accent} />
              </View>
              <View style={styles.contactMeta}>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.inkSoft}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.appName}>Mars World Cuisine</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Sayeed Ali Ya Ser Mousavi
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutDeveloperScreen;

const styles = StyleSheet.create({
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
  avatar: {
    width: 112,
    height: 112,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.accentSoft,
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
  },
  cardTitle: {
    ...type.heading,
    marginBottom: spacing.sm,
  },
  bio: {
    ...type.body,
    marginBottom: spacing.md,
  },
  stackLabel: {
    ...type.label,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
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
    flexDirection: "row",
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
  },
  supportTitle: {
    ...type.heading,
    color: colors.surface,
  },
  contactList: {
    gap: spacing.sm,
  },
  contactBtn: {
    flexDirection: "row",
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
  },
  contactSubtitle: {
    ...type.caption,
    marginTop: 2,
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
