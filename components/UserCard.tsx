import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, VALIDATION } from '../lib/types';
import PointButton from './PointButton';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/themes';

interface UserCardProps {
  user: User;
  onGivePoints: (userId: string, points: number) => void;
}

export default function UserCard({ user, onGivePoints }: UserCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.total}>{user.total_points} pts</Text>
      </View>
      <View style={styles.buttons}>
        {VALIDATION.PRESET_POINTS.map((points) => (
          <PointButton
            key={points}
            points={points}
            onPress={(p) => onGivePoints(user.id, p)}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  total: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
