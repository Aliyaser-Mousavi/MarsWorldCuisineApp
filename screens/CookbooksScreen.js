import { useState, useMemo } from "react";
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
  createCookbook,
  deleteCookbook,
} from "../store/redux/cookbooks";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";

const CookbooksScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const books = useSelector((state) => state.cookbooks.books);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  const create = () => {
    const value = title.trim();
    if (!value) return;
    dispatch(createCookbook(value));
    setTitle("");
    setModalOpen(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("cookbooks.kicker")}</Text>
        <Text style={styles.headline}>{t("cookbooks.headline")}</Text>
        <Text style={styles.body}>{t("cookbooks.body")}</Text>
      </View>

      <Pressable
        style={[
          styles.createBtn,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
        onPress={() => setModalOpen(true)}
      >
        <Ionicons name="add" size={18} color={colors.onBrand} />
        <Text style={styles.createText}>{t("cookbooks.newCookbook")}</Text>
      </Pressable>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={36} color={colors.inkSoft} />
            <Text style={styles.emptyTitle}>{t("cookbooks.noCookbooksYet")}</Text>
            <Text style={styles.emptyBody}>
              {t("cookbooks.noCookbooksBody")}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const covers = item.mealIds
            .map((id) => MEALS.find((m) => m.id === id))
            .filter(Boolean)
            .slice(0, 3);
          return (
            <Pressable
              style={[
                styles.card,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
              onPress={() =>
                navigation.navigate("CookbookDetail", { cookbookId: item.id })
              }
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                dispatch(deleteCookbook(item.id));
              }}
            >
              <View
                style={[
                  styles.coverRow,
                  {
                    flexDirection: isRTL ? "row-reverse" : "row",
                    width:
                      covers.length > 0
                        ? 56 + (covers.length - 1) * 38
                        : 56,
                  },
                ]}
              >
                {covers.length > 0 ? (
                  covers.map((meal, index) => (
                    <Image
                      key={meal.id}
                      source={{ uri: meal.imageUrl }}
                      style={[
                        styles.cover,
                        index > 0 && (isRTL ? { marginRight: -18 } : { marginLeft: -18 }),
                        { zIndex: covers.length - index },
                      ]}
                      contentFit="cover"
                    />
                  ))
                ) : (
                  <View style={[styles.cover, styles.coverEmpty]}>
                    <Ionicons
                      name="restaurant-outline"
                      size={22}
                      color={colors.inkSoft}
                    />
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.cardMeta,
                  {
                    alignItems: isRTL ? "flex-end" : "flex-start",
                    marginLeft: isRTL ? 0 : 12,
                    marginRight: isRTL ? 12 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.cardSub,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  numberOfLines={1}
                >
                  {t("cookbooks.recipesCount", { count: item.mealIds.length })}
                </Text>
              </View>
              <Ionicons
                name={isRTL ? "chevron-back" : "chevron-forward"}
                size={16}
                color={colors.inkSoft}
              />
            </Pressable>
          );
        }}
      />

      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text
              style={[
                styles.modalTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {t("cookbooks.modalTitle")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
              placeholder={t("cookbooks.modalPlaceholder")}
              placeholderTextColor={colors.inkSoft}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <View
              style={[
                styles.modalActions,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Pressable
                style={styles.modalCancel}
                onPress={() => setModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>{t("common.cancel")}</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={create}>
                <Text style={styles.modalSaveText}>{t("cookbooks.create")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CookbooksScreen;

const createStyles = (colors, type, spacing, radii) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 4,
  },
  headline: {
    ...type.title,
    fontSize: 24,
    marginBottom: 6,
  },
  body: {
    ...type.body,
  },
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
  createText: {
    ...type.heading,
    fontSize: 15,
    color: colors.onBrand,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
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
    height: 56,
    alignItems: "center",
    overflow: "hidden",
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  coverEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardMeta: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    ...type.heading,
    fontSize: 16,
  },
  cardSub: {
    ...type.caption,
    marginTop: 2,
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...type.heading,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  emptyBody: {
    ...type.body,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...type.title,
    fontSize: 20,
    marginBottom: spacing.md,
  },
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
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
  },
  modalCancelText: {
    ...type.heading,
    fontSize: 14,
  },
  modalSave: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
  },
  modalSaveText: {
    ...type.heading,
    fontSize: 14,
    color: colors.onBrand,
  },
});
