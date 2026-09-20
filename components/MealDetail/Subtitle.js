import { StyleSheet, Text, View } from "react-native";
import { colors, type, spacing } from "../../constants/theme";

const Subtitle = ({ title }) => {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitle}>{title}</Text>
    </View>
  );
};

export default Subtitle;

const styles = StyleSheet.create({
  subtitleContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...type.heading,
    fontSize: 16,
    color: colors.ink,
  },
});
