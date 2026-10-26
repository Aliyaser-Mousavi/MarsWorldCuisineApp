import { useMemo, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { toggleItem } from "../store/redux/shoppingList";
import { groupItemsByAisle } from "../utils/aisles";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import {
  useAppLanguage,
  getLocalizedShoppingItemName,
  getLocalizedShoppingItemMealTitle,
} from "../utils/catalogue";
import { toPersianDigits } from "../utils/formatters";

const StoreWalkScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t, isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const items = useSelector((state) => state.shoppingList.items);
  const dispatch = useDispatch();
  const [aisleIndex, setAisleIndex] = useState(0);

  const aisles = useMemo(() => {
    return groupItemsByAisle(items).map((group) => ({
      ...group,
      label: t(`shoppingList.aisles.${group.id}`, { defaultValue: group.label }),
      remaining: group.items.filter((i) => !i.checked),
      done: group.items.filter((i) => i.checked),
    }));
  }, [items, t]);

  const activeAisles = useMemo(
    () => aisles.filter((a) => a.remaining.length > 0),
    [aisles],
  );

  useEffect(() => {
    if (aisleIndex >= activeAisles.length && activeAisles.length > 0) {
      setAisleIndex(activeAisles.length - 1);
    }
  }, [activeAisles.length, aisleIndex]);

  const totalLeft = items.filter((i) => !i.checked).length;
  const total = items.length;
  const progress = total ? ((total - totalLeft) / total) * 100 : 100;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("storeWalk.title"),
      headerStyle: { backgroundColor: colors.brand },
      headerTintColor: colors.onBrand,
      headerTitleStyle: {
        ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
        fontSize: 18,
        color: colors.onBrand,
      },
      headerLeft: isRTL
        ? () => (
            <Text style={[styles.topCount, { textAlign: "left" }]}>
              {t("storeWalk.itemsLeft", {
                count: totalLeft,
              })}
            </Text>
          )
        : () => (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={{ padding: 4 }}
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
            >
              <Ionicons name="close" size={26} color={colors.onBrand} />
            </Pressable>
          ),
      headerRight: isRTL
        ? () => (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={{ padding: 4 }}
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
            >
              <Ionicons name="close" size={26} color={colors.onBrand} />
            </Pressable>
          )
        : () => (
            <Text style={styles.topCount}>
              {t("storeWalk.itemsLeft", {
                count: totalLeft,
              })}
            </Text>
          ),
    });
  }, [navigation, colors, isRTL, t, totalLeft, styles.topCount]);

  if (items.length === 0) {
    return (
      <View style={[styles.root, styles.emptyCenter]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.emptyTitle}>{t("storeWalk.nothingToShop")}</Text>
        <Text style={styles.emptyBody}>
          {t("storeWalk.nothingToShopBody")}
        </Text>
        <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>{t("storeWalk.close")}</Text>
        </Pressable>
      </View>
    );
  }

  if (totalLeft === 0) {
    return (
      <View style={[styles.root, styles.emptyCenter]}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="checkmark-circle" size={56} color={colors.accentSoft} />
        <Text style={styles.emptyTitle}>{t("storeWalk.tripComplete")}</Text>
        <Text style={styles.emptyBody}>
          {t("storeWalk.tripCompleteBody")}
        </Text>
        <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>{t("storeWalk.done")}</Text>
        </Pressable>
      </View>
    );
  }

  const aisle = activeAisles[Math.min(aisleIndex, activeAisles.length - 1)];
  if (!aisle) return null;

  const checkItem = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(toggleItem(id));
  };

  const goNextAisle = () => {
    if (aisleIndex < activeAisles.length - 1) {
      Haptics.selectionAsync();
      setAisleIndex((i) => i + 1);
    }
  };

  const goPrevAisle = () => {
    if (aisleIndex > 0) {
      Haptics.selectionAsync();
      setAisleIndex((i) => i - 1);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.aisleHeader}>
        <Ionicons name={aisle.icon} size={28} color={colors.accentSoft} />
        <Text style={styles.aisleTitle}>{aisle.label}</Text>
        <Text style={styles.aisleSub}>
          {t("storeWalk.aisleProgress", {
            current: isRTL ? toPersianDigits(aisleIndex + 1) : aisleIndex + 1,
            total: isRTL ? toPersianDigits(activeAisles.length) : activeAisles.length,
            count: aisle.remaining.length,
          })}
        </Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {aisle.remaining.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.itemCard,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
            onPress={() => checkItem(item.id)}
          >
            <View style={styles.checkCircle}>
              <Ionicons name="ellipse-outline" size={28} color={colors.inkSoft} />
            </View>
            <View
              style={[
                styles.itemText,
                { alignItems: isRTL ? "flex-end" : "flex-start" },
              ]}
            >
              <Text
                style={[
                  styles.itemName,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {getLocalizedShoppingItemName(item, language)}
              </Text>
              <Text
                style={[
                  styles.itemFrom,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {getLocalizedShoppingItemMealTitle(item, language)}
              </Text>
            </View>
            <Text style={styles.tapHint}>
              {t("storeWalk.tap", { defaultValue: isRTL ? "لمس" : "Tap" })}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        style={[
          styles.navRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Pressable
          style={[
            styles.navBtn,
            { flexDirection: isRTL ? "row-reverse" : "row" },
            aisleIndex === 0 && styles.navDisabled,
          ]}
          onPress={goPrevAisle}
          disabled={aisleIndex === 0}
        >
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={20}
            color={colors.ink}
          />
          <Text style={styles.navBtnText}>{t("storeWalk.prevAisle")}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.navBtn,
            styles.navPrimary,
            { flexDirection: isRTL ? "row-reverse" : "row" },
            aisleIndex >= activeAisles.length - 1 && styles.navDisabled,
          ]}
          onPress={goNextAisle}
          disabled={aisleIndex >= activeAisles.length - 1}
        >
          <Text style={styles.navPrimaryText}>{t("storeWalk.nextAisle")}</Text>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={20}
            color={colors.onBrand}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default StoreWalkScreen;

const createStyles = (colors, type, spacing, radii) =>
  StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    paddingTop: spacing.md,
  },
  topCount: {
    ...type.label,
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    minWidth: 56,
    textAlign: "right",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accentSoft,
  },
  aisleHeader: {
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: 6,
  },
  aisleTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    color: colors.onBrand,
  },
  aisleSub: {
    ...type.label,
    color: "rgba(255,255,255,0.65)",
  },
  list: { flex: 1 },
  listContent: { paddingBottom: spacing.md, gap: 10 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 12,
    minHeight: 76,
  },
  checkCircle: {
    width: 36,
    alignItems: "center",
  },
  itemText: { flex: 1 },
  itemName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    color: colors.ink,
    lineHeight: 22,
  },
  itemFrom: {
    ...type.caption,
    marginTop: 2,
  },
  tapHint: {
    ...type.caption,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  navRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: spacing.md,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  navPrimary: {
    backgroundColor: colors.accent,
    flex: 1.3,
  },
  navDisabled: { opacity: 0.4 },
  navBtnText: { ...type.heading, fontSize: 15 },
  navPrimaryText: {
    ...type.heading,
    fontSize: 15,
    color: colors.onBrand,
  },
  emptyCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    marginTop: -40,
  },
  emptyTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 26,
    color: colors.onBrand,
    marginTop: spacing.md,
    marginBottom: 8,
  },
  emptyBody: {
    ...type.body,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  closeBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radii.md,
  },
  closeBtnText: {
    ...type.heading,
    fontSize: 15,
    color: colors.onBrand,
  },
});
