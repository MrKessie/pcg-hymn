// src/components/PlaylistModal.jsx
import {
  IconCirclePlus,
  IconMusic,
  IconX,
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
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";

const PlaylistModal = ({ visible, onClose, hymnId }) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const { playlists, loadPlaylists, createPlaylist, addToPlaylist } = useHymnStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    if (visible) loadPlaylists();
  }, [visible]);

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }
    await createPlaylist(newPlaylistName.trim());
    const updatedPlaylists = useHymnStore.getState().playlists;
    const newPlaylist = updatedPlaylists[0];
    if (newPlaylist && hymnId) {
      await addToPlaylist(newPlaylist.id, hymnId);
    }
    setNewPlaylistName("");
    setShowCreate(false);
    Alert.alert("Added", "Hymn added to new playlist");
    onClose();
  };

  const handleAddToExisting = async (playlistId) => {
    await addToPlaylist(playlistId, hymnId);
    Alert.alert("Added", "Hymn added to playlist");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Add to Playlist</Text>
            <TouchableOpacity onPress={onClose}>
              <IconX size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {showCreate ? (
            <View style={styles.createSection}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="Playlist name"
                placeholderTextColor={colors.textSecondary}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                autoFocus
              />
              <View style={styles.createButtons}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                  onPress={() => setShowCreate(false)}
                >
                  <Text style={{ color: colors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.createBtn, { backgroundColor: colors.primary }]}
                  onPress={handleCreateAndAdd}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Create & Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.newPlaylistBtn, { borderColor: colors.primary }]}
              onPress={() => setShowCreate(true)}
            >
              <IconCirclePlus size={22} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.newPlaylistText, { color: colors.primary }]}>
                Create New Playlist
              </Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.playlistItem, { borderColor: colors.border }]}
                onPress={() => handleAddToExisting(item.id)}
              >
                <IconMusic size={20} color={colors.primary} strokeWidth={2} />
                <View style={styles.playlistInfo}>
                  <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.playlistCount, { color: colors.textSecondary }]}>
                    {item.hymn_count || 0} hymns
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No playlists yet
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    maxHeight: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  newPlaylistBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 12,
    gap: 10,
  },
  newPlaylistText: {
    fontSize: 16,
    fontWeight: "600",
  },
  createSection: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  createButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  createBtn: {
    padding: 10,
    borderRadius: 8,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "500",
  },
  playlistCount: {
    fontSize: 13,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
});

export default PlaylistModal;