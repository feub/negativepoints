import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../lib/types';

interface GroupContextType {
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group | null) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const SELECTED_GROUP_KEY = '@negativepoints:selectedGroup';

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroup, setSelectedGroupState] = useState<Group | null>(null);

  useEffect(() => {
    // Load selected group from storage on mount
    loadSelectedGroup();
  }, []);

  const loadSelectedGroup = async () => {
    try {
      const storedGroup = await AsyncStorage.getItem(SELECTED_GROUP_KEY);
      if (storedGroup) {
        setSelectedGroupState(JSON.parse(storedGroup));
      }
    } catch (error) {
      // Silently fail - no sensitive data logged
    }
  };

  const setSelectedGroup = async (group: Group | null) => {
    try {
      setSelectedGroupState(group);
      if (group) {
        await AsyncStorage.setItem(SELECTED_GROUP_KEY, JSON.stringify(group));
      } else {
        await AsyncStorage.removeItem(SELECTED_GROUP_KEY);
      }
    } catch (error) {
      // Silently fail - no sensitive data logged
    }
  };

  return (
    <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}
