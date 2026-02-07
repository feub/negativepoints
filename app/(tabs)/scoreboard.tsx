import React from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useGroup } from '../../contexts/GroupContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useScoreboard } from '../../hooks/useScoreboard';
import GroupSelector from '../../components/GroupSelector';
import ScoreboardItem from '../../components/ScoreboardItem';
import { Theme } from '../../constants/themes';

export default function ScoreboardScreen() {
  const { selectedGroup } = useGroup();
  const { theme } = useTheme();
  const { scoreboard, loading, refresh } = useScoreboard(selectedGroup?.id || null);
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

  return (
    <View style={styles.container}>
      <GroupSelector />

      {!selectedGroup ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Please select or create a group in the Manage tab
          </Text>
        </View>
      ) : loading && scoreboard.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : scoreboard.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No users yet. Add users in the Manage tab and start giving points!
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
            <Text style={styles.title}>Scoreboard</Text>
            <Text style={styles.subtitle}>Most negative wins!</Text>
          </View>

          {scoreboard.map((entry) => (
            <ScoreboardItem key={entry.id} entry={entry} />
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
