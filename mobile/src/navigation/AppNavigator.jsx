// src/navigation/AppNavigator.jsx
import {
  IconBook,
  IconBooks,
  IconCompass,
  IconHome,
} from "@tabler/icons-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FullPlayerModal from "../components/FullPlayerModal";
import { useSettingsStore } from "../stores/settingsStore";
import { getThemeColors } from "../theme/theme";

import ExploreScreen from "../screens/ExploreScreen";
import HomeScreen from "../screens/HomeScreen";
import HymnDetailScreen from "../screens/HymnDetailScreen";
import HymnListScreen from "../screens/HymnListScreen";
import LibraryScreen from "../screens/LibraryScreen";
import LiturgyDetailScreen from "../screens/LiturgyDetailScreen";
import PlaylistDetailScreen from "../screens/PlaylistDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = (colors) => ({
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: "#FFFFFF",
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  headerBackTitle: "",
  headerBackTitleVisible: false,
});

const HomeStack = () => {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  return (
    <Stack.Navigator screenOptions={screenOptions(colors)}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "PCG Hymnal", headerShown: false }}
      />
      <Stack.Screen
        name="HymnDetail"
        component={HymnDetailScreen}
        options={({ route }) => ({
          title: `Hymn #${route.params?.hymnNumber || ""}`,
        })}
      />
      <Stack.Screen
        name="LiturgyDetail"
        component={LiturgyDetailScreen}
        options={{ title: "Creeds & Liturgy" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Preferences" }}
      />
    </Stack.Navigator>
  );
};

const HymnStack = () => {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  return (
    <Stack.Navigator screenOptions={screenOptions(colors)}>
      <Stack.Screen
        name="HymnList"
        component={HymnListScreen}
        options={{ title: "All Hymns" }}
      />
      <Stack.Screen
        name="HymnDetail"
        component={HymnDetailScreen}
        options={({ route }) => ({
          title: `Hymn #${route.params?.hymnNumber || ""}`,
        })}
      />
    </Stack.Navigator>
  );
};

const ExploreStack = () => {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  return (
    <Stack.Navigator screenOptions={screenOptions(colors)}>
      <Stack.Screen
        name="ExploreMain"
        component={ExploreScreen}
        options={{ title: "Explore & Liturgy" }}
      />
      <Stack.Screen
        name="LiturgyDetail"
        component={LiturgyDetailScreen}
        options={{ title: "Liturgy" }}
      />
      <Stack.Screen
        name="HymnDetail"
        component={HymnDetailScreen}
        options={({ route }) => ({
          title: `Hymn #${route.params?.hymnNumber || ""}`,
        })}
      />
    </Stack.Navigator>
  );
};

const LibraryStack = () => {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  return (
    <Stack.Navigator screenOptions={screenOptions(colors)}>
      <Stack.Screen
        name="LibraryMain"
        component={LibraryScreen}
        options={{ title: "My Library" }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetailScreen}
        options={({ route }) => ({
          title: route.params?.name || "Playlist",
        })}
      />
      <Stack.Screen
        name="HymnDetail"
        component={HymnDetailScreen}
        options={({ route }) => ({
          title: `Hymn #${route.params?.hymnNumber || ""}`,
        })}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const colors = getThemeColors(darkMode);

  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const iconSize = size || 22;
            if (route.name === "HomeTab") {
              return <IconHome size={iconSize} color={color} strokeWidth={2} />;
            } else if (route.name === "HymnsTab") {
              return <IconBook size={iconSize} color={color} strokeWidth={2} />;
            } else if (route.name === "ExploreTab") {
              return <IconCompass size={iconSize} color={color} strokeWidth={2} />;
            } else if (route.name === "LibraryTab") {
              return <IconBooks size={iconSize} color={color} strokeWidth={2} />;
            }
            return <IconHome size={iconSize} color={color} strokeWidth={2} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 56 + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: "Home" }}
        />
        <Tab.Screen
          name="HymnsTab"
          component={HymnStack}
          options={{ title: "Hymns" }}
        />
        <Tab.Screen
          name="ExploreTab"
          component={ExploreStack}
          options={{ title: "Explore" }}
        />
        <Tab.Screen
          name="LibraryTab"
          component={LibraryStack}
          options={{ title: "Library" }}
        />
      </Tab.Navigator>

      {/* Global Expandable Audio Player Modal */}
      <FullPlayerModal />
    </View>
  );
};

export default AppNavigator;
