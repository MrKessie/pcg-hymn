// src/screens/FavoritesScreen.jsx
import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import HymnCard from '../components/HymnCard';
import MiniPlayer from '../components/MiniPlayer';
import { useHymnStore } from '../stores/hymnStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors } from '../theme/theme';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, loadFavorites } = useHymnStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>❤️</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No favorites yet{'\n'}Tap the heart icon on any hymn to add it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
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
      <MiniPlayer />
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
    paddingBottom: 80,
  },
});

export default FavoritesScreen;