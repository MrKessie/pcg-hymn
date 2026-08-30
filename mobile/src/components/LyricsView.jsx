// src/components/LyricsView.jsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { LANGUAGES } from "../utils/constants";

const LyricsView = ({ hymn }) => {
  const language = useSettingsStore((state) => state.language);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const bilingualMode = useSettingsStore((state) => state.bilingualMode);
  const colors = getThemeColors(darkMode);

  const lyricsEn = hymn.lyrics_en;
  const lyricsTwi = hymn.lyrics_twi;

  if (bilingualMode && lyricsTwi && lyricsEn) {
    const stanzasEn = lyricsEn.split("\n\n").filter(Boolean);
    const stanzasTwi = lyricsTwi.split("\n\n").filter(Boolean);
    const maxStanzas = Math.max(stanzasEn.length, stanzasTwi.length);

    return (
      <View style={styles.container}>
        {Array.from({ length: maxStanzas }).map((_, idx) => {
          const textEn = stanzasEn[idx] || "";
          const textTwi = stanzasTwi[idx] || "";
          const isChorus =
            textEn.toLowerCase().startsWith("chorus") ||
            textEn.toLowerCase().startsWith("refrain") ||
            textTwi.toLowerCase().startsWith("chorus");

          return (
            <View
              key={idx}
              style={[
                styles.stanzaCard,
                {
                  backgroundColor: isChorus
                    ? colors.surfaceCard
                    : colors.surface,
                  borderColor: isChorus ? colors.secondary : colors.border,
                  borderLeftWidth: isChorus ? 4 : 1,
                },
              ]}
            >
              <View style={styles.stanzaHeader}>
                <View
                  style={[
                    styles.stanzaNumberBadge,
                    {
                      backgroundColor: isChorus
                        ? colors.secondary
                        : colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.stanzaNumberText}>
                    {isChorus ? "Chorus" : `v. ${idx + 1}`}
                  </Text>
                </View>
              </View>

              {textEn ? (
                <View style={styles.langBlock}>
                  <Text style={[styles.langLabel, { color: colors.secondary }]}>
                    English
                  </Text>
                  <Text
                    style={[
                      styles.lyricsText,
                      {
                        fontSize,
                        color: colors.text,
                        lineHeight: fontSize * 1.7,
                      },
                    ]}
                  >
                    {textEn}
                  </Text>
                </View>
              ) : null}

              {textTwi ? (
                <View style={[styles.langBlock, { marginTop: 12 }]}>
                  <Text style={[styles.langLabel, { color: colors.secondary }]}>
                    Twi
                  </Text>
                  <Text
                    style={[
                      styles.lyricsText,
                      {
                        fontSize,
                        color: colors.text,
                        lineHeight: fontSize * 1.7,
                      },
                    ]}
                  >
                    {textTwi}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }

  const lyrics =
    language === LANGUAGES.TWI && lyricsTwi ? lyricsTwi : lyricsEn;

  if (!lyrics) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {language === LANGUAGES.TWI
            ? "Twi lyrics not available yet"
            : "Lyrics not available"}
        </Text>
      </View>
    );
  }

  const stanzas = lyrics.split("\n\n").filter(Boolean);

  return (
    <View style={styles.container}>
      {stanzas.map((stanzaText, index) => {
        const isChorus =
          stanzaText.toLowerCase().startsWith("chorus") ||
          stanzaText.toLowerCase().startsWith("refrain") ||
          stanzaText.toLowerCase().startsWith("nnwom foforɔ");

        return (
          <View
            key={index}
            style={[
              styles.stanzaCard,
              {
                backgroundColor: isChorus
                  ? colors.surfaceCard
                  : colors.surface,
                borderColor: isChorus ? colors.secondary : colors.border,
                borderLeftWidth: isChorus ? 4 : 1,
              },
            ]}
          >
            <View style={styles.stanzaHeader}>
              <View
                style={[
                  styles.stanzaNumberBadge,
                  {
                    backgroundColor: isChorus
                      ? colors.secondary
                      : colors.primary,
                  },
                ]}
              >
                <Text style={styles.stanzaNumberText}>
                  {isChorus ? "Chorus" : `Verse ${index + 1}`}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.lyricsText,
                {
                  fontSize,
                  color: colors.text,
                  lineHeight: fontSize * 1.8,
                },
              ]}
            >
              {stanzaText}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  stanzaCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  stanzaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stanzaNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stanzaNumberText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  langBlock: {},
  langLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  lyricsText: {
    letterSpacing: 0.2,
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default LyricsView;