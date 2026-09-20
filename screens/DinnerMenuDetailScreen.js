import { useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import {
  COURSE_KEYS,
  COURSE_LABELS,
  setGuests,
  setCourseMeal,
  clearCourse,
  deleteMenu,
} from "../store/redux/dinnerMenus";
import { addIngredients } from "../store/redux/shoppingList";
import { buildServiceTimeline } from "../utils/serviceTimeline";
import { colors, radii, spacing, type } from "../constants/theme";

const DinnerMenuDetailScreen = ({ route, navigation }) => {
  const { menuId } = route.params ?? {};
  const menu = useSelector((state) =>
    (state.dinnerMenus?.menus || []).find((m) => m.id === menuId),
  );
  const dispatch = useDispatch();
  const [pickerCourse, setPickerCourse] = useState(null);
  const [query, setQuery] = useState("");
  const [shopped, setShopped] = useState(false);
  const [serveHour, setServeHour] = useState(19);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: menu?.title || "Dinner",
      headerRight: () =>
        menu ? (
          <Pressable
            hitSlop={10}
            style={{ padding: 4 }}
            onPress={() => {
              dispatch(deleteMenu(menu.id));
              navigation.goBack();
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        ) : null,
    });
  }, [navigation, menu, dispatch]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEALS.slice(0, 40);
    return MEALS.filter((m) => m.title.toLowerCase().includes(q)).slice(0, 40);
  }, [query]);

  if (!menu) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Menu not found.</Text>
      </View>
    );
  }

  const shopMenu = () => {
    COURSE_KEYS.forEach((key) => {
      const id = menu.courses[key];
      if (!id) return;
      const meal = MEALS.find((m) => m.id === id);
      if (!meal) return;
      dispatch(
        addIngredients({
          mealId: meal.id,
          mealTitle: `${menu.title} · ${meal.title}`,
          ingredients: meal.ingredients,
        }),
      );
    });
    setShopped(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const filled = COURSE_KEYS.filter((k) => menu.courses[k]).length;

  const timeline = useMemo(() => {
    const serveAt = new Date();
    serveAt.setHours(serveHour, 0, 0, 0);
    if (serveAt.getTime() < Date.now()) {
      serveAt.setDate(serveAt.getDate() + 1);
    }
    return buildServiceTimeline(menu, MEALS, { serveAt, bufferMin: 12 });
  }, [menu, serveHour]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.guestCard}>
          <Text style={styles.guestLabel}>Guests</Text>
          <View style={styles.guestRow}>
            <Pressable
              style={styles.guestBtn}
              onPress={() =>
                dispatch(setGuests({ id: menu.id, guests: menu.guests - 1 }))
              }
            >
              <Ionicons name="remove" size={18} color={colors.ink} />
            </Pressable>
            <Text style={styles.guestCount}>{menu.guests}</Text>
            <Pressable
              style={styles.guestBtn}
              onPress={() =>
                dispatch(setGuests({ id: menu.id, guests: menu.guests + 1 }))
              }
            >
              <Ionicons name="add" size={18} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        {COURSE_KEYS.map((course) => {
          const mealId = menu.courses[course];
          const meal = mealId ? MEALS.find((m) => m.id === mealId) : null;
          return (
            <View key={course} style={styles.courseCard}>
              <Text style={styles.courseLabel}>{COURSE_LABELS[course]}</Text>
              {meal ? (
                <View style={styles.mealRow}>
                  <Pressable
                    style={styles.mealPress}
                    onPress={() =>
                      navigation.navigate("MealDetail", { mealId: meal.id })
                    }
                  >
                    <Image
                      source={{ uri: meal.imageUrl }}
                      style={styles.thumb}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mealTitle} numberOfLines={2}>
                        {meal.title}
                      </Text>
                      <Text style={styles.mealSub}>
                        {meal.duration} min · {meal.complexity}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      dispatch(clearCourse({ menuId: menu.id, course }))
                    }
                    hitSlop={10}
                  >
                    <Ionicons name="close" size={18} color={colors.inkSoft} />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.addCourse}
                  onPress={() => {
                    setQuery("");
                    setPickerCourse(course);
                  }}
                >
                  <Ionicons name="add" size={18} color={colors.accent} />
                  <Text style={styles.addCourseText}>Choose recipe</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {filled > 0 && (
          <Pressable
            style={[styles.shopBtn, shopped && styles.shopBtnDone]}
            onPress={shopMenu}
          >
            <Ionicons
              name={shopped ? "checkmark" : "basket-outline"}
              size={18}
              color={shopped ? colors.accent : colors.surface}
            />
            <Text style={[styles.shopText, shopped && styles.shopTextDone]}>
              {shopped ? "Added to shopping list" : "Shop this menu"}
            </Text>
          </Pressable>
        )}

        {timeline.steps.length > 0 && (
          <View style={styles.timelineCard}>
            <View style={styles.timelineHead}>
              <Text style={styles.timelineTitle}>Service timeline</Text>
              <Text style={styles.timelineSub}>
                Start {timeline.totalLeadMin} min before guests sit
              </Text>
            </View>

            <View style={styles.serveRow}>
              <Text style={styles.serveLabel}>Sit-down</Text>
              {[18, 19, 20].map((hour) => (
                <Pressable
                  key={hour}
                  style={[
                    styles.serveChip,
                    serveHour === hour && styles.serveChipOn,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setServeHour(hour);
                  }}
                >
                  <Text
                    style={[
                      styles.serveChipText,
                      serveHour === hour && styles.serveChipTextOn,
                    ]}
                  >
                    {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? "PM" : "AM"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {timeline.steps.map((step, index) => (
              <View key={step.key} style={styles.timelineStep}>
                <View style={styles.timelineRail}>
                  <View style={styles.timelineDot} />
                  {index < timeline.steps.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineBody}>
                  <Text style={styles.timelineClock}>
                    {step.startClock || step.startLabel}
                  </Text>
                  <Text style={styles.timelineAction}>
                    Start {step.label.toLowerCase()} · {step.meal.title}
                  </Text>
                  <Text style={styles.timelinePlate}>
                    Plate {step.plateClock || step.plateLabel} · {step.duration}{" "}
                    min cook
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!pickerCourse}
        animationType="slide"
        onRequestClose={() => setPickerCourse(null)}
      >
        <View style={styles.picker}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>
              {pickerCourse ? COURSE_LABELS[pickerCourse] : "Choose"}
            </Text>
            <Pressable onPress={() => setPickerCourse(null)} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.ink} />
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Search recipes"
            placeholderTextColor={colors.inkSoft}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.pickRow}
                onPress={() => {
                  dispatch(
                    setCourseMeal({
                      menuId: menu.id,
                      course: pickerCourse,
                      mealId: item.id,
                    }),
                  );
                  setPickerCourse(null);
                  Haptics.selectionAsync();
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.pickThumb}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickTitle}>{item.title}</Text>
                  <Text style={styles.pickSub}>{item.duration} min</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DinnerMenuDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  guestCard: {
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  guestLabel: { ...type.heading, color: colors.surface, fontSize: 15 },
  guestRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  guestBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  guestCount: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    color: colors.surface,
    minWidth: 36,
    textAlign: "center",
  },
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: 10,
  },
  courseLabel: { ...type.heading, fontSize: 13, marginBottom: 10 },
  mealRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  mealPress: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  mealTitle: { ...type.heading, fontSize: 15 },
  mealSub: { ...type.caption, marginTop: 2, textTransform: "capitalize" },
  addCourse: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    justifyContent: "center",
  },
  addCourseText: { ...type.label, color: colors.accent },
  shopBtn: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  shopBtnDone: { backgroundColor: colors.accentSoft },
  shopText: { ...type.heading, fontSize: 15, color: colors.surface },
  shopTextDone: { color: colors.accent },
  timelineCard: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  timelineHead: { marginBottom: spacing.md },
  timelineTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
  timelineSub: { ...type.caption, marginTop: 4 },
  serveRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.md,
  },
  serveLabel: { ...type.label, marginRight: 4 },
  serveChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serveChipOn: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  serveChipText: { ...type.label, fontSize: 12, color: colors.ink },
  serveChipTextOn: { color: colors.surface },
  timelineStep: {
    flexDirection: "row",
    gap: 12,
    minHeight: 64,
  },
  timelineRail: {
    width: 16,
    alignItems: "center",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  timelineClock: {
    ...type.heading,
    fontSize: 14,
    color: colors.accent,
  },
  timelineAction: {
    ...type.body,
    color: colors.ink,
    marginTop: 2,
  },
  timelinePlate: {
    ...type.caption,
    marginTop: 2,
  },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  missingText: { ...type.body },
  picker: { flex: 1, backgroundColor: colors.bg, paddingTop: 12 },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  pickerTitle: { ...type.title, fontSize: 22 },
  search: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...type.body,
    color: colors.ink,
  },
  pickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  pickThumb: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  pickTitle: { ...type.heading, fontSize: 15 },
  pickSub: { ...type.caption, marginTop: 2 },
});
