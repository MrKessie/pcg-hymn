// src/screens/PlaylistsScreen.jsx
import {
  IconChevronRight,
  IconCirclePlus,
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
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";

const PlaylistsScreen = ({ navigation }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const { playlists, loadPlaylists, createPlaylist, deletePlaylist } = useHymnStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadPlaylists();
    });
    return unsubscribe;
  }, [navigation]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }
    await createPlaylist(newName.trim());
    setNewName("");
    setShowCreate(false);
  };

  const handleDelete = (playlist) => {
    Alert.alert("Delete Playlist", `Delete "${playlist.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePlaylist(playlist.id),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.createBtn, { borderColor: colors.primary }]}
        onPress={() => setShowCreate(true)}
      >
        <IconCirclePlus size={24} color={colors.primary} strokeWidth={2} />
        <Text style={[styles.createText, { color: colors.primary }]}>Create New Playlist</Text>
      </TouchableOpacity>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.playlistCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate("PlaylistDetail", { playlistId: item.id, name: item.name })}
            onLongPress={() => handleDelete(item)}
          >
            <View style={[styles.playlistIcon, { backgroundColor: colors.primary + "20" }]}>
              <IconMusic size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.playlistInfo}>
              <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.playlistCount, { color: colors.textSecondary }]}>
                {item.hymn_count || 0} hymns
              </Text>
            </View>
            <IconChevronRight size={20} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No playlists yet{"\n"}Create one to organize your hymns
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Create Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Playlist</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Playlist name"
              placeholderTextColor={colors.textSecondary}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => { setShowCreate(false); setNewName(""); }}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreate}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    gap: 8,
  },
  createText: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 20,
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  playlistIcon: {
    width: 48,
    height: 48,
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
    fontWeight: "600",
  },
  playlistCount: {
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default PlaylistsScreen;