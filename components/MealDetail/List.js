import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";
import { toPersianDigits } from "../../utils/formatters";

const List = ({ data, numbered = false }) => {
  const { colors } = useTheme();
  const { isRTL } = useLocale();

  return (data || []).map((dataPoint, index) => (
    <View
      key={`${index}-${dataPoint}`}
      style={[
        styles.listItem,
        {
          borderBottomColor: colors.border,
          flexDirection: isRTL ? "row-reverse" : "row",
        },
      ]}
    >
      <View
        style={[
          styles.marker,
          {
            marginRight: isRTL ? 0 : 10,
            marginLeft: isRTL ? 10 : 0,
          },
        ]}
      >
        <Text style={[styles.markerText, { color: colors.accent }]}>
          {numbered ? (isRTL ? toPersianDigits(index + 1) : `${index + 1}`) : "•"}
        </Text>
      </View>
      <Text
        style={[
          styles.itemText,
          {
            color: colors.ink,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {dataPoint}
      </Text>
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
