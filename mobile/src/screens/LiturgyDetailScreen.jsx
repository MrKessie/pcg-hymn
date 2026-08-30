// src/screens/LiturgyDetailScreen.jsx
import React from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageToggle from "../components/LanguageToggle";
import { LITURGY_ITEMS } from "../data/liturgyData";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { LANGUAGES } from "../utils/constants";

const LiturgyDetailScreen = ({ route }) => {
  const { liturgyId } = route.params;
  const darkMode = useSettingsStore((state) => state.darkMode);
  const language = useSettingsStore((state) => state.language);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const colors = getThemeColors(darkMode);

  const item =
    LITURGY_ITEMS.find((i) => i.id === liturgyId) || LITURGY_ITEMS[0];

  const title =
    language === LANGUAGES.TWI && item.title_twi
      ? item.title_twi
      : item.title_en;
  const content =
    language === LANGUAGES.TWI && item.content_twi
      ? item.content_twi
      : item.content_en;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${content}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Language switch */}
        <LanguageToggle />

        {/* Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.surfaceCard },
              ]}
            >
              <Text
                style={[styles.categoryText, { color: colors.secondary }]}
              >
                {item.category}
              </Text>
            </View>
            <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
              <Text style={{ color: colors.primary, fontWeight: "600" }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          <View
            style={[
              styles.divider,
              { backgroundColor: colors.borderLight },
            ]}
          />

          <Text
            style={[
              styles.content,
              {
                fontSize,
                color: colors.text,
                lineHeight: fontSize * 1.8,
              },
            ]}
          >
            {content}
          </Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  shareBtn: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  content: {
    letterSpacing: 0.3,
  },
});

export default LiturgyDetailScreen;
