import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../constants/theme";

const Subtitle = ({ title }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.subtitleContainer}>
      <Text style={[styles.subtitle, { color: colors.ink }]}>{title}</Text>
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
