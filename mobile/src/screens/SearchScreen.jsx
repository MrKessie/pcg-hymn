// src/screens/SearchScreen.jsx
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import HymnCard from '../components/HymnCard';
import MiniPlayer from '../components/MiniPlayer';
import { useHymnStore } from '../stores/hymnStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getThemeColors } from '../theme/theme';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const { searchResults, searchHymns, clearSearch } = useHymnStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  const handleSearch = (text) => {
    setQuery(text);
    searchHymns(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={query}
        onChangeText={handleSearch}
        onClear={() => {
          setQuery('');
          clearSearch();
        }}
        placeholder="Search by number, title, or lyrics..."
      />

      {!query.trim() ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>🔍</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Search by hymn number, title, or lyrics{'\n'}in English or Twi
          </Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No hymns found for &quot;{query}&quot;
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  list: {
    paddingBottom: 80,
  },
});

export default SearchScreen;