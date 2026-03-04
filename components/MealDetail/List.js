import { StyleSheet, Text, View } from "react-native";

const List = ({ data }) => {
  return data.map((dataPoint) => (
    <View key={dataPoint} style={styles.listItem}>
      <Text style={styles.itemText}>{dataPoint}</Text>
    </View>
  ));
};

export default List;

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 6,
    marginHorizontal: 24,
    backgroundColor: "white",
    borderLeftColor: "#351401",
    borderLeftWidth: 5,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    color: "#4a4a4a",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
});
