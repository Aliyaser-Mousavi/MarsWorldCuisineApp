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
  Platform,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, getScaledMealIngredients } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";

const DinnerMenuDetailScreen = ({ route, navigation }) => {
  const { colors, radii, spacing, type, isDark } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const language = useAppLanguage();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
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
      title: menu?.title || t("dinnerMenuDetail.title"),
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
  }, [navigation, menu, dispatch, colors, t]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEALS.slice(0, 40);
    return MEALS.filter((m) => {
      const en = m.title.toLowerCase();
      const fa = MEALS_FA[m.id]?.title?.toLowerCase() || "";
      return en.includes(q) || fa.includes(q);
    }).slice(0, 40);
  }, [query]);

  if (!menu) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>{t("dinnerMenuDetail.missing")}</Text>
      </View>
    );
  }

  const shopMenu = () => {
    COURSE_KEYS.forEach((key) => {
      const id = menu.courses[key];
      if (!id) return;
      const meal = MEALS.find((m) => m.id === id);
      if (!meal) return;
      const mealTitle = (language === "fa" && MEALS_FA[meal.id]?.title) ? MEALS_FA[meal.id].title : meal.title;
      const multiplier = (menu.guests || 4) / 4;
      const mealIngredients = getScaledMealIngredients(meal, multiplier, language);
      dispatch(
        addIngredients({
          mealId: meal.id,
          mealTitle: `${menu.title} · ${mealTitle}`,
          ingredients: mealIngredients,
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
    return buildServiceTimeline(menu, MEALS, { serveAt, bufferMin: 12, isRTL, t });
  }, [menu, serveHour, isRTL, t]);

  const getCourseLabel = (key) => {
    const map = {
      starter: t("dinnerMenuDetail.courses.starter"),
      main: t("dinnerMenuDetail.courses.main"),
      side: t("dinnerMenuDetail.courses.side"),
      dessert: t("dinnerMenuDetail.courses.dessert"),
    };
    return map[key] || COURSE_LABELS[key] || key;
  };

  const formatClockTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const h = d.getHours();
    const m = d.getMinutes();
    const hr12 = h % 12 || 12;
    const minStr = String(m).padStart(2, "0");
    const period =
      h >= 12
        ? t("dinnerMenuDetail.pm", { defaultValue: "PM" })
        : t("dinnerMenuDetail.am", { defaultValue: "AM" });

    if (isRTL) {
      const hrFa = String(hr12).replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]);
      const minFa = minStr.replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]);
      return `${hrFa}:${minFa} ${period}`;
    }
    return `${hr12}:${minStr} ${period}`;
  };

  const formatRelativeTime = (minutesFromSit) => {
    if (minutesFromSit === 0) {
      return t("dinnerMenuDetail.whenGuestsSit", {
        defaultValue: "When guests sit",
      });
    }
    const mins = Math.abs(minutesFromSit);
    const formattedMins = isRTL
      ? String(mins).replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x])
      : mins;

    if (minutesFromSit > 0) {
      return t("dinnerMenuDetail.minAfterSitting", {
        minutes: formattedMins,
        defaultValue: `${formattedMins} min after sitting`,
      });
    }
    return t("dinnerMenuDetail.minBeforeSitting", {
      minutes: formattedMins,
      defaultValue: `${formattedMins} min before sitting`,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.guestCard}>
          <Text style={styles.guestLabel}>{t("dinnerMenuDetail.guests")}</Text>
          <View style={styles.guestRow}>
            <Pressable
              style={styles.guestBtn}
              onPress={() =>
                dispatch(setGuests({ id: menu.id, guests: menu.guests - 1 }))
              }
            >
              <Ionicons name="remove" size={18} color={colors.ink} />
            </Pressable>
            <Text style={styles.guestCount}>
              {isRTL
                ? String(menu.guests).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                : menu.guests}
            </Text>
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
              <Text style={styles.courseLabel}>{getCourseLabel(course)}</Text>
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
                        {(language === "fa" && MEALS_FA[meal.id]?.title)
                          ? MEALS_FA[meal.id].title
                          : meal.title}
                      </Text>
                      <Text style={styles.mealSub}>
                        {t("mealDetails.durationMin", {
                          duration: isRTL
                            ? String(meal.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                            : meal.duration,
                          defaultValue: isRTL
                            ? `${String(meal.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])} دقیقه`
                            : `${meal.duration} min`,
                        })}
                        {meal.complexity
                          ? ` · ${t(`mealDetails.complexity.${meal.complexity.toLowerCase()}`, { defaultValue: meal.complexity })}`
                          : ""}
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
                  <Text style={styles.addCourseText}>{t("dinnerMenuDetail.chooseRecipe")}</Text>
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
              color={shopped ? colors.accent : colors.onBrand}
            />
            <Text style={[styles.shopText, shopped && styles.shopTextDone]}>
              {shopped
                ? t("dinnerMenuDetail.addedToShoppingList")
                : t("dinnerMenuDetail.shopEntireMenu")}
            </Text>
          </Pressable>
        )}

        {timeline.steps.length > 0 && (
          <View style={styles.timelineCard}>
            <View style={styles.timelineHead}>
              <Text style={styles.timelineTitle}>{t("dinnerMenuDetail.serviceTimeline")}</Text>
              <Text style={styles.timelineSub}>
                {t("dinnerMenuDetail.prepStartsAt", {
                  time:
                    formatClockTime(timeline.steps[0]?.startTime) ||
                    (isRTL ? "۰۰:۰۰" : "00:00"),
                  total: isRTL
                    ? String(timeline.totalLeadMin).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                    : timeline.totalLeadMin,
                })}
              </Text>
            </View>

            <View style={styles.serveRow}>
              <Text style={styles.serveLabel}>{t("dinnerMenuDetail.serveDinnerAt")}</Text>
              {[18, 19, 20].map((hour) => {
                const hr12 = hour > 12 ? hour - 12 : hour;
                const formattedHr = isRTL
                  ? String(hr12).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                  : hr12;
                const period =
                  hour >= 12
                    ? t("dinnerMenuDetail.pm", { defaultValue: "PM" })
                    : t("dinnerMenuDetail.am", { defaultValue: "AM" });
                const chipLabel = isRTL
                  ? `${formattedHr}:۰۰ ${period}`
                  : `${formattedHr}:00 ${period}`;

                return (
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
                      {chipLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {timeline.steps.map((step, index) => {
              const startClockText = step.startTime
                ? formatClockTime(step.startTime)
                : formatRelativeTime(step.startOffset);

              const plateClockText = step.plateTime
                ? formatClockTime(step.plateTime)
                : formatRelativeTime(step.plateAt);

              const durationText = t("mealDetails.durationMin", {
                duration: isRTL
                  ? String(step.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                  : step.duration,
                defaultValue: isRTL
                  ? `${String(step.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])} دقیقه`
                  : `${step.duration} min`,
              });

              return (
                <View key={step.key} style={styles.timelineStep}>
                  <View style={styles.timelineRail}>
                    <View style={styles.timelineDot} />
                    {index < timeline.steps.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineBody}>
                    <Text style={styles.timelineClock}>
                      {startClockText}
                    </Text>
                    <Text style={styles.timelineAction}>
                      {getCourseLabel(step.key)} ·{" "}
                      {(language === "fa" && MEALS_FA[step.meal.id]?.title)
                        ? MEALS_FA[step.meal.id].title
                        : step.meal.title}
                    </Text>
                    <Text style={styles.timelinePlate}>
                      {t("dinnerMenuDetail.serveAt", {
                        time: plateClockText,
                        defaultValue: `Serve: ${plateClockText}`,
                      })}{" "}
                      · {durationText}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!pickerCourse}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setPickerCourse(null)}
      >
        <View style={styles.picker}>
          <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
          <View
            style={[
              styles.pickerHeaderWrapper,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
                paddingTop: insets.top,
              },
            ]}
          >
            <View
              style={[
                styles.pickerHeaderContainer,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Text style={styles.pickerTitle}>
                {pickerCourse
                  ? t("dinnerMenuDetail.pickerTitle", {
                      course: getCourseLabel(pickerCourse),
                    })
                  : t("common.search")}
              </Text>
              <Pressable onPress={() => setPickerCourse(null)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.ink} />
              </Pressable>
            </View>
          </View>
          <TextInput
            style={styles.search}
            placeholder={t("dinnerMenuDetail.searchPlaceholder")}
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
                  <Text style={styles.pickTitle}>
                    {(language === "fa" && MEALS_FA[item.id]?.title)
                      ? MEALS_FA[item.id].title
                      : item.title}
                  </Text>
                  <Text style={styles.pickSub}>
                    {t("mealDetails.durationMin", {
                      duration: isRTL
                        ? String(item.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                        : item.duration,
                      defaultValue: isRTL
                        ? `${String(item.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])} دقیقه`
                        : `${item.duration} min`,
                    })}
                    {item.complexity
                      ? ` · ${t(`mealDetails.complexity.${item.complexity.toLowerCase()}`, { defaultValue: item.complexity })}`
                      : ""}
                  </Text>
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

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  guestCard: {
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  guestLabel: { ...type.heading, color: colors.onBrand, fontSize: 15 },
  guestRow: { flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 },
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
    color: colors.onBrand,
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
  courseLabel: {
    ...type.heading,
    fontSize: 13,
    marginBottom: 10,
    textAlign: isRTL ? "right" : "left",
  },
  mealRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 8,
  },
  mealPress: {
    flex: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 10,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  mealTitle: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
  },
  mealSub: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
    textTransform: "capitalize",
  },
  addCourse: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  shopBtnDone: { backgroundColor: colors.accentSoft },
  shopText: { ...type.heading, fontSize: 15, color: colors.onBrand },
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
    ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
    fontSize: 20,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
  },
  timelineSub: {
    ...type.caption,
    marginTop: 4,
    textAlign: isRTL ? "right" : "left",
  },
  serveRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.md,
  },
  serveLabel: {
    ...type.label,
    [isRTL ? "marginLeft" : "marginRight"]: 4,
  },
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
  serveChipTextOn: { color: colors.onBrand },
  timelineStep: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
    textAlign: isRTL ? "right" : "left",
  },
  timelineAction: {
    ...type.body,
    color: colors.ink,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
  timelinePlate: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  missingText: { ...type.body },
  picker: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pickerHeaderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  pickerHeaderContainer: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  pickerTitle: {
    ...type.title,
    fontSize: 22,
    textAlign: isRTL ? "right" : "left",
  },
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
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  pickRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
  pickTitle: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
  },
  pickSub: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
});
