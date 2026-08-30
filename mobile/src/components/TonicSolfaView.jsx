// src/components/TonicSolfaView.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors } from '../theme/theme';

const TonicSolfaView = ({ tonicSolfa }) => {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  if (!tonicSolfa) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Tonic solfa not available
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.primary }]}>Tonic Solfa</Text>
      <Text style={[styles.notation, { color: colors.text }]}>{tonicSolfa}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notation: {
    fontSize: 16,
    fontFamily: undefined,
    lineHeight: 28,
    letterSpacing: 1,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default TonicSolfaView;