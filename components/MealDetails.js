import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../constants/theme";

const MealDetails = ({
  duration,
  complexity,
  affordability,
  style,
  textStyle,
  compact = false,
}) => {
  const { colors } = useTheme();
  const items = [
    `${duration} min`,
    complexity,
    affordability,
  ];

  return (
    <View
      style={[
        styles.details,
        { backgroundColor: colors.accentSoft },
        compact && styles.compact,
        style,
      ]}
    >
      {items.map((item, index) => (
        <View key={item} style={styles.chipRow}>
          {index > 0 && (
            <Text style={[styles.dot, { color: colors.inkSoft }]}>·</Text>
          )}
          <Text
            style={[
              styles.detailItem,
              { color: colors.inkMuted },
              compact && styles.detailCompact,
              textStyle,
            ]}
          >
            {item}
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
