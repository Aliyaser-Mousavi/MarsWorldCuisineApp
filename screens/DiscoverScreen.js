import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { buildDiscoverShelves, getCookingStreak } from "../utils/discover";
import { colors, radii, spacing, type } from "../constants/theme";

const { width } = Dimensions.get("window");
const CARD_W = Math.min(168, width * 0.42);

const DiscoverScreen = ({ navigation }) => {
  const prefs = useSelector((state) => state.preferences);
  const favoriteIds = useSelector((state) => state.favoriteMeals.ids);
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const recentIds = useSelector((state) => state.recentMeals.ids);

  const shelves = useMemo(
    () =>
      buildDiscoverShelves({
        prefs,
        favoriteIds,
        metaById,
        recentIds,
      }),
    [prefs, favoriteIds, metaById, recentIds],
  );

  const { streak } = useMemo(() => getCookingStreak(metaById), [metaById]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.intro}>
        <Text style={styles.kicker}>Discover</Text>
        <Text style={styles.headline}>Find your next plate</Text>
        <Text style={styles.body}>
          Shelves shaped by favorites, ratings, and what’s still new in your
          kitchen.
        </Text>
      </View>

      {streak > 0 && (
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTitle}>
              {streak}-day cooking streak
            </Text>
            <Text style={styles.streakBody}>
              Keep the rhythm — mark a meal when you cook tonight.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.shortcutRow}>
        <Pressable
          style={styles.shortcut}
          onPress={() => navigation.navigate("Surprise")}
        >
          <Ionicons name="dice-outline" size={18} color={colors.brand} />
          <Text style={styles.shortcutText}>Surprise</Text>
        </Pressable>
        <Pressable
          style={styles.shortcut}
          onPress={() => navigation.navigate("Tonight")}
        >
          <Ionicons name="moon-outline" size={18} color={colors.brand} />
          <Text style={styles.shortcutText}>Tonight</Text>
        </Pressable>
        <Pressable
          style={styles.shortcut}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search-outline" size={18} color={colors.brand} />
          <Text style={styles.shortcutText}>Search</Text>
        </Pressable>
      </View>

      {shelves.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Start liking a few recipes</Text>
          <Text style={styles.emptyBody}>
            Favorites and star ratings unlock richer recommendations here.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => navigation.navigate("Categories")}
          >
            <Text style={styles.emptyBtnText}>Browse recipes</Text>
          </Pressable>
        </View>
      ) : (
        shelves.map((shelf) => (
          <View key={shelf.id} style={styles.shelf}>
            <View style={styles.shelfHeader}>
              <Text style={styles.shelfTitle}>{shelf.title}</Text>
              <Text style={styles.shelfSubtitle}>{shelf.subtitle}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            >
              {shelf.items.map(({ meal, because }) => (
                <Pressable
                  key={`${shelf.id}-${meal.id}`}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("MealDetail", { mealId: meal.id })
                  }
                >
                  <View style={styles.cardMedia}>
                    <Image
                      source={meal.imageUrl}
                      style={styles.cardImage}
                      contentFit="cover"
                      transition={200}
                      cachePolicy="memory-disk"
                      recyclingKey={`${shelf.id}-${meal.id}`}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(26,20,16,0.75)"]}
                      locations={[0.45, 1]}
                      style={styles.cardGrad}
                      pointerEvents="none"
                    />
                    <Text style={styles.cardMeta}>
                      {meal.duration} min
                    </Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {meal.title}
                  </Text>
                  {because ? (
                    <Text style={styles.because} numberOfLines={1}>
                      Like {because}
                    </Text>
                  ) : (
                    <Text style={styles.cardSub} numberOfLines={1}>
                      {meal.complexity} · {meal.affordability}
                    </Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing.xl * 1.5,
  },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 4,
  },
  headline: {
    ...type.display,
    fontSize: 26,
    marginBottom: 6,
  },
  body: {
    ...type.body,
  },
  streakCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  streakTitle: {
    ...type.heading,
    fontSize: 16,
  },
  streakBody: {
    ...type.caption,
    marginTop: 2,
    color: colors.inkMuted,
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  shortcut: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortcutText: {
    ...type.label,
    color: colors.ink,
  },
  shelf: {
    marginTop: spacing.lg,
  },
  shelfHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  shelfTitle: {
    ...type.heading,
    fontSize: 18,
    marginBottom: 2,
  },
  shelfSubtitle: {
    ...type.caption,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  card: {
    width: CARD_W,
  },
  cardMedia: {
    width: CARD_W,
    height: CARD_W * 1.15,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  cardImage: {
    width: CARD_W,
    height: CARD_W * 1.15,
  },
  cardGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  cardMeta: {
    position: "absolute",
    left: 10,
    bottom: 10,
    ...type.caption,
    color: colors.surface,
  },
  cardTitle: {
    ...type.heading,
    fontSize: 14,
    lineHeight: 18,
  },
  cardSub: {
    ...type.caption,
    marginTop: 2,
    textTransform: "capitalize",
  },
  because: {
    ...type.caption,
    marginTop: 2,
    color: colors.accent,
  },
  empty: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  emptyTitle: {
    ...type.heading,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyBody: {
    ...type.body,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyBtn: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radii.md,
  },
  emptyBtnText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
});
