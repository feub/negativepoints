import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useGroup } from '../contexts/GroupContext';
import { useTheme } from '../contexts/ThemeContext';
import { useGroups } from '../hooks/useGroups';
import { Group } from '../lib/types';
import { Theme } from '../constants/themes';

export default function GroupSelector() {
  const { selectedGroup, setSelectedGroup } = useGroup();
  const { theme, isDarkMode } = useTheme();
  const { groups, loading } = useGroups();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const styles = createStyles(theme, isDarkMode);

  const handleSelectGroup = async (group: Group) => {
    await setSelectedGroup(group);
    setShowDropdown(false);
  };

  if (loading && groups.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noGroupText}>No groups yet. Create one in Manage tab.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.label}>
          {selectedGroup ? selectedGroup.name : 'Select a group'}
        </Text>
        <Text style={styles.arrow}>{showDropdown ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdown}>
          <ScrollView style={styles.dropdownScroll}>
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.dropdownItem,
                  selectedGroup?.id === group.id && styles.dropdownItemSelected,
                ]}
                onPress={() => handleSelectGroup(group)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedGroup?.id === group.id && styles.dropdownItemTextSelected,
                  ]}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme, isDarkMode: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    zIndex: 1000,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.cardAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: 200,
    // Remove shadows in dark mode
    ...(isDarkMode ? {} : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdownItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  noGroupText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
