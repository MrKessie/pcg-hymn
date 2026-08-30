// src/components/PresentationModal.jsx
import {
  IconMoon,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconSun,
  IconX,
} from "@tabler/icons-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSettingsStore } from "../stores/settingsStore";
import { LANGUAGES } from "../utils/constants";

const PresentationModal = ({ visible, onClose, hymn }) => {
  const [scale, setScale] = useState(24);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1); // 0.5, 1, 2
  const [themeMode, setThemeMode] = useState("dark"); // 'dark' | 'parchment'
  const scrollViewRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const animationFrameRef = useRef(null);

  const language = useSettingsStore((state) => state.language);
  const bilingualMode = useSettingsStore((state) => state.bilingualMode);

  useEffect(() => {
    if (!visible) {
      setIsAutoScrolling(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [visible]);

  useEffect(() => {
    let lastTime = Date.now();

    const step = () => {
      if (!isAutoScrolling) return;
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      scrollOffsetRef.current += delta * 20 * scrollSpeed;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: scrollOffsetRef.current,
          animated: false,
        });
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    if (isAutoScrolling) {
      lastTime = Date.now();
      animationFrameRef.current = requestAnimationFrame(step);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  if (!hymn) return null;

  const isDark = themeMode === "dark";
  const bg = isDark ? "#060D1A" : "#FBF7ED";
  const textColor = isDark ? "#F8FAFC" : "#1E293B";
  const subtitleColor = isDark ? "#D4AF37" : "#8A6D1E";
  const toolbarBg = isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(241, 233, 218, 0.95)";
  const borderColor = isDark ? "#1E293B" : "#E2D8C3";

  const titleEn = hymn.title_en;
  const titleTwi = hymn.title_twi;
  const lyricsEn = hymn.lyrics_en;
  const lyricsTwi = hymn.lyrics_twi;

  const displayLyrics = () => {
    if (bilingualMode && lyricsTwi && lyricsEn) {
      const stanzasEn = lyricsEn.split("\n\n").filter(Boolean);
      const stanzasTwi = lyricsTwi.split("\n\n").filter(Boolean);
      const maxStanzas = Math.max(stanzasEn.length, stanzasTwi.length);

      return (
        <View style={styles.lyricsContainer}>
          {Array.from({ length: maxStanzas }).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.bilingualStanzaBox,
                { borderColor: borderColor, backgroundColor: isDark ? "#0F172A" : "#F4ECE1" },
              ]}
            >
              <View style={styles.stanzaBadge}>
                <Text style={styles.stanzaBadgeText}>Stanza {idx + 1}</Text>
              </View>
              {stanzasEn[idx] && (
                <View style={styles.langBlock}>
                  <Text style={[styles.langTag, { color: subtitleColor }]}>English</Text>
                  <Text style={[styles.lyricsText, { fontSize: scale, color: textColor, lineHeight: scale * 1.6 }]}>
                    {stanzasEn[idx]}
                  </Text>
                </View>
              )}
              {stanzasTwi[idx] && (
                <View style={[styles.langBlock, { marginTop: 12 }]}>
                  <Text style={[styles.langTag, { color: subtitleColor }]}>Twi</Text>
                  <Text style={[styles.lyricsText, { fontSize: scale, color: textColor, lineHeight: scale * 1.6 }]}>
                    {stanzasTwi[idx]}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      );
    }

    const lyrics =
      language === LANGUAGES.TWI && lyricsTwi ? lyricsTwi : lyricsEn;

    return (
      <View style={styles.lyricsContainer}>
        <Text style={[styles.lyricsText, { fontSize: scale, color: textColor, lineHeight: scale * 1.7 }]}>
          {lyrics}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
        {/* Top Control Bar */}
        <View style={[styles.toolbar, { backgroundColor: toolbarBg, borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <IconX size={24} color={textColor} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.centerInfo}>
            <Text style={[styles.hymnNumberBadge, { color: subtitleColor }]}>
              HYMN #{hymn.hymn_number}
            </Text>
          </View>

          {/* Controls: Theme & Font sizing */}
          <View style={styles.toolActions}>
            <TouchableOpacity
              onPress={() => setThemeMode((m) => (m === "dark" ? "parchment" : "dark"))}
              style={styles.iconBtn}
            >
              {isDark ? (
                <IconSun size={22} color={textColor} strokeWidth={2} />
              ) : (
                <IconMoon size={22} color={textColor} strokeWidth={2} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setScale((s) => Math.max(16, s - 2))}
              style={styles.iconBtn}
            >
              <Text style={[styles.fontBtnText, { color: textColor }]}>A-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setScale((s) => Math.min(38, s + 2))}
              style={styles.iconBtn}
            >
              <Text style={[styles.fontBtnText, { color: textColor }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hymn Body */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={(e) => {
            scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {/* Header Title */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: textColor }]}>
              {language === LANGUAGES.TWI && titleTwi ? titleTwi : titleEn}
            </Text>
            {hymn.composer && (
              <Text style={[styles.composer, { color: subtitleColor }]}>
                {hymn.composer}
              </Text>
            )}
            {hymn.scripture_reference && (
              <Text style={[styles.scripture, { color: subtitleColor }]}>
                {hymn.scripture_reference}
              </Text>
            )}
          </View>

          {displayLyrics()}

          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Floating Bottom Auto-Scroll Bar */}
        <View style={[styles.bottomBar, { backgroundColor: toolbarBg, borderColor }]}>
          <TouchableOpacity
            style={[
              styles.scrollToggleBtn,
              { backgroundColor: isAutoScrolling ? "#C89D3C" : isDark ? "#1E293B" : "#E2D8C3" },
            ]}
            onPress={() => setIsAutoScrolling((prev) => !prev)}
          >
            {isAutoScrolling ? (
              <IconPlayerPauseFilled size={18} color="#000000" />
            ) : (
              <IconPlayerPlayFilled size={18} color={textColor} />
            )}
            <Text
              style={[
                styles.scrollToggleText,
                { color: isAutoScrolling ? "#000000" : textColor },
              ]}
            >
              {isAutoScrolling ? "Pause Auto-Scroll" : "Start Auto-Scroll"}
            </Text>
          </TouchableOpacity>

          {/* Speed Pills */}
          <View style={styles.speedPills}>
            {[0.5, 1, 2].map((spd) => (
              <TouchableOpacity
                key={spd}
                style={[
                  styles.speedPill,
                  scrollSpeed === spd && { backgroundColor: "#C89D3C" },
                ]}
                onPress={() => setScrollSpeed(spd)}
              >
                <Text
                  style={[
                    styles.speedPillText,
                    { color: scrollSpeed === spd ? "#000000" : textColor },
                  ]}
                >
                  {spd}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  centerInfo: {
    alignItems: "center",
  },
  hymnNumberBadge: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  toolActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  fontBtnText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 157, 60, 0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  composer: {
    fontSize: 15,
    fontWeight: "600",
  },
  scripture: {
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 4,
  },
  lyricsContainer: {
    gap: 24,
  },
  lyricsText: {
    fontWeight: "500",
    textAlign: "center",
  },
  bilingualStanzaBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  stanzaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#C89D3C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  stanzaBadgeText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "bold",
  },
  langBlock: {},
  langTag: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  scrollToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  scrollToggleText: {
    fontSize: 14,
    fontWeight: "700",
  },
  speedPills: {
    flexDirection: "row",
    gap: 6,
  },
  speedPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  speedPillText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default PresentationModal;
