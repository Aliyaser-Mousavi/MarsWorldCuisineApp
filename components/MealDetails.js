import { StyleSheet, Text, View } from "react-native";
import { colors, radii, type } from "../constants/theme";

const MealDetails = ({
  duration,
  complexity,
  affordability,
  style,
  textStyle,
  compact = false,
}) => {
  const items = [
    `${duration} min`,
    complexity,
    affordability,
  ];

  return (
    <View style={[styles.details, compact && styles.compact, style]}>
      {items.map((item, index) => (
        <View key={item} style={styles.chipRow}>
          {index > 0 && <Text style={styles.dot}>·</Text>}
          <Text
            style={[
              styles.detailItem,
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
    backgroundColor: colors.accentSoft,
    borderRadius: radii.sm,
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
    ...type.label,
    textTransform: "capitalize",
    color: colors.inkMuted,
  },
  detailCompact: {
    fontSize: 12,
  },
  dot: {
    marginHorizontal: 6,
    color: colors.inkSoft,
  },
});
