import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

const Subtitle = ({ title }) => {
  const { colors } = useTheme();
  const { isRTL } = useLocale();

  return (
    <View style={styles.subtitleContainer}>
      <Text
        style={[
          styles.subtitle,
          {
            color: colors.ink,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default Subtitle;

const styles = StyleSheet.create({
  subtitleContainer: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
  },
});
