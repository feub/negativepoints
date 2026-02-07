import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScoreboardEntry } from '../lib/types';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/themes';

interface ScoreboardItemProps {
  entry: ScoreboardEntry;
}

export default function ScoreboardItem({ entry }: ScoreboardItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const getRankStyle = (rank: number) => {
    if (rank === 1) return styles.goldMedal;
    if (rank === 2) return styles.silverMedal;
    if (rank === 3) return styles.bronzeMedal;
    return styles.defaultRank;
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.rank, getRankStyle(entry.rank)]}>
        <Text style={styles.rankText}>{getRankEmoji(entry.rank)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{entry.name}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{entry.total_points}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goldMedal: {
    backgroundColor: theme.colors.gold,
  },
  silverMedal: {
    backgroundColor: theme.colors.silver,
  },
  bronzeMedal: {
    backgroundColor: theme.colors.bronze,
  },
  defaultRank: {
    backgroundColor: theme.colors.cardAlt,
  },
  rankText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.danger,
  },
  pointsLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
