export const colors = {
  bg: "#F2F0ED",
  surface: "#FFFFFF",
  ink: "#1A1410",
  inkMuted: "#6B635C",
  inkSoft: "#9A928A",
  accent: "#3D5A45",
  accentSoft: "#E4EBE6",
  brand: "#24160F",
  border: "#E5E1DC",
  danger: "#A94442",
  dangerSoft: "#F6EAEA",
  success: "#3D5A45",
  successSoft: "#E4EBE6",
  warning: "#8A6A3D",
  warningSoft: "#F3EDE3",
  overlay: "rgba(26, 20, 16, 0.45)",
  surfaceMuted: "rgba(255,255,255,0.72)",
  onBrandMuted: "rgba(255,255,255,0.68)",
  onBrandSoft: "rgba(255,255,255,0.82)",
};

export const shadows = {
  soft: {
    shadowColor: "#1A1410",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  lift: {
    shadowColor: "#1A1410",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const type = {
  display: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  title: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
  heading: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    lineHeight: 22,
    color: colors.ink,
  },
  body: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  },
  caption: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: colors.inkSoft,
  },
};

export const navTheme = {
  headerStyle: {
    backgroundColor: colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTintColor: colors.ink,
  headerTitleStyle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 18,
  },
  contentStyle: { backgroundColor: colors.bg },
  sceneStyle: { backgroundColor: colors.bg },
};
