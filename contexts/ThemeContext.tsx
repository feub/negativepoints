import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../constants/themes';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_MODE_KEY = '@negativepoints:darkMode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from storage on mount
    loadDarkModePreference();
  }, []);

  const loadDarkModePreference = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(DARK_MODE_KEY);
      if (storedValue !== null) {
        setIsDarkMode(storedValue === 'true');
      }
    } catch (error) {
      // Silently fail - no sensitive data logged
    }
  };

  const toggleTheme = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem(DARK_MODE_KEY, newValue.toString());
    } catch (error) {
      // Silently fail - no sensitive data logged
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
