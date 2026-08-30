// src/components/SearchBar.jsx
import {
  IconCircleX,
  IconSearch,
} from "@tabler/icons-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";

const SearchBar = ({ value, onChangeText, onClear, placeholder = "Search hymns..." }) => {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <IconSearch size={20} color={colors.textSecondary} strokeWidth={2} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={onClear}>
          <IconCircleX size={20} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 46,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
});

export default SearchBar;