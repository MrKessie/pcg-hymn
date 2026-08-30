// src/components/AudioControls.jsx
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
} from "@tabler/icons-react-native";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlayerStore } from "../stores/playerStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";
import { formatDuration } from "../utils/helpers";

const AudioControls = () => {
  const { isPlaying, isLoading, position, duration, togglePlayPause, seekTo } = usePlayerStore();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
      </View>

      <View style={styles.controls}>
        {/* Time */}
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {formatDuration(position / 1000)}
        </Text>

        {/* Rewind */}
        <TouchableOpacity onPress={() => seekTo(Math.max(0, position - 10000))}>
          <IconPlayerTrackPrev size={26} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: colors.primary }]}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : isPlaying ? (
            <IconPlayerPauseFilled size={26} color="#FFFFFF" />
          ) : (
            <IconPlayerPlayFilled size={26} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Forward */}
        <TouchableOpacity onPress={() => seekTo(Math.min(duration, position + 10000))}>
          <IconPlayerTrackNext size={26} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>

        {/* Duration */}
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {formatDuration(duration / 1000)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  progressBar: {
    height: 4,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    fontSize: 13,
    minWidth: 40,
    textAlign: "center",
  },
});

export default AudioControls;