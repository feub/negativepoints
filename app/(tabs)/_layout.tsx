import { Tabs } from "expo-router";
import { useMemo } from "react";
import { Text, Image } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      headerStyle: { backgroundColor: theme.colors.card },
      headerTintColor: theme.colors.text,
      headerLeft: () => (
        <Image
          source={require("../../assets/favicon.png")}
          style={{
            width: 28,
            height: 28,
            marginLeft: 12,
            marginRight: 4,
            borderRadius: 6,
          }}
        />
      ),
      tabBarStyle: { backgroundColor: theme.colors.card },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
    }),
    [theme],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="give-points"
        options={{
          title: "Give Points",
          tabBarLabel: "Give Points",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⚡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="scoreboard"
        options={{
          title: "Scoreboard",
          tabBarLabel: "Scoreboard",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📜</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "Manage",
          tabBarLabel: "Manage",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
