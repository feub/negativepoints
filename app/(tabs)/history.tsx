import React from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useGroup } from '../../contexts/GroupContext';
import { useTheme } from '../../contexts/ThemeContext';
import { usePointHistory } from '../../hooks/usePointHistory';
import GroupSelector from '../../components/GroupSelector';
import HistoryItem from '../../components/HistoryItem';
import { Theme } from '../../constants/themes';

export default function HistoryScreen() {
  const { selectedGroup } = useGroup();
  const { theme } = useTheme();
  const { history, loading, refresh, deletePointEvent } = usePointHistory(selectedGroup?.id || null);
  const [refreshing, setRefreshing] = React.useState(false);

  const styles = createStyles(theme);

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

  const handleDelete = (eventId: string) => {
    Alert.alert(
      'Delete Point Event',
      'Are you sure you want to delete this point event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deletePointEvent(eventId);
            if (success) {
              // Refresh the list immediately after deletion
              await refresh();
            } else {
              Alert.alert('Error', error || 'Failed to delete point event');
            }
          },
        },
      ]
    );
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
      ) : loading && history.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No point events yet. Start giving points in the Give Points tab!
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
          <View style={styles.header}>
            <Text style={styles.title}>Point History</Text>
            <Text style={styles.subtitle}>All point events (most recent first)</Text>
          </View>

          {history.map((event) => (
            <HistoryItem key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
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
