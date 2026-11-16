import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import ModalShell from './ModalShell';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Cancel is the 56dp primary; the destructive action is the outlined 48dp one. */
function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <ModalShell visible={visible} title={title} onRequestClose={onCancel}>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <PrimaryButton label={cancelLabel} onPress={onCancel} />
        <SecondaryButton label={confirmLabel} onPress={onConfirm} tone="outline" />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  actions: { gap: 10 },
});

export default React.memo(ConfirmModal);
