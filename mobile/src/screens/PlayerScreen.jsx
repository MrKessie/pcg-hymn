// src/screens/PlayerScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AudioControls from '../components/AudioControls';
import { usePlayerStore } from '../stores/playerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors } from '../theme/theme';

const PlayerScreen = () => {
  const { currentHymn } = usePlayerStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  if (!currentHymn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hymn playing</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.number}>{currentHymn.hymn_number}</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{currentHymn.title_en}</Text>
        {currentHymn.composer && (
          <Text style={[styles.composer, { color: colors.textSecondary }]}>{currentHymn.composer}</Text>
        )}
      </View>
      <AudioControls />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    marginHorizontal: 32,
    padding: 32,
    borderRadius: 16,
    marginBottom: 24,
  },
  numberBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  number: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  composer: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PlayerScreen;