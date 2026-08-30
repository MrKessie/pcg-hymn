// src/screens/DownloadsScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import HymnCard from '../components/HymnCard';
import { useHymnStore } from '../stores/hymnStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors } from '../theme/theme';
import { getTotalDownloadSize } from '../services/audioService';
import { formatFileSize } from '../utils/helpers';

const DownloadsScreen = ({ navigation }) => {
  const { downloads, loadDownloads } = useHymnStore();
  const [totalSize, setTotalSize] = useState(0);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDownloads();
      loadSize();
    });
    return unsubscribe;
  }, [navigation]);

  const loadSize = async () => {
    const size = await getTotalDownloadSize();
    setTotalSize(size);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {downloads.length > 0 && (
        <View style={[styles.sizeInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sizeText, { color: colors.textSecondary }]}>
            {downloads.length} downloaded • {formatFileSize(totalSize)} used
          </Text>
        </View>
      )}

      {downloads.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📥</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No downloaded audio yet{'\n'}Download hymns for offline playback
          </Text>
        </View>
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HymnCard
              hymn={{ ...item, is_downloaded: true }}
              onPress={() =>
                navigation.navigate('HymnDetail', {
                  hymnId: item.id,
                  hymnNumber: item.hymn_number,
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sizeInfo: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sizeText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});

export default DownloadsScreen;