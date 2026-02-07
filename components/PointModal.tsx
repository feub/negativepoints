import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { VALIDATION } from '../lib/types';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/themes';

interface PointModalProps {
  visible: boolean;
  userName: string;
  points: number;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
}

export default function PointModal({
  visible,
  userName,
  points,
  onConfirm,
  onCancel,
}: PointModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const styles = createStyles(theme);

  useEffect(() => {
    if (visible) {
      setReason('');
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      return;
    }

    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
    setReason('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Give {points} points</Text>
          <Text style={styles.subtitle}>to {userName}</Text>

          <TextInput
            style={styles.input}
            placeholder="Why? (e.g., spilled coffee)"
            value={reason}
            onChangeText={setReason}
            maxLength={VALIDATION.MAX_REASON_LENGTH}
            multiline
            numberOfLines={3}
            autoFocus
            editable={!loading}
          />

          <Text style={styles.charCount}>
            {reason.length}/{VALIDATION.MAX_REASON_LENGTH}
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                (!reason.trim() || loading) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!reason.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.input,
    color: theme.colors.text,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.cardAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  confirmButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
