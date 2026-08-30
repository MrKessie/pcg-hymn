// src/screens/PlaylistDetailScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import HymnCard from '../components/HymnCard';
import { getPlaylistHymns } from '../database/localDb';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors } from '../theme/theme';

const PlaylistDetailScreen = ({ route, navigation }) => {
  const { playlistId } = route.params;
  const [hymns, setHymns] = useState([]);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHymns();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHymns = async () => {
    const h = await getPlaylistHymns(playlistId);
    setHymns(h);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {hymns.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No hymns in this playlist yet{'\n'}
            Add hymns from the hymn detail page
          </Text>
        </View>
      ) : (
        <FlatList
          data={hymns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HymnCard
              hymn={item}
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

export default PlaylistDetailScreen;