import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Mars World Cuisine signature warm dark tone: #1A1410 (rgb: 26, 20, 16).
 * Using explicit rgba(26, 20, 16, 0) for the top transparent stop prevents
 * desaturated grey hue banding during interpolation.
 */
export const GRADIENT_PRESETS = {
  // Standard overlay for category tiles, cuisine cards, shelf cards
  standard: {
    colors: [
      "rgba(26, 20, 16, 0)",
      "rgba(26, 20, 16, 0.28)",
      "rgba(26, 20, 16, 0.65)",
      "rgba(26, 20, 16, 0.90)",
    ],
    locations: [0, 0.45, 0.75, 1],
  },
  // Strong overlay for hero cards, wheel results, and 2-line contender titles
  strong: {
    colors: [
      "rgba(26, 20, 16, 0)",
      "rgba(26, 20, 16, 0.32)",
      "rgba(26, 20, 16, 0.72)",
      "rgba(26, 20, 16, 0.94)",
    ],
    locations: [0, 0.4, 0.7, 1],
  },
  // Subtle overlay for small stamp thumbnails or badges
  subtle: {
    colors: [
      "rgba(26, 20, 16, 0)",
      "rgba(26, 20, 16, 0.20)",
      "rgba(26, 20, 16, 0.50)",
      "rgba(26, 20, 16, 0.80)",
    ],
    locations: [0, 0.5, 0.8, 1],
  },
};

export default function ImageGradientOverlay({
  preset = "standard",
  colors,
  locations,
  height,
  borderRadius,
  style,
  children,
  pointerEvents = "none",
  ...restProps
}) {
  const activePreset = GRADIENT_PRESETS[preset] || GRADIENT_PRESETS.standard;
  const gradientColors = colors || activePreset.colors;
  const gradientLocations = locations || activePreset.locations;

  const containerStyle = [
    height !== undefined && height !== "100%"
      ? { position: "absolute", bottom: 0, left: 0, right: 0, height }
      : StyleSheet.absoluteFillObject,
    borderRadius !== undefined && { borderRadius },
    style,
  ];

  return (
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      style={containerStyle}
      pointerEvents={
        children
          ? pointerEvents === "none"
            ? "box-none"
            : pointerEvents
          : pointerEvents
      }
      {...restProps}
    >
      {children}
    </LinearGradient>
  );
}
