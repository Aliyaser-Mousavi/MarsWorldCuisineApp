import { StyleSheet, Text, View } from "react-native";

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
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 24,
    marginVertical: 16,
    borderBottomColor: "#351401",
    borderBottomWidth: 3,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#351401",
    textAlign: "left",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
