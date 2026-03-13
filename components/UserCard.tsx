import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { User, BUTTON_CATEGORY_COLORS } from "../lib/types";
import PointButton from "./PointButton";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/themes";

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
        <PointButton
          points={5}
          label="+5"
          backgroundColor={BUTTON_CATEGORY_COLORS.bonus}
          onPress={(p) => onGivePoints(user.id, p)}
        />
        <View style={styles.stack}>
          <PointButton
            points={-10}
            label="Body -10"
            backgroundColor={BUTTON_CATEGORY_COLORS.body}
            onPress={(p) => onGivePoints(user.id, p)}
          />
          <PointButton
            points={-30}
            label="Body -30"
            backgroundColor={BUTTON_CATEGORY_COLORS.body}
            onPress={(p) => onGivePoints(user.id, p)}
          />
        </View>
        <View style={styles.stack}>
          <PointButton
            points={-5}
            label="Other -5"
            backgroundColor={BUTTON_CATEGORY_COLORS.other}
            onPress={(p) => onGivePoints(user.id, p)}
          />
          <PointButton
            points={-20}
            label="Other -20"
            backgroundColor={BUTTON_CATEGORY_COLORS.other}
            onPress={(p) => onGivePoints(user.id, p)}
          />
        </View>
        <PointButton
          points={-50}
          label="-50"
          backgroundColor={BUTTON_CATEGORY_COLORS.crazy}
          onPress={(p) => onGivePoints(user.id, p)}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      marginBottom: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
    },
    total: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    stack: {
      flexDirection: "column",
      gap: 6,
    },
  });
