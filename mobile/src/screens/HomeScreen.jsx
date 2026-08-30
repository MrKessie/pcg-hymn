// src/screens/HomeScreen.jsx
import {
  IconArrowRight,
  IconDialpad,
  IconMusic,
  IconSearch,
  IconSettings,
  IconSun,
} from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MiniPlayer from "../components/MiniPlayer";
import QuickDialPadModal from "../components/QuickDialPadModal";
import { syncHymns } from "../services/syncService";
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { LANGUAGES } from "../utils/constants";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [showDialPad, setShowDialPad] = useState(false);

  const darkMode = useSettingsStore((state) => state.darkMode);
  const language = useSettingsStore((state) => state.language);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const {
    hymns,
    history,
    categories,
    loadHymns,
    loadFavorites,
    loadPlaylists,
    loadCategories,
    loadHistory,
    filterByCategory,
  } = useHymnStore();
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    loadSettings();
    loadAll();
  }, []);

  const loadAll = async () => {
    await loadHymns();
    await loadFavorites();
    await loadPlaylists();
    await loadCategories();
    await loadHistory();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await syncHymns();
    await loadAll();
    setRefreshing(false);
    if (result.synced && result.hymnsCount > 0) {
      Alert.alert("Synced", `Updated ${result.hymnsCount} hymns`);
    }
  };

  // Deterministic "Hymn of the Day" based on day of year
  const getHymnOfTheDay = () => {
    if (!hymns || hymns.length === 0) return null;
    const now = new Date();
    const dayOfYear = Math.floor(
      (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24),
    );
    const index = dayOfYear % hymns.length;
    return hymns[index] || hymns[0];
  };

  const hymnOfTheDay = getHymnOfTheDay();

  const handleSelectHymn = (hymn) => {
    navigation.navigate("HymnDetail", {
      hymnId: hymn.id,
      hymnNumber: hymn.hymn_number,
    });
  };

  const handleCategoryPress = (category) => {
    filterByCategory(category.id);
    navigation.navigate("HymnsTab");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Header Hero */}
        <View
          style={[
            styles.headerHero,
            {
              backgroundColor: colors.primary,
              paddingTop: Math.max(insets.top, 20) + 14,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.churchTag}>PRESYBTERIAN CHURCH OF GHANA</Text>
              <Text style={styles.headerTitle}>Kristofo Senku Dwom</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={styles.settingsBtn}
            >
              <IconSettings size={22} color="#FFFFFF" strokeWidth={1.8} />
            </TouchableOpacity>
          </View>

          {/* Quick Dial Pad Search Bar Trigger */}
          <TouchableOpacity
            style={styles.quickDialTrigger}
            activeOpacity={0.88}
            onPress={() => setShowDialPad(true)}
          >
            <View style={styles.dialIconWrap}>
              <IconDialpad size={20} color={colors.secondary} strokeWidth={2} />
            </View>
            <Text style={styles.dialPlaceholder}>
              Tap to enter Hymn number (e.g. 342)...
            </Text>
            <IconSearch size={18} color="#94A3B8" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Hymn of the Day Card */}
        {hymnOfTheDay && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.titleBadgeRow}>
                <IconSun size={16} color={colors.secondary} strokeWidth={2} />
                <Text
                  style={[styles.sectionHeading, { color: colors.secondary }]}
                >
                  HYMN OF THE DAY
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.hymnOfDayCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelectHymn(hymnOfTheDay)}
            >
              <View style={styles.hodTopRow}>
                <View
                  style={[
                    styles.hodBadge,
                    { backgroundColor: colors.surfaceCard },
                  ]}
                >
                  <Text style={[styles.hodNumber, { color: colors.primary }]}>
                    #{hymnOfTheDay.hymn_number}
                  </Text>
                </View>
                {hymnOfTheDay.scripture_reference ? (
                  <Text
                    style={[
                      styles.hodScripture,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {hymnOfTheDay.scripture_reference}
                  </Text>
                ) : null}
              </View>

              <Text style={[styles.hodTitle, { color: colors.text }]}>
                {language === LANGUAGES.TWI && hymnOfTheDay.title_twi
                  ? hymnOfTheDay.title_twi
                  : hymnOfTheDay.title_en}
              </Text>

              {hymnOfTheDay.composer ? (
                <Text
                  style={[styles.hodComposer, { color: colors.textSecondary }]}
                >
                  Composer: {hymnOfTheDay.composer}
                </Text>
              ) : null}

              <View
                style={[
                  styles.hodFooter,
                  { borderTopColor: colors.borderLight },
                ]}
              >
                <Text
                  style={[styles.hodSingAction, { color: colors.primary }]}
                >
                  Sing & Read Lyrics
                </Text>
                <IconArrowRight size={16} color={colors.primary} strokeWidth={2} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Recently Viewed / Sung Carousel */}
        {history.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>
                Recently Sung
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LibraryTab")}
              >
                <Text
                  style={[styles.seeAllText, { color: colors.secondary }]}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={history.slice(0, 10)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => {
                const title =
                  language === LANGUAGES.TWI && item.title_twi
                    ? item.title_twi
                    : item.title_en;
                return (
                  <TouchableOpacity
                    style={[
                      styles.recentCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => handleSelectHymn(item)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.recentBadge,
                        { backgroundColor: colors.surfaceCard },
                      ]}
                    >
                      <Text
                        style={[
                          styles.recentNumber,
                          { color: colors.primary },
                        ]}
                      >
                        #{item.hymn_number}
                      </Text>
                    </View>
                    <Text
                      style={[styles.recentTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* Quick Categories Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              Worship Seasons
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("ExploreTab")}>
              <Text style={[styles.seeAllText, { color: colors.secondary }]}>
                Explore All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickCatGrid}>
            {categories.slice(0, 4).map((cat) => {
              const name =
                language === LANGUAGES.TWI && cat.name_twi
                  ? cat.name_twi
                  : cat.name_en;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.quickCatCard,
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
                      styles.quickCatIcon,
                      { backgroundColor: colors.surfaceCard },
                    ]}
                  >
                    <IconMusic size={20} color={colors.primary} strokeWidth={2} />
                  </View>
                  <Text
                    style={[styles.quickCatName, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {name}
                  </Text>
                  <Text
                    style={[
                      styles.quickCatCount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {cat.hymn_count || 0} hymns
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Quick Dial Pad Modal */}
      <QuickDialPadModal
        visible={showDialPad}
        onClose={() => setShowDialPad(false)}
        onSelectHymn={handleSelectHymn}
      />

      <MiniPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerHero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  churchTag: {
    color: "#C89D3C",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  settingsBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
  },
  quickDialTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dialIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FAF7F2",
    justifyContent: "center",
    alignItems: "center",
  },
  dialPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
  },
  hymnOfDayCard: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  hodTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  hodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hodNumber: {
    fontSize: 14,
    fontWeight: "800",
  },
  hodScripture: {
    fontSize: 12,
    fontStyle: "italic",
  },
  hodTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  hodComposer: {
    fontSize: 13,
    marginBottom: 14,
  },
  hodFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  hodSingAction: {
    fontSize: 14,
    fontWeight: "700",
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  recentCard: {
    width: 140,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  recentBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  recentNumber: {
    fontSize: 12,
    fontWeight: "800",
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  quickCatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
  },
  quickCatCard: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickCatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickCatName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  quickCatCount: {
    fontSize: 11,
  },
});

export default HomeScreen;
