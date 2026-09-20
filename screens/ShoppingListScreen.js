import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  Share,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  toggleItem,
  removeItem,
  clearChecked,
  clearAll,
} from "../store/redux/shoppingList";
import { groupItemsByAisle } from "../utils/aisles";
import { colors, radii, spacing, type } from "../constants/theme";

const ShoppingListScreen = ({ navigation }) => {
  const items = useSelector((state) => state.shoppingList.items);
  const dispatch = useDispatch();
  const remaining = items.filter((i) => !i.checked).length;

  const sections = useMemo(() => {
    return groupItemsByAisle(items).map((group) => ({
      title: group.label,
      icon: group.icon,
      data: group.items,
    }));
  }, [items]);

  const shareList = async () => {
    const blocks = sections
      .map((section) => {
        const lines = section.data
          .filter((i) => !i.checked)
          .map((i) => `☐ ${i.name}`)
          .join("\n");
        return lines ? `${section.title}\n${lines}` : null;
      })
      .filter(Boolean)
      .join("\n\n");
    if (!blocks) return;
    try {
      await Share.share({ message: `Shopping list\n\n${blocks}` });
    } catch {
      // cancelled
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyRoot}>
        <Ionicons name="basket-outline" size={40} color={colors.inkSoft} />
        <Text style={styles.emptyTitle}>Your list is empty</Text>
        <Text style={styles.emptyBody}>
          Open any recipe and tap Shop — or shop a whole week from Meal plan.
          Items are grouped by aisle.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.walkBanner}
        onPress={() => navigation.navigate("StoreWalk")}
      >
        <View style={styles.walkIcon}>
          <Ionicons name="walk-outline" size={22} color={colors.surface} />
        </View>
        <View style={styles.walkText}>
          <Text style={styles.walkTitle}>Store walk</Text>
          <Text style={styles.walkSub}>
            Aisle-by-aisle mode — big taps, one section at a time
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.accent} />
      </Pressable>

      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {remaining} item{remaining === 1 ? "" : "s"} left
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={shareList} hitSlop={8}>
            <Ionicons name="share-outline" size={18} color={colors.accent} />
          </Pressable>
          <Pressable onPress={() => dispatch(clearChecked())} hitSlop={8}>
            <Text style={styles.action}>Clear checked</Text>
          </Pressable>
          <Pressable onPress={() => dispatch(clearAll())} hitSlop={8}>
            <Text style={[styles.action, styles.danger]}>Clear all</Text>
          </Pressable>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Ionicons name={section.icon} size={16} color={colors.accent} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.checkArea}
              onPress={() => dispatch(toggleItem(item.id))}
            >
              <Ionicons
                name={item.checked ? "checkbox" : "square-outline"}
                size={22}
                color={item.checked ? colors.accent : colors.inkSoft}
              />
              <View style={styles.textBlock}>
                <Text
                  style={[styles.name, item.checked && styles.nameChecked]}
                >
                  {item.name}
                </Text>
                <Text style={styles.from}>{item.mealTitle}</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => dispatch(removeItem(item.id))}
              hitSlop={10}
            >
              <Ionicons name="trash-outline" size={18} color={colors.inkSoft} />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default ShoppingListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  walkBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  walkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  walkText: { flex: 1 },
  walkTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 16,
    color: colors.ink,
  },
  walkSub: {
    ...type.caption,
    marginTop: 2,
  },
  toolbar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  count: {
    ...type.label,
    color: colors.ink,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  action: {
    ...type.label,
    color: colors.accent,
  },
  danger: {
    color: colors.danger,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bg,
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  checkArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    ...type.body,
    color: colors.ink,
  },
  nameChecked: {
    textDecorationLine: "line-through",
    color: colors.inkSoft,
  },
  from: {
    ...type.caption,
    marginTop: 2,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    ...type.heading,
    marginTop: spacing.md,
    marginBottom: 6,
  },
  emptyBody: {
    ...type.body,
    textAlign: "center",
  },
});
