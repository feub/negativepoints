import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { GroupProvider } from '../contexts/GroupContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

function AppLayout() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GroupProvider>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </GroupProvider>
    </AuthProvider>
  );
}
