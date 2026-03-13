import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/themes";

interface PointButtonProps {
  points: number;
  label?: string;
  backgroundColor?: string;
  onPress: (points: number) => void;
  disabled?: boolean;
}

export default function PointButton({
  points,
  label,
  backgroundColor,
  onPress,
  disabled,
}: PointButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const bgColor = backgroundColor ?? theme.colors.danger;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        disabled && styles.buttonDisabled,
      ]}
      onPress={() => onPress(points)}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label ?? String(points)}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 6,
      minWidth: 60,
      alignItems: "center",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
  });
