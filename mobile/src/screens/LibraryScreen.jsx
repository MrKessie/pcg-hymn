// src/screens/LibraryScreen.jsx
import {
  IconChevronRight,
  IconCirclePlus,
  IconCloudCheck,
  IconDownload,
  IconHeart,
  IconHistory,
  IconMusic,
} from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HymnCard from "../components/HymnCard";
import MiniPlayer from "../components/MiniPlayer";
import { getTotalDownloadSize } from "../services/audioService";
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { formatFileSize } from "../utils/helpers";

const LibraryScreen = ({ navigation }) => {
  const [activeSegment, setActiveSegment] = useState("favorites"); // 'favorites' | 'playlists' | 'downloads' | 'history'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [totalDownloadSize, setTotalDownloadSize] = useState(0);

  const {
    favorites,
    playlists,
    downloads,
    history,
    loadFavorites,
    loadPlaylists,
    loadDownloads,
    loadHistory,
    createPlaylist,
    deletePlaylist,
    clearHistory,
  } = useHymnStore();

  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadAll();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAll = async () => {
    loadFavorites();
    loadPlaylists();
    loadDownloads();
    loadHistory();
    const size = await getTotalDownloadSize();
    setTotalDownloadSize(size);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }
    await createPlaylist(newPlaylistName.trim());
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

  const handleDeletePlaylist = (playlist) => {
    Alert.alert("Delete Playlist", `Delete "${playlist.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePlaylist(playlist.id),
      },
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert("Clear History", "Clear all recently viewed hymns?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => clearHistory(),
      },
    ]);
  };

  const navigateToHymn = (hymn) => {
    navigation.navigate("HymnDetail", {
      hymnId: hymn.id,
      hymnNumber: hymn.hymn_number,
    });
  };

  const renderSegmentIcon = (key, isActive) => {
    const size = 16;
    const color = isActive ? "#FFFFFF" : colors.textSecondary;
    switch (key) {
      case "favorites":
        return <IconHeart size={size} color={color} strokeWidth={2} />;
      case "playlists":
        return <IconMusic size={size} color={color} strokeWidth={2} />;
      case "downloads":
        return <IconDownload size={size} color={color} strokeWidth={2} />;
      case "history":
        return <IconHistory size={size} color={color} strokeWidth={2} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Segmented Control Header */}
      <View
        style={[
          styles.segmentContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {[
          { key: "favorites", label: "Favorites", count: favorites.length },
          { key: "playlists", label: "Playlists", count: playlists.length },
          { key: "downloads", label: "Downloads", count: downloads.length },
          { key: "history", label: "History", count: history.length },
        ].map((seg) => {
          const isActive = activeSegment === seg.key;
          return (
            <TouchableOpacity
              key={seg.key}
              style={[
                styles.segmentBtn,
                isActive && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setActiveSegment(seg.key)}
            >
              {renderSegmentIcon(seg.key, isActive)}
              <Text
                style={[
                  styles.segmentLabel,
                  { color: isActive ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Segment 1: Favorites */}
      {activeSegment === "favorites" && (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HymnCard hymn={item} onPress={() => navigateToHymn(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconHeart
                size={56}
                color={colors.textLight}
                strokeWidth={1.5}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Favorites Yet
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                Tap the heart icon on any hymn to bookmark your favorites here.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Segment 2: Playlists */}
      {activeSegment === "playlists" && (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <TouchableOpacity
              style={[
                styles.createPlaylistBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.secondary,
                },
              ]}
              onPress={() => setShowCreateModal(true)}
            >
              <IconCirclePlus
                size={22}
                color={colors.secondary}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.createPlaylistText,
                  { color: colors.secondary },
                ]}
              >
                Create New Playlist
              </Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.playlistCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                navigation.navigate("PlaylistDetail", {
                  playlistId: item.id,
                  name: item.name,
                })
              }
              onLongPress={() => handleDeletePlaylist(item)}
            >
              <View
                style={[
                  styles.playlistIcon,
                  { backgroundColor: colors.surfaceCard },
                ]}
              >
                <IconMusic
                  size={24}
                  color={colors.secondary}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.playlistInfo}>
                <Text style={[styles.playlistName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.playlistCount,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.hymn_count || 0} hymns
                </Text>
              </View>
              <IconChevronRight
                size={20}
                color={colors.textLight}
                strokeWidth={2}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconMusic
                size={56}
                color={colors.textLight}
                strokeWidth={1.5}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Playlists
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                Create custom playlists for Sunday services, weddings, or choir rehearsals.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Segment 3: Downloads */}
      {activeSegment === "downloads" && (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            downloads.length > 0 ? (
              <View
                style={[
                  styles.storageInfo,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.border,
                  },
                ]}
              >
                <IconCloudCheck
                  size={20}
                  color={colors.primary}
                  strokeWidth={2}
                />
                <Text style={[styles.storageText, { color: colors.text }]}>
                  {downloads.length} hymns downloaded • {formatFileSize(totalDownloadSize)} used
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <HymnCard
              hymn={{ ...item, is_downloaded: true }}
              onPress={() => navigateToHymn(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconDownload
                size={56}
                color={colors.textLight}
                strokeWidth={1.5}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Offline Audio
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                Download hymns to listen to tunes even when you do not have an internet connection.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Segment 4: History */}
      {activeSegment === "history" && (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            history.length > 0 ? (
              <View style={styles.historyHeader}>
                <Text
                  style={[styles.historySub, { color: colors.textSecondary }]}
                >
                  Recently opened & sung hymns
                </Text>
                <TouchableOpacity onPress={handleClearHistory}>
                  <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 13 }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <HymnCard hymn={item} onPress={() => navigateToHymn(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconHistory
                size={56}
                color={colors.textLight}
                strokeWidth={1.5}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Recent History
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                Hymns you view during worship services will show up here for quick access.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Playlist Modal */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create New Playlist
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceCard,
                },
              ]}
              placeholder="e.g. Sunday Morning, Communion"
              placeholderTextColor={colors.textLight}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreatePlaylist}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <MiniPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 110,
  },
  createPlaylistBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 8,
  },
  createPlaylistText: {
    fontSize: 15,
    fontWeight: "700",
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  playlistIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "700",
  },
  playlistCount: {
    fontSize: 12,
    marginTop: 2,
  },
  storageInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  storageText: {
    fontSize: 13,
    fontWeight: "600",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  historySub: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  modalInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 18,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default LibraryScreen;
