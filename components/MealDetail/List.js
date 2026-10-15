import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../constants/theme";

const List = ({ data, numbered = false }) => {
  const { colors } = useTheme();
  return (data || []).map((dataPoint, index) => (
    <View
      key={`${index}-${dataPoint}`}
      style={[styles.listItem, { borderBottomColor: colors.border }]}
    >
      <View style={styles.marker}>
        <Text style={[styles.markerText, { color: colors.accent }]}>
          {numbered ? `${index + 1}` : "•"}
        </Text>
      </View>
      <Text style={[styles.itemText, { color: colors.ink }]}>{dataPoint}</Text>
    </View>
  ));
};

export default List;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    marginHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  marker: {
    width: 24,
    marginRight: 10,
    marginTop: 1,
  },
  markerText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  itemText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
