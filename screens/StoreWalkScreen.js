import { useMemo, useState, useEffect } from "react";
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
import { colors, radii, spacing, type } from "../constants/theme";

const StoreWalkScreen = ({ navigation }) => {
  const items = useSelector((state) => state.shoppingList.items);
  const dispatch = useDispatch();
  const [aisleIndex, setAisleIndex] = useState(0);

  const aisles = useMemo(() => {
    return groupItemsByAisle(items).map((group) => ({
      ...group,
      remaining: group.items.filter((i) => !i.checked),
      done: group.items.filter((i) => i.checked),
    }));
  }, [items]);

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

  if (items.length === 0) {
    return (
      <View style={styles.emptyRoot}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.emptyTitle}>Nothing to shop</Text>
        <Text style={styles.emptyBody}>
          Add ingredients from a recipe first, then walk the store aisle by aisle.
        </Text>
        <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  if (totalLeft === 0) {
    return (
      <View style={styles.emptyRoot}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="checkmark-circle" size={56} color={colors.accentSoft} />
        <Text style={styles.emptyTitle}>Trip complete</Text>
        <Text style={styles.emptyBody}>
          Every item is checked. Nice haul — time to cook.
        </Text>
        <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>Done</Text>
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
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.surface} />
        </Pressable>
        <Text style={styles.topTitle}>Store walk</Text>
        <Text style={styles.topCount}>
          {totalLeft} left
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.aisleHeader}>
        <Ionicons name={aisle.icon} size={28} color={colors.accentSoft} />
        <Text style={styles.aisleTitle}>{aisle.label}</Text>
        <Text style={styles.aisleSub}>
          Aisle {aisleIndex + 1} of {activeAisles.length} · {aisle.remaining.length}{" "}
          item{aisle.remaining.length === 1 ? "" : "s"}
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
            style={styles.itemCard}
            onPress={() => checkItem(item.id)}
          >
            <View style={styles.checkCircle}>
              <Ionicons name="ellipse-outline" size={28} color={colors.brand} />
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemFrom}>{item.mealTitle}</Text>
            </View>
            <Text style={styles.tapHint}>Tap</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.navRow}>
        <Pressable
          style={[styles.navBtn, aisleIndex === 0 && styles.navDisabled]}
          onPress={goPrevAisle}
          disabled={aisleIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink} />
          <Text style={styles.navBtnText}>Prev aisle</Text>
        </Pressable>
        <Pressable
          style={[
            styles.navBtn,
            styles.navPrimary,
            aisleIndex >= activeAisles.length - 1 && styles.navDisabled,
          ]}
          onPress={goNextAisle}
          disabled={aisleIndex >= activeAisles.length - 1}
        >
          <Text style={styles.navPrimaryText}>Next aisle</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.surface} />
        </Pressable>
      </View>
    </View>
  );
};

export default StoreWalkScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 24,
    marginBottom: spacing.md,
  },
  topTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 18,
    color: colors.surface,
  },
  topCount: {
    ...type.label,
    color: "rgba(255,255,255,0.7)",
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
    color: colors.surface,
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
    color: colors.surface,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 26,
    color: colors.surface,
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
    color: colors.surface,
  },
});
