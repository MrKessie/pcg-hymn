// src/screens/SettingsScreen.jsx
import {
  IconArrowsExchange,
  IconBook,
  IconCloudDownload,
  IconInfoCircle,
  IconLanguage,
  IconMoon,
  IconTypography,
} from "@tabler/icons-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { forceFullSync } from "../services/syncService";
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { FONT_SIZE_OPTIONS, LANGUAGE_LABELS } from "../utils/constants";

const SettingsScreen = () => {
  const [syncing, setSyncing] = useState(false);
  const {
    language,
    fontSize,
    darkMode,
    bilingualMode,
    setFontSize,
    toggleDarkMode,
    toggleLanguage,
    toggleBilingualMode,
  } = useSettingsStore();

  const { loadHymns, loadCategories } = useHymnStore();
  const colors = getThemeColors(darkMode);

  const handleSync = async () => {
    setSyncing(true);
    const result = await forceFullSync();
    await loadHymns();
    await loadCategories();
    setSyncing(false);

    if (result.synced) {
      Alert.alert("Sync Complete", `Synced ${result.hymnsCount || 0} hymns`);
    } else {
      Alert.alert(
        "Sync Notice",
        result.reason || "Using local database. Check internet to update.",
      );
    }
  };

  const SettingRow = ({
    IconComponent,
    label,
    value,
    onPress,
    rightComponent,
    color = colors.primary,
  }) => {
    const RowWrapper = onPress ? TouchableOpacity : View;
    return (
      <RowWrapper
        style={[styles.row, { borderBottomColor: colors.borderLight }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.rowIconWrap, { backgroundColor: colors.surfaceCard }]}>
          {IconComponent && <IconComponent size={20} color={color} strokeWidth={2} />}
        </View>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {value ? (
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
            {value}
          </Text>
        ) : null}
        {rightComponent}
      </RowWrapper>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}>
      {/* LANGUAGE PREFERENCES */}
      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
        LANGUAGE & SCRIPTURE
      </Text>
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <SettingRow
          IconComponent={IconLanguage}
          label="Primary Language"
          value={LANGUAGE_LABELS[language]}
          onPress={toggleLanguage}
        />
        <SettingRow
          IconComponent={IconArrowsExchange}
          label="Default Bilingual Stanzas"
          onPress={toggleBilingualMode}
          rightComponent={
            <Switch
              value={bilingualMode}
              onValueChange={toggleBilingualMode}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          }
        />
      </View>

      {/* DISPLAY & READING */}
      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
        DISPLAY & READING
      </Text>
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <SettingRow
          IconComponent={IconMoon}
          label="Dark Mode"
          onPress={toggleDarkMode}
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          }
        />
        <SettingRow IconComponent={IconTypography} label="Lyrics Font Size" value={`${fontSize}px`} />
        <View style={styles.fontSizeRow}>
          {FONT_SIZE_OPTIONS.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.fontSizeBtn,
                {
                  backgroundColor:
                    fontSize === size ? colors.primary : colors.surfaceCard,
                  borderColor:
                    fontSize === size ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFontSize(size)}
            >
              <Text
                style={{
                  color: fontSize === size ? "#FFFFFF" : colors.text,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CLOUD & SYNC */}
      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
        DATA & OFFLINE SYNC
      </Text>
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <SettingRow
          IconComponent={IconCloudDownload}
          label={syncing ? "Syncing Hymns..." : "Sync Latest Hymns from Cloud"}
          onPress={syncing ? null : handleSync}
          color={colors.primary}
        />
      </View>

      {/* ABOUT */}
      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
        ABOUT
      </Text>
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <SettingRow
          IconComponent={IconBook}
          label="Presbyterian Church of Ghana"
          value="Official Hymnal"
        />
        <SettingRow
          IconComponent={IconInfoCircle}
          label="App Version"
          value="1.0.0"
        />
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  fontSizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fontSizeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;