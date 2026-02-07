import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useGroup } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUsers } from '../../hooks/useUsers';
import { usePointHistory } from '../../hooks/usePointHistory';
import GroupSelector from '../../components/GroupSelector';
import UserCard from '../../components/UserCard';
import PointModal from '../../components/PointModal';
import { Theme } from '../../constants/themes';

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function GivePointsScreen() {
  const { selectedGroup } = useGroup();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { users, loading, refresh } = useUsers(selectedGroup?.id || null);
  const { createPointEvent } = usePointHistory(selectedGroup?.id || null);

  const styles = createStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (selectedGroup) {
        refresh();
      }
    }, [selectedGroup, refresh])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleGivePoints = (userId: string, points: number) => {
    const selectedUser = users.find((u) => u.id === userId);
    if (!selectedUser) return;

    setSelectedUserId(userId);
    setSelectedUserName(selectedUser.name);
    setSelectedPoints(points);
    setModalVisible(true);
  };

  const handleConfirm = async (reason: string) => {
    if (!selectedUserId || !user?.id) {
      Alert.alert('Error', 'User not selected');
      setModalVisible(false);
      return;
    }

    const { success, error } = await createPointEvent({
      user_id: selectedUserId,
      points: selectedPoints,
      reason,
      created_by: user.id,
    });

    if (success) {
      setModalVisible(false);
      // Refresh the user list immediately after giving points
      await refresh();
      Alert.alert('Success', 'Points given successfully!');
    } else {
      Alert.alert('Error', error || 'Failed to give points');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedUserId(null);
    setSelectedUserName('');
    setSelectedPoints(0);
  };

  return (
    <View style={styles.container}>
      <GroupSelector />

      {!selectedGroup ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Please select or create a group in the Manage tab
          </Text>
        </View>
      ) : loading && users.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No users in this group. Add users in the Manage tab.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onGivePoints={handleGivePoints}
            />
          ))}
        </ScrollView>
      )}

      <PointModal
        visible={modalVisible}
        userName={selectedUserName}
        points={selectedPoints}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}
