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
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import {
  getLocalizedMeal,
  getScaledMealIngredients,
  useAppLanguage,
} from "../utils/catalogue";
import { syncMealPlanReminders } from "../services/notificationService";
import { toPersianDigits } from "../utils/formatters";

const HEADER_MAX_HEIGHT = 280;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT;
const EMPTY_META = Object.freeze({});

const MealDetailScreen = ({ route, navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 20,
  );
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL, topInset),
    [colors, type, spacing, radii, isRTL, topInset],
  );
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
  const language = useAppLanguage();
  const canonicalMeal = MEALS.find((meal) => meal.id === mealId);
  const selectedMeal = useMemo(
    () => getLocalizedMeal(canonicalMeal, language),
    [canonicalMeal, language],
  );
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

  const baseServings = 2;
  const multiplier = servings / baseServings;
  const scaledIngredients = useMemo(
    () => getScaledMealIngredients(canonicalMeal, multiplier, language),
    [canonicalMeal, multiplier, language],
  );

  const shareHandler = useCallback(async () => {
    if (!selectedMeal) return;
    try {
      const durationStr = t("mealDetails.durationMin", {
        duration: isRTL
          ? String(selectedMeal.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
          : selectedMeal.duration,
        defaultValue: `${selectedMeal.duration} min`,
      });
      const complexityStr = selectedMeal.complexity
        ? t(`mealDetails.complexity.${selectedMeal.complexity.toLowerCase()}`, {
            defaultValue: selectedMeal.complexity,
          })
        : "";
      const metaLine = [durationStr, complexityStr].filter(Boolean).join(" · ");
      const ingredientsList = (
        scaledIngredients ||
        selectedMeal.ingredients ||
        []
      )
        .map(
          (i) =>
            `• ${String(i || "")
              .replace(/\{qty\}\s*/g, "")
              .trim()}`,
        )
        .join("\n");

      await Share.share({
        message: `${selectedMeal.title}\n\n${metaLine}\n\n${t("mealDetail.ingredients")}:\n${ingredientsList}`,
      });
    } catch {}
  }, [selectedMeal, scaledIngredients, t, isRTL]);

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
    syncMealPlanReminders().catch(() => {});
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
  const substitutions = useMemo(
    () =>
      getSubstitutions(
        canonicalMeal?.ingredients || [],
        4,
        language,
        scaledIngredients,
      ),
    [canonicalMeal, language, scaledIngredients],
  );

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
  }, [
    navigation,
    mealIsFavorite,
    changeFavoriteStatusHandler,
    shareHandler,
    colors,
    styles,
  ]);

  if (!selectedMeal) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>{t("mealDetail.recipeNotFound")}</Text>
      </View>
    );
  }

  const dietTags = [
    selectedMeal.isGlutenFree && t("mealDetail.glutenFree"),
    selectedMeal.isVegan && t("mealDetail.vegan"),
    selectedMeal.isVegetarian && t("mealDetail.vegetarian"),
    selectedMeal.isLactoseFree && t("mealDetail.lactoseFree"),
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
          <StatusBar barStyle="light-content" />
          <Pressable
            style={styles.modalBackdropPressable}
            onPress={() => setIsModalVisible(false)}
          >
            <ActivityIndicator
              size="large"
              color={colors.accent || "#FFFFFF"}
              style={StyleSheet.absoluteFillObject}
            />
            <Image
              source={
                typeof selectedMeal?.imageUrl === "string"
                  ? { uri: selectedMeal.imageUrl }
                  : selectedMeal?.imageUrl
              }
              style={styles.fullImage}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={200}
            />
          </Pressable>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t("common.close", { defaultValue: "Close" })}
          >
            <Ionicons name="close" size={26} color="#FFFFFF" />
          </Pressable>
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
              <View
                style={{
                  flex: 1,
                  alignItems: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <Text
                  style={[
                    styles.planTitle,
                    {
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    },
                  ]}
                >
                  {t("mealDetail.addToMealPlan")}
                </Text>
                <Text
                  style={[
                    styles.planSubtitle,
                    {
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    },
                  ]}
                  numberOfLines={1}
                >
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
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                    onPress={() => planForDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayLabel,
                        alreadyPlanned && styles.dayLabelActive,
                        {
                          textAlign: isRTL ? "right" : "left",
                          writingDirection: isRTL ? "rtl" : "ltr",
                        },
                      ]}
                    >
                      {t(`mealDetail.days.${day}`)}
                    </Text>
                    {alreadyPlanned ? (
                      <View
                        style={[
                          styles.plannedBadge,
                          { flexDirection: isRTL ? "row-reverse" : "row" },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={colors.accent}
                        />
                        <Text style={styles.plannedBadgeText}>
                          {t("mealDetail.planned")}
                        </Text>
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
              <View
                style={{
                  flex: 1,
                  alignItems: isRTL ? "flex-end" : "flex-start",
                }}
              >
                <Text
                  style={[
                    styles.planTitle,
                    {
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    },
                  ]}
                >
                  {t("mealDetail.saveToCookbook")}
                </Text>
                <Text
                  style={[
                    styles.planSubtitle,
                    {
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    },
                  ]}
                  numberOfLines={1}
                >
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

            <View
              style={[
                styles.newBookRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <TextInput
                style={[
                  styles.newBookInput,
                  {
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                  },
                ]}
                placeholder={t("mealDetail.newCookbookName")}
                placeholderTextColor={colors.inkSoft}
                value={newBookTitle}
                onChangeText={setNewBookTitle}
              />
              <Pressable style={styles.newBookBtn} onPress={createAndSave}>
                <Text style={styles.newBookBtnText}>{t("common.add")}</Text>
              </Pressable>
            </View>

            <View style={styles.dayList}>
              {books.length === 0 ? (
                <Text style={styles.noBooks}>
                  {t("mealDetail.noCookbooksYet")}
                </Text>
              ) : (
                books.map((book) => {
                  const saved = book.mealIds.includes(mealId);
                  return (
                    <Pressable
                      key={book.id}
                      style={[
                        styles.dayRow,
                        saved && styles.dayRowActive,
                        { flexDirection: isRTL ? "row-reverse" : "row" },
                      ]}
                      onPress={() => toggleCookbook(book.id)}
                    >
                      <View
                        style={{
                          alignItems: isRTL ? "flex-end" : "flex-start",
                        }}
                      >
                        <Text
                          style={[
                            styles.dayLabel,
                            saved && styles.dayLabelActive,
                            {
                              textAlign: isRTL ? "right" : "left",
                              writingDirection: isRTL ? "rtl" : "ltr",
                            },
                          ]}
                        >
                          {book.title}
                        </Text>
                        <Text style={styles.bookCount}>
                          {t("mealDetail.recipesCount", {
                            count: book.mealIds.length,
                          })}
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

          <View
            style={[
              styles.ratingRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
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
            <Text style={styles.ratingLabel}>{t("mealDetail.yourRating")}</Text>
          </View>

          <Pressable
            style={[
              styles.cookBtn,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            onPress={() => navigation.navigate("CookingMode", { mealId })}
          >
            <Ionicons name="flame-outline" size={18} color={colors.onBrand} />
            <Text style={styles.cookBtnText}>
              {t("mealDetail.startCooking")}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.batchBtn,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            onPress={() => navigation.navigate("BatchFreeze", { mealId })}
          >
            <Ionicons name="snow-outline" size={16} color={colors.accent} />
            <Text style={styles.batchBtnText}>
              {t("mealDetail.batchAndFreezeThis")}
            </Text>
          </Pressable>

          <View
            style={[
              styles.actionRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Pressable
              style={[
                styles.secondaryBtn,
                addedToList && styles.secondaryDone,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
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
                {addedToList ? t("mealDetail.onList") : t("mealDetail.shop")}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.secondaryBtn,
                (plannedDay || daysWithMeal.length > 0) && styles.secondaryDone,
                { flexDirection: isRTL ? "row-reverse" : "row" },
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
                  ? t(`mealDetail.days.${plannedDay}`).slice(0, 3)
                  : daysWithMeal.length > 0
                    ? t("mealDetail.planned")
                    : t("mealDetail.plan")}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.secondaryBtn,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
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
                {cookedTimes > 0
                  ? t("mealDetail.madeTimes", { count: cookedTimes })
                  : t("mealDetail.madeIt")}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.saveBookBtn,
              savedInBooks.length > 0 && styles.saveBookBtnDone,
              { flexDirection: isRTL ? "row-reverse" : "row" },
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
                ? t("mealDetail.inCookbooks", { count: savedInBooks.length })
                : t("mealDetail.saveToCookbook")}
            </Text>
          </Pressable>

          <View style={styles.noteBlock}>
            <Subtitle title={t("mealDetail.yourNotes")} />
            <TextInput
              style={[
                styles.noteInput,
                {
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
              placeholder={t("mealDetail.notesPlaceholder")}
              placeholderTextColor={colors.inkSoft}
              multiline
              value={noteDraft}
              onChangeText={onNoteChange}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.listContainer}>
            <Subtitle title={t("mealDetail.ingredients")} />
            <View
              style={[
                styles.servingsRow,
                {
                  flexDirection: isRTL ? "row-reverse" : "row",
                  justifyContent: isRTL ? "flex-start" : "flex-start",
                },
              ]}
            >
              <Text
                style={[
                  styles.servingsLabel,
                  {
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                    marginLeft: isRTL ? 10 : 0,
                    marginRight: isRTL ? 0 : 10,
                  },
                ]}
              >
                {t("mealDetail.servings")}
              </Text>
              <View
                style={[
                  styles.chipsContainer,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
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
                      {isRTL ? toPersianDigits(n) : n}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {multiplier !== 1 && (
              <Text
                style={[
                  styles.scaleHint,
                  {
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                  },
                ]}
              >
                {t("mealDetail.scaleHint", { servings, baseServings })}
              </Text>
            )}
            <List data={scaledIngredients} />
            {substitutions.length > 0 && (
              <View style={styles.swapBlock}>
                <Subtitle title={t("mealDetail.smartSwaps")} />
                {substitutions.map((item) => (
                  <View
                    key={`${item.original}-${item.swap}`}
                    style={[
                      styles.swapRow,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Ionicons
                      name="swap-horizontal"
                      size={16}
                      color={colors.accent}
                    />
                    <View
                      style={{
                        flex: 1,
                        alignItems: isRTL ? "flex-end" : "flex-start",
                      }}
                    >
                      <Text
                        style={[
                          styles.swapTitle,
                          {
                            textAlign: isRTL ? "right" : "left",
                            writingDirection: isRTL ? "rtl" : "ltr",
                          },
                        ]}
                      >
                        {item.swap}
                      </Text>
                      <Text
                        style={[
                          styles.swapSub,
                          {
                            textAlign: isRTL ? "right" : "left",
                            writingDirection: isRTL ? "rtl" : "ltr",
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {t("mealDetail.insteadOf", { original: item.original })}
                      </Text>
                      <Text
                        style={[
                          styles.swapNote,
                          {
                            textAlign: isRTL ? "right" : "left",
                            writingDirection: isRTL ? "rtl" : "ltr",
                          },
                        ]}
                      >
                        {item.note}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            <Subtitle title={t("mealDetail.steps")} />
            <List data={selectedMeal.steps || []} numbered />

            {similarMeals.length > 0 && (
              <View style={styles.similarBlock}>
                <Subtitle title={t("mealDetail.youMightAlsoLike")} />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.similarRow,
                    isRTL && { flexDirection: "row-reverse", minWidth: "100%" },
                  ]}
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
                      <Text
                        style={[
                          styles.similarTitle,
                          {
                            textAlign: isRTL ? "right" : "left",
                            writingDirection: isRTL ? "rtl" : "ltr",
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {getLocalizedMeal(meal, language).title}
                      </Text>
                      <Text
                        style={[
                          styles.similarMeta,
                          {
                            textAlign: isRTL ? "right" : "left",
                            writingDirection: isRTL ? "rtl" : "ltr",
                          },
                        ]}
                      >
                        {[
                          t("mealDetails.durationMin", {
                            duration: isRTL
                              ? String(meal.duration).replace(
                                  /\d/g,
                                  (d) => "۰۱۲۳۴۵۶۷۸۹"[d],
                                )
                              : meal.duration,
                            defaultValue: `${meal.duration} min`,
                          }),
                          meal.complexity
                            ? t(
                                `mealDetails.complexity.${meal.complexity.toLowerCase()}`,
                                {
                                  defaultValue: meal.complexity,
                                },
                              )
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
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

const createStyles = (colors, type, spacing, radii, isRTL, topInset = 20) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    headerActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
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
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    detailText: {
      color: colors.inkMuted,
    },
    tags: {
      flexDirection: isRTL ? "row-reverse" : "row",
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
      color: colors.onBrand,
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
      color: colors.accent,
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
      color: colors.onBrand,
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
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: isRTL ? "flex-start" : "flex-start",
      marginHorizontal: 24,
      marginBottom: spacing.sm,
      flexWrap: "wrap",
      gap: 8,
    },
    servingsLabel: {
      ...type.label,
      color: colors.inkMuted,
    },
    chipsContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
    },
    servingChip: {
      minWidth: 36,
      height: 32,
      paddingHorizontal: 8,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
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
      color: colors.onBrand,
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
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    similarCard: {
      width: 148,
      alignItems: isRTL ? "flex-end" : "flex-start",
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
      backgroundColor: "#000000",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBackdropPressable: {
      flex: 1,
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
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
      width: "100%",
      height: "100%",
    },
    closeButton: {
      position: "absolute",
      top: topInset + 12,
      [isRTL ? "left" : "right"]: 20,
      zIndex: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
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
