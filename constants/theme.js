import { createElement, createContext, useContext, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { toggleDarkMode, setDarkMode } from "../store/redux/preferences.js";

export const lightColors = {
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

export const darkColors = {
  bg: "#12100E",
  surface: "#1C1815",
  ink: "#F5F2ED",
  inkMuted: "#A8A096",
  inkSoft: "#6E665E",
  accent: "#5E8B68",
  accentSoft: "#1E2B21",
  brand: "#2B2019",
  border: "#2D2621",
  danger: "#E06A68",
  dangerSoft: "#321B1B",
  success: "#5E8B68",
  successSoft: "#1E2B21",
  warning: "#D4A359",
  warningSoft: "#2C2214",
  overlay: "rgba(0, 0, 0, 0.72)",
  surfaceMuted: "rgba(28, 24, 21, 0.78)",
  onBrandMuted: "rgba(255, 255, 255, 0.65)",
  onBrandSoft: "rgba(255, 255, 255, 0.85)",
};

let isDarkModeGlobal = false;
const themeListeners = new Set();

export function getGlobalThemeMode() {
  return isDarkModeGlobal;
}

export function setGlobalThemeMode(isDark) {
  const next = !!isDark;
  if (isDarkModeGlobal !== next) {
    isDarkModeGlobal = next;
    themeListeners.forEach((fn) => {
      try {
        fn(isDarkModeGlobal);
      } catch (e) {
        console.warn("Theme listener error:", e);
      }
    });
  }
}

export function subscribeToTheme(listener) {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

// Proxy for dynamic color resolution
export const colors = new Proxy(lightColors, {
  get(target, prop) {
    const active = isDarkModeGlobal ? darkColors : lightColors;
    return prop in active ? active[prop] : target[prop];
  },
  ownKeys() {
    return Reflect.ownKeys(isDarkModeGlobal ? darkColors : lightColors);
  },
  getOwnPropertyDescriptor(target, prop) {
    return Reflect.getOwnPropertyDescriptor(
      isDarkModeGlobal ? darkColors : lightColors,
      prop,
    );
  },
});

export const lightShadows = {
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

export const darkShadows = {
  soft: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 3,
  },
  lift: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const shadows = new Proxy(lightShadows, {
  get(target, prop) {
    const active = isDarkModeGlobal ? darkShadows : lightShadows;
    return prop in active ? active[prop] : target[prop];
  },
});

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

export const lightType = {
  display: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    lineHeight: 34,
    color: lightColors.ink,
  },
  title: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 22,
    lineHeight: 28,
    color: lightColors.ink,
  },
  heading: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    lineHeight: 22,
    color: lightColors.ink,
  },
  body: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: lightColors.inkMuted,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
    color: lightColors.inkMuted,
  },
  caption: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: lightColors.inkSoft,
  },
};

export const darkType = {
  display: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    lineHeight: 34,
    color: darkColors.ink,
  },
  title: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 22,
    lineHeight: 28,
    color: darkColors.ink,
  },
  heading: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    lineHeight: 22,
    color: darkColors.ink,
  },
  body: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: darkColors.inkMuted,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
    color: darkColors.inkMuted,
  },
  caption: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: darkColors.inkSoft,
  },
};

export const type = new Proxy(lightType, {
  get(target, prop) {
    const active = isDarkModeGlobal ? darkType : lightType;
    return prop in active ? active[prop] : target[prop];
  },
});

export function getNavTheme(isDark = isDarkModeGlobal) {
  const currentColors = isDark ? darkColors : lightColors;
  return {
    headerStyle: {
      backgroundColor: currentColors.surface,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    headerTintColor: currentColors.ink,
    headerTitleStyle: {
      fontFamily: "Fraunces_600SemiBold",
      fontSize: 18,
    },
    contentStyle: { backgroundColor: currentColors.bg },
    sceneStyle: { backgroundColor: currentColors.bg },
  };
}

export const navTheme = new Proxy(
  {},
  {
    get(target, prop) {
      const active = getNavTheme(isDarkModeGlobal);
      return active[prop];
    },
  },
);

export const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.accent,
    background: lightColors.bg,
    card: lightColors.surface,
    text: lightColors.ink,
    border: lightColors.border,
    notification: lightColors.accent,
  },
};

export const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.accent,
    background: darkColors.bg,
    card: darkColors.surface,
    text: darkColors.ink,
    border: darkColors.border,
    notification: darkColors.accent,
  },
};

// --- Color token transformation map for reactive StyleSheet.create ---
const colorMap = new Map();
for (const [k, v] of Object.entries(lightColors)) {
  if (darkColors[k] && typeof v === "string") {
    colorMap.set(v.toLowerCase(), darkColors[k]);
  }
}

function convertValue(val) {
  if (typeof val === "string") {
    const lower = val.toLowerCase();
    if (colorMap.has(lower)) {
      return colorMap.get(lower);
    }
  }
  return val;
}

function convertStyleObject(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const darkObj = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      darkObj[k] = convertStyleObject(v);
    } else {
      darkObj[k] = convertValue(v);
    }
  }
  return darkObj;
}

// Enhance StyleSheet.create with reactive theme getters
const nativeCreate = StyleSheet.create;
if (!StyleSheet.__isEnhancedForTheme) {
  StyleSheet.create = function (stylesObj) {
    const original = nativeCreate(stylesObj);
    if (!stylesObj || typeof stylesObj !== "object") return original;

    const reactiveResult = {};
    for (const key of Object.keys(original)) {
      const origStyle = original[key];
      if (origStyle && typeof origStyle === "object" && !Array.isArray(origStyle)) {
        const darkStyle = convertStyleObject(origStyle);
        Object.defineProperty(reactiveResult, key, {
          get() {
            return isDarkModeGlobal ? darkStyle : origStyle;
          },
          enumerable: true,
          configurable: true,
        });
      } else {
        reactiveResult[key] = origStyle;
      }
    }
    return reactiveResult;
  };
  StyleSheet.__isEnhancedForTheme = true;
}

// React Theme Context & Hook
export const ThemeContext = createContext({
  isDark: false,
  colors: lightColors,
  shadows: lightShadows,
  type: lightType,
  radii,
  spacing,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);

  useMemo(() => {
    setGlobalThemeMode(isDark);
  }, [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
      shadows: isDark ? darkShadows : lightShadows,
      type: isDark ? darkType : lightType,
      radii,
      spacing,
      toggleTheme: () => dispatch(toggleDarkMode()),
      setDarkMode: (val) => dispatch(setDarkMode(val)),
    }),
    [isDark, dispatch],
  );

  return createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => useContext(ThemeContext);
