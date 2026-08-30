// src/components/QuickDialPadModal.jsx
import {
  IconBackspace,
  IconBook,
  IconDialpad,
  IconX,
} from "@tabler/icons-react-native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getHymnByNumber } from "../database/localDb";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors, theme } from "../theme/theme";
import { LANGUAGES } from "../utils/constants";

const QuickDialPadModal = ({ visible, onClose, onSelectHymn }) => {
  const [digits, setDigits] = useState("");
  const [matchedHymn, setMatchedHymn] = useState(null);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const language = useSettingsStore((state) => state.language);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    if (!visible) {
      setDigits("");
      setMatchedHymn(null);
      return;
    }
  }, [visible]);

  useEffect(() => {
    if (digits) {
      const num = parseInt(digits, 10);
      if (!isNaN(num)) {
        const hymn = getHymnByNumber(num);
        setMatchedHymn(hymn || null);
      }
    } else {
      setMatchedHymn(null);
    }
  }, [digits]);

  const handlePressDigit = (num) => {
    if (digits.length >= 4) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setDigits((prev) => prev + num);
  };

  const handleDelete = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setDigits((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setDigits("");
  };

  const handleGo = () => {
    if (matchedHymn) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      onClose();
      onSelectHymn(matchedHymn);
    }
  };

  const DialButton = ({ label, IconComponent, onPress, isSpecial = false }) => (
    <TouchableOpacity
      style={[
        styles.dialBtn,
        {
          backgroundColor: isSpecial
            ? colors.surfaceCard
            : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {IconComponent ? (
        <IconComponent size={24} color={colors.text} strokeWidth={2} />
      ) : (
        <Text style={[styles.dialBtnText, { color: colors.text }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );

  const hymnTitle = matchedHymn
    ? language === LANGUAGES.TWI && matchedHymn.title_twi
      ? matchedHymn.title_twi
      : matchedHymn.title_en
    : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <IconDialpad size={20} color={colors.secondary} strokeWidth={2} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Jump to Hymn
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <IconX size={24} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Number Display */}
          <View
            style={[
              styles.displayBox,
              { backgroundColor: colors.surfaceCard, borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                styles.displayText,
                { color: digits ? colors.primary : colors.textLight },
              ]}
            >
              {digits ? `#${digits}` : "Enter Hymn #"}
            </Text>
            {hymnTitle ? (
              <Text
                style={[styles.previewTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {hymnTitle}
              </Text>
            ) : digits ? (
              <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
                No hymn found for #{digits}
              </Text>
            ) : (
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                Quickly jump directly to any hymn
              </Text>
            )}
          </View>

          {/* 3x4 Keypad Grid */}
          <View style={styles.keypad}>
            <View style={styles.row}>
              <DialButton label="1" onPress={() => handlePressDigit("1")} />
              <DialButton label="2" onPress={() => handlePressDigit("2")} />
              <DialButton label="3" onPress={() => handlePressDigit("3")} />
            </View>
            <View style={styles.row}>
              <DialButton label="4" onPress={() => handlePressDigit("4")} />
              <DialButton label="5" onPress={() => handlePressDigit("5")} />
              <DialButton label="6" onPress={() => handlePressDigit("6")} />
            </View>
            <View style={styles.row}>
              <DialButton label="7" onPress={() => handlePressDigit("7")} />
              <DialButton label="8" onPress={() => handlePressDigit("8")} />
              <DialButton label="9" onPress={() => handlePressDigit("9")} />
            </View>
            <View style={styles.row}>
              <DialButton
                label="C"
                onPress={handleClear}
                isSpecial
              />
              <DialButton label="0" onPress={() => handlePressDigit("0")} />
              <DialButton
                IconComponent={IconBackspace}
                onPress={handleDelete}
                isSpecial
              />
            </View>
          </View>

          {/* Action Go Button */}
          <TouchableOpacity
            style={[
              styles.goBtn,
              {
                backgroundColor: matchedHymn ? colors.primary : colors.border,
                opacity: matchedHymn ? 1 : 0.6,
              },
            ]}
            onPress={handleGo}
            disabled={!matchedHymn}
          >
            <IconBook
              size={20}
              color={matchedHymn ? "#FFFFFF" : colors.textSecondary}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.goBtnText,
                { color: matchedHymn ? "#FFFFFF" : colors.textSecondary },
              ]}
            >
              {matchedHymn ? `Open Hymn #${digits}` : "Select a Valid Hymn"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    padding: 20,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  displayBox: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 18,
  },
  displayText: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  notFoundText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
  },
  keypad: {
    gap: 10,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dialBtn: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialBtnText: {
    fontSize: 22,
    fontWeight: "700",
  },
  goBtn: {
    flexDirection: "row",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  goBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default QuickDialPadModal;
