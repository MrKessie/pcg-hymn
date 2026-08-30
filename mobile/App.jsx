// App.jsx
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { initDatabase } from "./src/database/localDb";
import AppNavigator from "./src/navigation/AppNavigator";
import { syncHymns } from "./src/services/syncService";
import { useSettingsStore } from "./src/stores/settingsStore";
import { theme } from "./src/theme/theme";

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const darkMode = useSettingsStore((state) => state.darkMode);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await syncHymns();
      } catch (e) {
        console.warn("Startup error:", e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
