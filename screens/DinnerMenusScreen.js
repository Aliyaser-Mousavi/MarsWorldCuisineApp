import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import {
  createMenu,
  deleteMenu,
  COURSE_KEYS,
} from "../store/redux/dinnerMenus";
import { colors, radii, spacing, type } from "../constants/theme";

const DinnerMenusScreen = ({ navigation }) => {
  const menus = useSelector((state) => state.dinnerMenus.menus);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [guests, setGuests] = useState("4");

  const create = () => {
    dispatch(
      createMenu({
        title: title.trim() || "Dinner party",
        guests: Number(guests) || 4,
      }),
    );
    setTitle("");
    setGuests("4");
    setOpen(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Host with ease</Text>
        <Text style={styles.headline}>Dinner parties</Text>
        <Text style={styles.body}>
          Build a multi-course menu, set guest count, then shop everything in
          one tap. Saved on this phone.
        </Text>
      </View>

      <Pressable style={styles.createBtn} onPress={() => setOpen(true)}>
        <Ionicons name="add" size={18} color={colors.surface} />
        <Text style={styles.createText}>Plan a dinner</Text>
      </Pressable>

      <FlatList
        data={menus}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="wine-outline"
              size={36}
              color={colors.inkSoft}
            />
            <Text style={styles.emptyTitle}>No dinners planned</Text>
            <Text style={styles.emptyBody}>
              Create a menu with starter, main, side, and dessert.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const filled = COURSE_KEYS.filter((k) => item.courses?.[k]).length;
          const covers = COURSE_KEYS.map((k) => item.courses?.[k])
            .filter(Boolean)
            .map((id) => MEALS.find((m) => m.id === id))
            .filter(Boolean)
            .slice(0, 3);

          return (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("DinnerMenuDetail", { menuId: item.id })
              }
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                dispatch(deleteMenu(item.id));
              }}
            >
              <View
                style={[
                  styles.coverRow,
                  {
                    width:
                      covers.length > 0
                        ? 52 + (covers.length - 1) * 36
                        : 52,
                  },
                ]}
              >
                {covers.length > 0 ? (
                  covers.map((meal, index) => (
                    <Image
                      key={`${item.id}-${meal.id}`}
                      source={{ uri: meal.imageUrl }}
                      style={[
                        styles.cover,
                        index > 0 && { marginLeft: -16 },
                        { zIndex: covers.length - index },
                      ]}
                      contentFit="cover"
                    />
                  ))
                ) : (
                  <View style={[styles.cover, styles.coverEmpty]}>
                    <Ionicons
                      name="restaurant-outline"
                      size={20}
                      color={colors.inkSoft}
                    />
                  </View>
                )}
              </View>
              <View style={styles.meta}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardSub} numberOfLines={1}>
                  {item.guests} guests · {filled}/4 courses
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.inkSoft}
              />
            </Pressable>
          );
        }}
      />

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.modalTitle}>New dinner</Text>
            <TextInput
              style={styles.input}
              placeholder="Menu name"
              placeholderTextColor={colors.inkSoft}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <Text style={styles.fieldLabel}>Guests</Text>
            <TextInput
              style={styles.input}
              placeholder="4"
              placeholderTextColor={colors.inkSoft}
              value={guests}
              onChangeText={setGuests}
              keyboardType="number-pad"
            />
            <View style={styles.actions}>
              <Pressable
                style={styles.cancel}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.save} onPress={create}>
                <Text style={styles.saveText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DinnerMenusScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  kicker: { ...type.label, color: colors.accent, marginBottom: 4 },
  headline: { ...type.title, fontSize: 24, marginBottom: 6 },
  body: { ...type.body },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.brand,
    paddingVertical: 13,
    borderRadius: radii.md,
  },
  createText: { ...type.heading, fontSize: 15, color: colors.surface },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  coverRow: {
    flexDirection: "row",
    height: 52,
    alignItems: "center",
    overflow: "hidden",
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  coverEmpty: { alignItems: "center", justifyContent: "center" },
  meta: { flex: 1, minWidth: 0 },
  cardTitle: { ...type.heading, fontSize: 16 },
  cardSub: { ...type.caption, marginTop: 2 },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: { ...type.heading, marginTop: spacing.sm, marginBottom: 6 },
  emptyBody: { ...type.body, textAlign: "center" },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  modalTitle: { ...type.title, fontSize: 20, marginBottom: spacing.md },
  fieldLabel: { ...type.label, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    ...type.body,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  actions: { flexDirection: "row", gap: 10 },
  cancel: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
  },
  cancelText: { ...type.heading, fontSize: 14 },
  save: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
  },
  saveText: { ...type.heading, fontSize: 14, color: colors.surface },
});
