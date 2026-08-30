// src/screens/ExploreScreen.jsx
import {
  IconBook,
  IconChevronRight,
  IconDroplet,
  IconGlassFull,
  IconHandStop,
  IconHeart,
  IconInfinity,
  IconMusic,
  IconShieldCheck,
  IconSparkles,
  IconSun,
} from "@tabler/icons-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MiniPlayer from "../components/MiniPlayer";
import { LITURGY_ITEMS } from "../data/liturgyData";
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { LANGUAGES } from "../utils/constants";

const ExploreScreen = ({ navigation }) => {
  const { categories, loadCategories, filterByCategory } = useHymnStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const language = useSettingsStore((state) => state.language);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryPress = (category) => {
    filterByCategory(category.id);
    navigation.navigate("HymnsTab");
  };

  const renderCategoryIcon = (id) => {
    const size = 24;
    const color = colors.primary;
    switch (id) {
      case "cat_praise":
        return <IconSparkles size={size} color={color} strokeWidth={2} />;
      case "cat_morning":
        return <IconSun size={size} color={color} strokeWidth={2} />;
      case "cat_communion":
        return <IconGlassFull size={size} color={color} strokeWidth={2} />;
      case "cat_baptism":
        return <IconDroplet size={size} color={color} strokeWidth={2} />;
      case "cat_prayer":
        return <IconHandStop size={size} color={color} strokeWidth={2} />;
      case "cat_faith":
        return <IconShieldCheck size={size} color={color} strokeWidth={2} />;
      case "cat_easter":
        return <IconInfinity size={size} color={color} strokeWidth={2} />;
      case "cat_funeral":
        return <IconHeart size={size} color={color} strokeWidth={2} />;
      default:
        return <IconMusic size={size} color={color} strokeWidth={2} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Liturgy & Creeds Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Liturgy & Creeds
          </Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Confessions, Prayers & Canticles
          </Text>
        </View>

        <FlatList
          data={LITURGY_ITEMS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.liturgyList}
          renderItem={({ item }) => {
            const title =
              language === LANGUAGES.TWI && item.title_twi
                ? item.title_twi
                : item.title_en;
            return (
              <TouchableOpacity
                style={[
                  styles.liturgyCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("LiturgyDetail", { liturgyId: item.id })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.liturgyIconBadge,
                    { backgroundColor: colors.surfaceCard },
                  ]}
                >
                  <IconBook
                    size={22}
                    color={colors.secondary}
                    strokeWidth={1.8}
                  />
                </View>
                <Text
                  style={[styles.liturgyCategory, { color: colors.secondary }]}
                >
                  {item.category}
                </Text>
                <Text
                  style={[styles.liturgyTitle, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Hymn Categories / Themes Grid */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Worship Themes & Categories
          </Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Browse hymns by church season & topic
          </Text>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const name =
              language === LANGUAGES.TWI && cat.name_twi
                ? cat.name_twi
                : cat.name_en;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.catIconWrap,
                    { backgroundColor: colors.surfaceCard },
                  ]}
                >
                  {renderCategoryIcon(cat.id)}
                </View>
                <View style={styles.catInfo}>
                  <Text
                    style={[styles.catName, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {name}
                  </Text>
                  <Text
                    style={[styles.catCount, { color: colors.textSecondary }]}
                  >
                    {cat.hymn_count || 0} hymns
                  </Text>
                </View>
                <IconChevronRight
                  size={18}
                  color={colors.textLight}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      <MiniPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionSub: {
    fontSize: 13,
    marginTop: 2,
  },
  liturgyList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  liturgyCard: {
    width: 170,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  liturgyIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  liturgyCategory: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  liturgyTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  categoryGrid: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  catCount: {
    fontSize: 12,
  },
});

export default ExploreScreen;
