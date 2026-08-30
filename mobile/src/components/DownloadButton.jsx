// src/components/DownloadButton.jsx
import {
  IconCloudCheck,
  IconDownload,
} from "@tabler/icons-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteDownloadedAudio, downloadAudio } from "../services/audioService";
import { useHymnStore } from "../stores/hymnStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";

const DownloadButton = ({ hymn }) => {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const loadDownloads = useHymnStore((state) => state.loadDownloads);
  const loadHymns = useHymnStore((state) => state.loadHymns);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  const handleDownload = async () => {
    if (!hymn.audio_url) {
      Alert.alert("No Audio", "This hymn does not have an audio track yet.");
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    const result = await downloadAudio(hymn.id, hymn.audio_url, (p) => {
      setProgress(p);
    });

    setIsDownloading(false);

    if (result.success) {
      await loadDownloads();
      await loadHymns();
      Alert.alert("Downloaded", "Audio saved for offline playback.");
    } else {
      Alert.alert("Error", "Failed to download audio. Please try again.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Remove Download", "Delete this audio from your device?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDownloadedAudio(hymn.id);
          await loadDownloads();
          await loadHymns();
        },
      },
    ]);
  };

  if (isDownloading) {
    return (
      <View style={[styles.button, { backgroundColor: colors.border }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.buttonText, { color: colors.primary }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    );
  }

  if (hymn.is_downloaded) {
    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.surfaceCard, borderColor: colors.border, borderWidth: 1 }]}
        onPress={handleDelete}
      >
        <IconCloudCheck size={20} color={colors.primary} strokeWidth={2} />
        <Text style={[styles.buttonText, { color: colors.primary }]}>Saved</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surfaceCard, borderColor: colors.border, borderWidth: 1 }]}
      onPress={handleDownload}
    >
      <IconDownload size={20} color={colors.text} strokeWidth={2} />
      <Text style={[styles.buttonText, { color: colors.text }]}>Download</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default DownloadButton;