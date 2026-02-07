import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PointEvent, User } from '../lib/types';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/themes';

interface HistoryItemProps {
  event: PointEvent & { user: Pick<User, 'name'> | null };
  onDelete?: (eventId: string) => void;
}

export default function HistoryItem({ event, onDelete }: HistoryItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{event.user?.name || 'Unknown'}</Text>
        <Text style={styles.points}>{event.points} pts</Text>
      </View>
      <Text style={styles.reason}>{event.reason}</Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{formatDate(event.created_at)}</Text>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(event.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.danger,
  },
  reason: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  deleteText: {
    fontSize: 14,
    color: theme.colors.danger,
    fontWeight: '600',
  },
});
