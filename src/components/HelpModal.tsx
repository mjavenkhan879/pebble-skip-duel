import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import ModalShell from './ModalShell';
import PrimaryButton from './PrimaryButton';

type Props = { visible: boolean; onDismiss: () => void };

const STEPS = [
  { key: 'angle', title: 'Set angle', body: 'Around 14 degrees keeps the pebble flat on the water.' },
  { key: 'flick', title: 'Flick upward', body: 'A faster upward swipe gives a stronger throw.' },
  { key: 'wind', title: 'Read the wind', body: 'Crosswind pushes the pebble toward one bank.' },
];

function HelpModal({ visible, onDismiss }: Props) {
  return (
    <ModalShell visible={visible} title="How to play" onRequestClose={onDismiss}>
      <View style={styles.list}>
        {STEPS.map((step, i) => (
          <View key={step.key} style={styles.step}>
            <View style={styles.num}>
              <Text style={styles.numText}>{String(i + 1)}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>
      <PrimaryButton label="GOT IT" onPress={onDismiss} />
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  num: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lake.green,
  },
  numText: { fontSize: 14, fontWeight: '800', lineHeight: 18, color: theme.colors.text.onAccent },
  body: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20, color: theme.colors.text.primary },
  stepBody: { fontSize: 13, fontWeight: '400', lineHeight: 18, color: theme.colors.text.muted },
});

export default React.memo(HelpModal);
