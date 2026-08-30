// src/components/LanguageToggle.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors, theme } from '../theme/theme';
import { LANGUAGES, LANGUAGE_LABELS } from '../utils/constants';

const LanguageToggle = () => {
  const language = useSettingsStore((state) => state.language);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const toggleLanguage = useSettingsStore((state) => state.toggleLanguage);
  const colors = getThemeColors(darkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.button,
          language === LANGUAGES.EN && { backgroundColor: colors.primary },
        ]}
        onPress={() => {
          if (language !== LANGUAGES.EN) toggleLanguage();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            { color: language === LANGUAGES.EN ? '#FFFFFF' : colors.text },
          ]}
        >
          {LANGUAGE_LABELS.en}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          language === LANGUAGES.TWI && { backgroundColor: colors.primary },
        ]}
        onPress={() => {
          if (language !== LANGUAGES.TWI) toggleLanguage();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            { color: language === LANGUAGES.TWI ? '#FFFFFF' : colors.text },
          ]}
        >
          {LANGUAGE_LABELS.twi}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LanguageToggle;