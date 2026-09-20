import {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Pressable,
  Platform,
  Share,
  TextInput,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import MealDetails from "../components/MealDetails";
import Subtitle from "../components/MealDetail/Subtitle";
import List from "../components/MealDetail/List";
import IconButton from "../components/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/redux/favorites";
import { addIngredients } from "../store/redux/shoppingList";
import { addRecent } from "../store/redux/recent";
import { setRating, setNote, markCooked } from "../store/redux/recipeMeta";
import { WEEK_DAYS, addToDay } from "../store/redux/mealPlan";
import {
  createCookbook,
  addMealToCookbook,
  removeMealFromCookbook,
} from "../store/redux/cookbooks";
import { scaleIngredients } from "../utils/servings";
import { getSimilarMeals } from "../utils/discover";
import { getSubstitutions } from "../utils/substitutions";
import { colors, radii, spacing, type } from "../constants/theme";

const HEADER_MAX_HEIGHT = 280;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT;
const EMPTY_META = Object.freeze({});

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const MealDetailScreen = ({ route, navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const [plannedDay, setPlannedDay] = useState(null);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [servings, setServings] = useState(2);
  const scrollY = useRef(new Animated.Value(0)).current;
  const noteTimer = useRef(null);

  const favoriteMealIds = useSelector(
    (state) => state.favoriteMeals?.ids || [],
  );
  const mealId = route.params?.mealId;
  const meta = useSelector(
    (state) => state.recipeMeta?.byId?.[mealId] ?? EMPTY_META,
  );
  const week = useSelector((state) => state.mealPlan?.week || {});
  const books = useSelector((state) => state.cookbooks?.books || []);
  const prefs = useSelector((state) => state.preferences);
  const dispatch = useDispatch();
  const selectedMeal = MEALS.find((meal) => meal.id === mealId);
  const mealIsFavorite = favoriteMealIds.includes(mealId);
  const [noteDraft, setNoteDraft] = useState(meta.note || "");

  const similarMeals = useMemo(
    () => getSimilarMeals(mealId, { prefs, limit: 6 }),
    [mealId, prefs],
  );
  const daysWithMeal = WEEK_DAYS.filter((day) =>
    (week[day] || []).includes(mealId),
  );

  useEffect(() => {
    setNoteDraft(meta.note || "");
  }, [mealId, meta.note]);

  useEffect(() => {
    if (selectedMeal) {
      dispatch(addRecent({ id: mealId }));
    }
  }, [mealId, dispatch, selectedMeal]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.7, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.4, 0],
    extrapolate: "clamp",
  });

  const changeFavoriteStatusHandler = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (mealIsFavorite) {
      dispatch(removeFavorite({ id: mealId }));
    } else {
      dispatch(addFavorite({ id: mealId }));
    }
  }, [mealIsFavorite, mealId, dispatch]);

  const shareHandler = useCallback(async () => {
    if (!selectedMeal) return;
    try {
      await Share.share({
        message: `${selectedMeal.title}\n\n${selectedMeal.duration} min · ${selectedMeal.complexity}\n\nIngredients:\n${selectedMeal.ingredients.map((i) => `• ${i}`).join("\n")}`,
      });
    } catch {
      // cancelled
    }
  }, [selectedMeal]);

  const onNoteChange = (text) => {
    setNoteDraft(text);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => {
      dispatch(setNote({ mealId, note: text }));
    }, 400);
  };

  const planForDay = (day) => {
    dispatch(addToDay({ day, mealId }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPlannedDay(day);
    setIsPlanModalVisible(false);
  };

  const savedInBooks = books.filter((b) => b.mealIds.includes(mealId));

  const toggleCookbook = (cookbookId) => {
    const book = books.find((b) => b.id === cookbookId);
    if (!book) return;
    if (book.mealIds.includes(mealId)) {
      dispatch(removeMealFromCookbook({ cookbookId, mealId }));
    } else {
      dispatch(addMealToCookbook({ cookbookId, mealId }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const createAndSave = () => {
    const value = newBookTitle.trim();
    if (!value) return;
    const action = createCookbook(value);
    dispatch(action);
    dispatch(addMealToCookbook({ cookbookId: action.payload.id, mealId }));
    setNewBookTitle("");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const cookedTimes = meta.cookedAt?.length || 0;
  const baseServings = 2;
  const multiplier = servings / baseServings;
  const scaledIngredients = scaleIngredients(
    selectedMeal?.ingredients || [],
    multiplier,
  );
  const substitutions = getSubstitutions(selectedMeal?.ingredients || [], 4);

  const addToShoppingList = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(
      addIngredients({
        mealId: selectedMeal.id,
        mealTitle: selectedMeal.title,
        ingredients: scaledIngredients,
      }),
    );
    setAddedToList(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton
            icon="share-outline"
            color={colors.ink}
            onPress={shareHandler}
          />
          <IconButton
            icon={mealIsFavorite ? "heart" : "heart-outline"}
            color={mealIsFavorite ? colors.danger : colors.ink}
            onPress={changeFavoriteStatusHandler}
          />
        </View>
      ),
    });
  }, [navigation, mealIsFavorite, changeFavoriteStatusHandler, shareHandler]);

  if (!selectedMeal) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Recipe not found.</Text>
      </View>
    );
  }

  const dietTags = [
    selectedMeal.isGlutenFree && "Gluten-free",
    selectedMeal.isVegan && "Vegan",
    selectedMeal.isVegetarian && "Vegetarian",
    selectedMeal.isLactoseFree && "Lactose-free",
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close" size={28} color={colors.surface} />
          </Pressable>
          <Image
            source={{ uri: selectedMeal.imageUrl }}
            style={styles.fullImage}
            contentFit="contain"
          />
        </View>
      </Modal>

      <Modal
        visible={isPlanModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsPlanModalVisible(false)}
      >
        <View style={styles.planOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsPlanModalVisible(false)}
          />
          <View style={styles.planSheet}>
            <View style={styles.planHandle} />
            <View style={styles.planHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planTitle}>Add to meal plan</Text>
                <Text style={styles.planSubtitle} numberOfLines={1}>
                  {selectedMeal.title}
                </Text>
              </View>
              <Pressable
                onPress={() => setIsPlanModalVisible(false)}
                style={styles.planClose}
                hitSlop={8}
              >
                <Ionicons name="close" size={18} color={colors.inkMuted} />
              </Pressable>
            </View>

            <View style={styles.dayList}>
              {WEEK_DAYS.map((day) => {
                const alreadyPlanned = daysWithMeal.includes(day);
                return (
                  <Pressable
                    key={day}
                    style={[
                      styles.dayRow,
                      alreadyPlanned && styles.dayRowActive,
                    ]}
                    onPress={() => planForDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayLabel,
                        alreadyPlanned && styles.dayLabelActive,
                      ]}
                    >
                      {DAY_LABELS[day]}
                    </Text>
                    {alreadyPlanned ? (
                      <View style={styles.plannedBadge}>
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={colors.accent}
                        />
                        <Text style={styles.plannedBadgeText}>Planned</Text>
                      </View>
                    ) : (
                      <Ionicons name="add" size={20} color={colors.inkSoft} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSaveModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsSaveModalVisible(false)}
      >
        <View style={styles.planOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsSaveModalVisible(false)}
          />
          <View style={styles.planSheet}>
            <View style={styles.planHandle} />
            <View style={styles.planHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planTitle}>Save to cookbook</Text>
                <Text style={styles.planSubtitle} numberOfLines={1}>
                  {selectedMeal.title}
                </Text>
              </View>
              <Pressable
                onPress={() => setIsSaveModalVisible(false)}
                style={styles.planClose}
                hitSlop={8}
              >
                <Ionicons name="close" size={18} color={colors.inkMuted} />
              </Pressable>
            </View>

            <View style={styles.newBookRow}>
              <TextInput
                style={styles.newBookInput}
                placeholder="New cookbook name"
                placeholderTextColor={colors.inkSoft}
                value={newBookTitle}
                onChangeText={setNewBookTitle}
              />
              <Pressable style={styles.newBookBtn} onPress={createAndSave}>
                <Text style={styles.newBookBtnText}>Add</Text>
              </Pressable>
            </View>

            <View style={styles.dayList}>
              {books.length === 0 ? (
                <Text style={styles.noBooks}>
                  No cookbooks yet — create one above.
                </Text>
              ) : (
                books.map((book) => {
                  const saved = book.mealIds.includes(mealId);
                  return (
                    <Pressable
                      key={book.id}
                      style={[styles.dayRow, saved && styles.dayRowActive]}
                      onPress={() => toggleCookbook(book.id)}
                    >
                      <View>
                        <Text
                          style={[
                            styles.dayLabel,
                            saved && styles.dayLabelActive,
                          ]}
                        >
                          {book.title}
                        </Text>
                        <Text style={styles.bookCount}>
                          {book.mealIds.length} recipe
                          {book.mealIds.length === 1 ? "" : "s"}
                        </Text>
                      </View>
                      <Ionicons
                        name={saved ? "checkmark-circle" : "add-circle-outline"}
                        size={22}
                        color={saved ? colors.accent : colors.inkSoft}
                      />
                    </Pressable>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, opacity: headerOpacity },
        ]}
      >
        <Pressable onPress={() => setIsModalVisible(true)} style={{ flex: 1 }}>
          <Image
            style={styles.image}
            contentFit="cover"
            source={{ uri: selectedMeal.imageUrl }}
          />
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        style={styles.rootContainer}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View style={{ height: HEADER_MAX_HEIGHT }} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{selectedMeal.title}</Text>
          <MealDetails
            duration={selectedMeal.duration}
            affordability={selectedMeal.affordability}
            complexity={selectedMeal.complexity}
            textStyle={styles.detailText}
          />

          {dietTags.length > 0 && (
            <View style={styles.tags}>
              {dietTags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => {
                  Haptics.selectionAsync();
                  dispatch(setRating({ mealId, rating: star }));
                }}
                hitSlop={6}
              >
                <Ionicons
                  name={star <= (meta.rating || 0) ? "star" : "star-outline"}
                  size={22}
                  color={
                    star <= (meta.rating || 0) ? colors.accent : colors.inkSoft
                  }
                />
              </Pressable>
            ))}
            <Text style={styles.ratingLabel}>Your rating</Text>
          </View>

          <Pressable
            style={styles.cookBtn}
            onPress={() => navigation.navigate("CookingMode", { mealId })}
          >
            <Ionicons name="flame-outline" size={18} color={colors.surface} />
            <Text style={styles.cookBtnText}>Start cooking</Text>
          </Pressable>

          <Pressable
            style={styles.batchBtn}
            onPress={() =>
              navigation.navigate("BatchFreeze", { mealId })
            }
          >
            <Ionicons name="snow-outline" size={16} color={colors.brand} />
            <Text style={styles.batchBtnText}>Batch & freeze this</Text>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.secondaryBtn, addedToList && styles.secondaryDone]}
              onPress={addToShoppingList}
            >
              <Ionicons
                name={addedToList ? "checkmark" : "basket-outline"}
                size={16}
                color={addedToList ? colors.accent : colors.ink}
              />
              <Text
                style={[
                  styles.secondaryText,
                  addedToList && styles.secondaryTextDone,
                ]}
              >
                {addedToList ? "On list" : "Shop"}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.secondaryBtn,
                (plannedDay || daysWithMeal.length > 0) && styles.secondaryDone,
              ]}
              onPress={() => setIsPlanModalVisible(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={
                  plannedDay || daysWithMeal.length > 0
                    ? colors.accent
                    : colors.ink
                }
              />
              <Text
                style={[
                  styles.secondaryText,
                  (plannedDay || daysWithMeal.length > 0) &&
                    styles.secondaryTextDone,
                ]}
              >
                {plannedDay
                  ? DAY_LABELS[plannedDay].slice(0, 3)
                  : daysWithMeal.length > 0
                    ? "Planned"
                    : "Plan"}
              </Text>
            </Pressable>
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => {
                dispatch(markCooked({ mealId }));
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={colors.ink}
              />
              <Text style={styles.secondaryText}>
                {cookedTimes > 0 ? `Made ×${cookedTimes}` : "Made it"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.saveBookBtn,
              savedInBooks.length > 0 && styles.saveBookBtnDone,
            ]}
            onPress={() => setIsSaveModalVisible(true)}
          >
            <Ionicons
              name="bookmark-outline"
              size={16}
              color={savedInBooks.length > 0 ? colors.accent : colors.ink}
            />
            <Text
              style={[
                styles.saveBookText,
                savedInBooks.length > 0 && styles.saveBookTextDone,
              ]}
            >
              {savedInBooks.length > 0
                ? `In ${savedInBooks.length} cookbook${savedInBooks.length === 1 ? "" : "s"}`
                : "Save to cookbook"}
            </Text>
          </Pressable>

          <View style={styles.noteBlock}>
            <Subtitle title="Your notes" />
            <TextInput
              style={styles.noteInput}
              placeholder="Tips, swaps, oven quirks… saved on this phone"
              placeholderTextColor={colors.inkSoft}
              multiline
              value={noteDraft}
              onChangeText={onNoteChange}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.listContainer}>
            <View style={styles.servingsHeader}>
              <Subtitle title="Ingredients" />
              <View style={styles.servingsRow}>
                <Text style={styles.servingsLabel}>Servings</Text>
                {[1, 2, 4, 6].map((n) => (
                  <Pressable
                    key={n}
                    style={[
                      styles.servingChip,
                      servings === n && styles.servingChipActive,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setServings(n);
                    }}
                  >
                    <Text
                      style={[
                        styles.servingChipText,
                        servings === n && styles.servingChipTextActive,
                      ]}
                    >
                      {n}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {multiplier !== 1 && (
              <Text style={styles.scaleHint}>
                Scaled to {servings} servings (base recipe serves {baseServings}
                )
              </Text>
            )}
            <List data={scaledIngredients} />
            {substitutions.length > 0 && (
              <View style={styles.swapBlock}>
                <Subtitle title="Smart swaps" />
                {substitutions.map((item) => (
                  <View key={`${item.original}-${item.swap}`} style={styles.swapRow}>
                    <Ionicons
                      name="swap-horizontal"
                      size={16}
                      color={colors.accent}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.swapTitle}>{item.swap}</Text>
                      <Text style={styles.swapSub} numberOfLines={1}>
                        Instead of {item.original}
                      </Text>
                      <Text style={styles.swapNote}>{item.note}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            <Subtitle title="Steps" />
            <List data={selectedMeal.steps || []} numbered />

            {similarMeals.length > 0 && (
              <View style={styles.similarBlock}>
                <Subtitle title="You might also like" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarRow}
                >
                  {similarMeals.map((meal) => (
                    <Pressable
                      key={meal.id}
                      style={styles.similarCard}
                      onPress={() =>
                        navigation.push("MealDetail", { mealId: meal.id })
                      }
                    >
                      <Image
                        source={{ uri: meal.imageUrl }}
                        style={styles.similarImage}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                      />
                      <Text style={styles.similarTitle} numberOfLines={2}>
                        {meal.title}
                      </Text>
                      <Text style={styles.similarMeta}>
                        {meal.duration} min · {meal.complexity}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default MealDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    backgroundColor: colors.brand,
  },
  rootContainer: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    marginTop: -16,
    paddingTop: spacing.lg,
    minHeight: 400,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    ...type.title,
    marginHorizontal: spacing.lg,
  },
  detailText: {
    color: colors.inkMuted,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  tagText: {
    ...type.caption,
    color: colors.accent,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  ratingLabel: {
    ...type.caption,
    marginLeft: 8,
  },
  cookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  cookBtnText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
  batchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: radii.md,
  },
  batchBtnText: {
    ...type.heading,
    fontSize: 14,
    color: colors.brand,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: radii.md,
  },
  secondaryDone: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  secondaryText: {
    ...type.label,
    color: colors.ink,
    fontSize: 12,
  },
  secondaryTextDone: {
    color: colors.accent,
  },
  saveBookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBookBtnDone: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  saveBookText: {
    ...type.label,
    color: colors.ink,
  },
  saveBookTextDone: {
    color: colors.accent,
  },
  newBookRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.md,
  },
  newBookInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    ...type.body,
    color: colors.ink,
  },
  newBookBtn: {
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  newBookBtnText: {
    ...type.heading,
    fontSize: 14,
    color: colors.surface,
  },
  noBooks: {
    ...type.body,
    paddingVertical: spacing.md,
  },
  bookCount: {
    ...type.caption,
    marginTop: 2,
  },
  noteBlock: {
    marginBottom: spacing.sm,
  },
  noteInput: {
    marginHorizontal: spacing.lg,
    minHeight: 88,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 12,
    ...type.body,
    color: colors.ink,
  },
  listContainer: {
    width: "100%",
  },
  servingsHeader: {
    marginBottom: 4,
  },
  servingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  servingsLabel: {
    ...type.label,
    marginRight: 4,
  },
  servingChip: {
    minWidth: 36,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  servingChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  servingChipText: {
    ...type.label,
    color: colors.ink,
  },
  servingChipTextActive: {
    color: colors.surface,
  },
  scaleHint: {
    ...type.caption,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  swapBlock: {
    marginBottom: spacing.sm,
  },
  swapRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: spacing.lg,
    marginBottom: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swapTitle: {
    ...type.heading,
    fontSize: 14,
  },
  swapSub: {
    ...type.caption,
    marginTop: 2,
  },
  swapNote: {
    ...type.label,
    color: colors.accent,
    marginTop: 4,
    fontSize: 12,
  },
  similarBlock: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  similarRow: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  similarCard: {
    width: 148,
  },
  similarImage: {
    width: 148,
    height: 110,
    borderRadius: radii.md,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  similarTitle: {
    ...type.heading,
    fontSize: 14,
    lineHeight: 18,
  },
  similarMeta: {
    ...type.caption,
    marginTop: 2,
    textTransform: "capitalize",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  planOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  planSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: spacing.sm,
  },
  planHandle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    gap: 12,
  },
  planTitle: {
    ...type.title,
    fontSize: 20,
  },
  planSubtitle: {
    ...type.body,
    marginTop: 2,
  },
  planClose: {
    padding: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.bg,
  },
  dayList: {
    gap: 8,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayRowActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  dayLabel: {
    ...type.heading,
    fontSize: 15,
  },
  dayLabelActive: {
    color: colors.accent,
  },
  plannedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  plannedBadgeText: {
    ...type.label,
    color: colors.accent,
  },
  fullImage: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  missingText: {
    ...type.body,
  },
});
