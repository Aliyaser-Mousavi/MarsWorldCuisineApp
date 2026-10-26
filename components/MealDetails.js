import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { toPersianDigits } from "../utils/formatters";

const MealDetails = ({
  duration,
  complexity,
  affordability,
  style,
  textStyle,
  compact = false,
}) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLocale();

  const complexityLabel = complexity
    ? t(`mealDetails.complexity.${complexity.toLowerCase()}`, {
        defaultValue: complexity,
      })
    : "";

  const affordabilityLabel = affordability
    ? t(`mealDetails.affordability.${affordability.toLowerCase()}`, {
        defaultValue: affordability,
      })
    : "";

  const durationFormatted = isRTL ? toPersianDigits(duration) : duration;
  const durationLabel = duration
    ? t("mealDetails.durationMin", {
        duration: durationFormatted,
        defaultValue: isRTL ? `${durationFormatted} دقیقه` : `${duration} min`,
      })
    : "";

  const items = [
    durationLabel ? { key: "duration", label: durationLabel } : null,
    complexityLabel ? { key: "complexity", label: complexityLabel } : null,
    affordabilityLabel
      ? { key: "affordability", label: affordabilityLabel }
      : null,
  ].filter(Boolean);

  return (
    <View
      style={[
        styles.details,
        {
          backgroundColor: colors.accentSoft,
          flexDirection: isRTL ? "row-reverse" : "row",
          justifyContent: isRTL ? "flex-start" : "flex-start",
        },
        compact && styles.compact,
        style,
      ]}
    >
      {items.map((item, index) => (
        <View
          key={item.key}
          style={[
            styles.chipRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {index > 0 && (
            <Text style={[styles.dot, { color: colors.inkSoft }]}>·</Text>
          )}
          <Text
            style={[
              styles.detailItem,
              {
                color: colors.inkMuted,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
              compact && styles.detailCompact,
              textStyle,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default MealDetails;

const styles = StyleSheet.create({
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  compact: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 4,
    marginHorizontal: 0,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
    textTransform: "capitalize",
  },
  detailCompact: {
    fontSize: 12,
  },
  dot: {
    marginHorizontal: 6,
  },
});
