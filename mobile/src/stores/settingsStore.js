// src/stores/settingsStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { DEFAULT_FONT_SIZE, LANGUAGES, STORAGE_KEYS } from "../utils/constants";

export const useSettingsStore = create((set, get) => ({
  language: LANGUAGES.EN,
  fontSize: DEFAULT_FONT_SIZE,
  darkMode: false,
  bilingualMode: false,
  autoScrollSpeed: 1, // 1: normal, 2: fast, 0.5: slow
  isLoaded: false,

  loadSettings: async () => {
    try {
      const [language, fontSize, darkMode, bilingualMode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        AsyncStorage.getItem("bilingual_mode"),
      ]);
      set({
        language: language || LANGUAGES.EN,
        fontSize: fontSize ? parseInt(fontSize) : DEFAULT_FONT_SIZE,
        darkMode: darkMode === "true",
        bilingualMode: bilingualMode === "true",
        isLoaded: true,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      set({ isLoaded: true });
    }
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  setFontSize: async (size) => {
    set({ fontSize: size });
    await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  },

  toggleDarkMode: async () => {
    const newValue = !get().darkMode;
    set({ darkMode: newValue });
    await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, newValue.toString());
  },

  toggleLanguage: async () => {
    const current = get().language;
    const newLang = current === LANGUAGES.EN ? LANGUAGES.TWI : LANGUAGES.EN;
    set({ language: newLang });
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
  },

  toggleBilingualMode: async () => {
    const newVal = !get().bilingualMode;
    set({ bilingualMode: newVal });
    await AsyncStorage.setItem("bilingual_mode", newVal.toString());
  },

  setAutoScrollSpeed: (speed) => {
    set({ autoScrollSpeed: speed });
  },
}));
