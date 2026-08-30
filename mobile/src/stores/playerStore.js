// src/stores/playerStore.js
import { Audio } from "expo-av";
import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
  sound: null,
  currentHymn: null,
  isPlaying: false,
  isLoading: false,
  position: 0,
  duration: 0,
  isVisible: false,
  isExpanded: false,
  playbackRate: 1.0,

  loadAndPlay: async (hymn, audioUri) => {
    try {
      const currentSound = get().sound;
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      set({ isLoading: true, currentHymn: hymn, isVisible: true });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, rate: get().playbackRate, shouldCorrectPitch: true },
        (status) => {
          if (status.isLoaded) {
            set({
              position: status.positionMillis || 0,
              duration: status.durationMillis || 0,
              isPlaying: status.isPlaying,
            });
            if (status.didJustFinish) {
              set({ isPlaying: false, position: 0 });
            }
          }
        },
      );

      set({ sound: newSound, isLoading: false, isPlaying: true });
    } catch (error) {
      console.error("Error loading audio:", error);
      set({ isLoading: false });
    }
  },

  togglePlayPause: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  },

  seekTo: async (positionMillis) => {
    const { sound } = get();
    if (!sound) return;
    try {
      await sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  },

  setPlaybackRate: async (rate) => {
    const { sound } = get();
    set({ playbackRate: rate });
    if (sound) {
      try {
        await sound.setRateAsync(rate, true);
      } catch (error) {
        console.error("Error setting playback rate:", error);
      }
    }
  },

  stop: async () => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error stopping:", error);
      }
    }
    set({
      sound: null,
      currentHymn: null,
      isPlaying: false,
      position: 0,
      duration: 0,
      isVisible: false,
      isExpanded: false,
    });
  },

  expandPlayer: () => set({ isExpanded: true }),
  collapsePlayer: () => set({ isExpanded: false }),
  hidePlayer: () => set({ isVisible: false, isExpanded: false }),
}));
