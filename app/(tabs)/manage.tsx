import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useGroup } from '../../contexts/GroupContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useGroups } from '../../hooks/useGroups';
import { useUsers } from '../../hooks/useUsers';
import { router } from 'expo-router';
import { Theme } from '../../constants/themes';

export default function ManageScreen() {
  const { signOut } = useAuth();
  const { selectedGroup } = useGroup();
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const { groups, createGroup, deleteGroup, loading: groupsLoading } = useGroups();
  const { users, createUser, deleteUser, loading: usersLoading } = useUsers(selectedGroup?.id || null);

  const styles = createStyles(theme);

  const [newGroupName, setNewGroupName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setCreatingGroup(true);
    const { success, error } = await createGroup({ name: newGroupName.trim() });
    setCreatingGroup(false);

    if (success) {
      setNewGroupName('');
      Alert.alert('Success', 'Group created successfully');
    } else {
      Alert.alert('Error', error || 'Failed to create group');
    }
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${groupName}"? This will also delete all users in this group.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteGroup(groupId);
            if (!success) {
              Alert.alert('Error', error || 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  const handleCreateUser = async () => {
    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a group first');
      return;
    }

    if (!newUserName.trim()) {
      Alert.alert('Error', 'Please enter a user name');
      return;
    }

    setCreatingUser(true);
    const { success, error } = await createUser({
      name: newUserName.trim(),
      group_id: selectedGroup.id,
    });
    setCreatingUser(false);

    if (success) {
      setNewUserName('');
      Alert.alert('Success', 'User created successfully');
    } else {
      Alert.alert('Error', error || 'Failed to create user');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete "${userName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteUser(userId);
            if (!success) {
              Alert.alert('Error', error || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme throughout the app
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#e0e0e0', true: theme.colors.primary }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Groups</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New group name"
            value={newGroupName}
            onChangeText={setNewGroupName}
            maxLength={50}
          />
          <TouchableOpacity
            style={[styles.addButton, creatingGroup && styles.buttonDisabled]}
            onPress={handleCreateGroup}
            disabled={creatingGroup}
          >
            {creatingGroup ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.addButtonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>

        {groupsLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <View style={styles.list}>
            {groups.map((group) => (
              <View key={group.id} style={styles.item}>
                <Text style={styles.itemName}>{group.name}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteGroup(group.id, group.name)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Users {selectedGroup && `in ${selectedGroup.name}`}
        </Text>

        {!selectedGroup ? (
          <Text style={styles.hint}>Select a group to manage users</Text>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="New user name"
                value={newUserName}
                onChangeText={setNewUserName}
                maxLength={50}
              />
              <TouchableOpacity
                style={[styles.addButton, creatingUser && styles.buttonDisabled]}
                onPress={handleCreateUser}
                disabled={creatingUser}
              >
                {creatingUser ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.addButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>

            {usersLoading ? (
              <ActivityIndicator style={styles.loader} />
            ) : (
              <View style={styles.list}>
                {users.map((user) => (
                  <View key={user.id} style={styles.item}>
                    <View style={styles.userInfo}>
                      <Text style={styles.itemName}>{user.name}</Text>
                      <Text style={styles.userPoints}>{user.total_points} pts</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteUser(user.id, user.name)}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.cardAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemName: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  userPoints: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  deleteText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  hint: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: theme.colors.danger,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
});
