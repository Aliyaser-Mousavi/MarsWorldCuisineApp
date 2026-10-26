import { useLayoutEffect, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import MealsList from "../components/MealsList/MealsList";
import {
  removeMealFromCookbook,
  deleteCookbook,
} from "../store/redux/cookbooks";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";

const CookbookDetailScreen = ({ route, navigation }) => {
  const { colors, type, spacing } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, isRTL),
    [colors, type, spacing, isRTL],
  );
  const { cookbookId } = route.params ?? {};
  const book = useSelector((state) =>
    (state.cookbooks?.books || []).find((b) => b.id === cookbookId),
  );
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: book?.title || t("cookbookDetail.title"),
      headerRight: () =>
        book ? (
          <Pressable
            hitSlop={10}
            onPress={() => {
              dispatch(deleteCookbook(book.id));
              navigation.goBack();
            }}
            style={{ padding: 4 }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        ) : null,
    });
  }, [navigation, book, dispatch, colors, t]);

  if (!book) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>{t("cookbookDetail.missing")}</Text>
      </View>
    );
  }

  const meals = (book.mealIds || [])
    .map((id) => MEALS.find((m) => m.id === id))
    .filter(Boolean);

  if (meals.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="book-outline" size={36} color={colors.inkSoft} />
        <Text style={styles.emptyTitle}>{book.title}</Text>
        <Text style={styles.emptyBody}>
          {t("cookbookDetail.emptyBody")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {t("cookbookDetail.recipesCount", { count: meals.length })}
        </Text>
        <Pressable
          hitSlop={8}
          onPress={() => {
            const last = meals[meals.length - 1];
            if (last) {
              dispatch(
                removeMealFromCookbook({
                  cookbookId: book.id,
                  mealId: last.id,
                }),
              );
            }
          }}
        >
          <Text style={styles.removeHint}>{t("cookbookDetail.removeLatest")}</Text>
        </Pressable>
      </View>
      <MealsList items={meals} />
    </View>
  );
};

export default CookbookDetailScreen;

const createStyles = (colors, type, spacing, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    toolbar: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    count: {
      ...type.label,
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
    },
    removeHint: {
      ...type.label,
      color: colors.danger,
      textAlign: isRTL ? "left" : "right",
    },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xl,
      backgroundColor: colors.bg,
    },
    emptyTitle: {
      ...type.heading,
      color: colors.ink,
      marginTop: spacing.sm,
      marginBottom: 6,
    },
    emptyBody: {
      ...type.body,
      color: colors.inkMuted,
      textAlign: "center",
    },
    missing: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
    },
    missingText: {
      ...type.body,
      color: colors.inkMuted,
    },
  });
