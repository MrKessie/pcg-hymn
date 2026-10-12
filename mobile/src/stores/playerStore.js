// src/stores/playerStore.js
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { create } from "zustand";

let statusSubscription = null;

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
      if (statusSubscription) {
        statusSubscription.remove();
        statusSubscription = null;
      }
      if (currentSound) {
        try {
          currentSound.pause();
          currentSound.release();
        } catch (_) {}
      }

      set({ isLoading: true, currentHymn: hymn, isVisible: true, position: 0, duration: 0 });

      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
        });
      } catch (e) {
        console.warn("Failed to set audio mode:", e);
      }

      const player = createAudioPlayer({ uri: audioUri });
      player.playbackRate = get().playbackRate;

      statusSubscription = player.addListener("playbackStatusUpdate", (status) => {
        const currentTimeMs = Math.round((status.currentTime || 0) * 1000);
        const durationMs = Math.round((status.duration || 0) * 1000);

        set({
          position: currentTimeMs,
          duration: durationMs,
          isPlaying: status.playing ?? player.playing,
        });

        if (status.didJustFinish) {
          set({ isPlaying: false, position: 0 });
        }
      });

      player.play();
      set({ sound: player, isLoading: false, isPlaying: true });
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
        sound.pause();
        set({ isPlaying: false });
      } else {
        sound.play();
        set({ isPlaying: true });
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  },

  seekTo: async (positionMillis) => {
    const { sound } = get();
    if (!sound) return;
    try {
      const positionSeconds = positionMillis / 1000;
      sound.seekTo(positionSeconds);
      set({ position: positionMillis });
    } catch (error) {
      console.error("Error seeking:", error);
    }
  },

  setPlaybackRate: async (rate) => {
    const { sound } = get();
    set({ playbackRate: rate });
    if (sound) {
      try {
        sound.playbackRate = rate;
      } catch (error) {
        console.error("Error setting playback rate:", error);
      }
    }
  },

  stop: async () => {
    const { sound } = get();
    if (statusSubscription) {
      statusSubscription.remove();
      statusSubscription = null;
    }
    if (sound) {
      try {
        sound.pause();
        sound.release();
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
