import { StyleSheet, Text, View } from "react-native";
import { colors, type, spacing } from "../../constants/theme";

const List = ({ data, numbered = false }) => {
  return (data || []).map((dataPoint, index) => (
    <View key={`${index}-${dataPoint}`} style={styles.listItem}>
      <View style={styles.marker}>
        <Text style={styles.markerText}>
          {numbered ? `${index + 1}` : "•"}
        </Text>
      </View>
      <Text style={styles.itemText}>{dataPoint}</Text>
    </View>
  ));
};

export default List;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    marginHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  marker: {
    width: 24,
    marginRight: 10,
    marginTop: 1,
  },
  markerText: {
    ...type.label,
    color: colors.accent,
    textAlign: "center",
  },
  itemText: {
    ...type.body,
    flex: 1,
    color: colors.ink,
  },
});
