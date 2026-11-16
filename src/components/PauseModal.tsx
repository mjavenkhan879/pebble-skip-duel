import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Play } from 'lucide-react-native';
import theme from '../constants/theme';
import ModalShell from './ModalShell';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

type Props = {
  visible: boolean;
  duel: boolean;
  onResume: () => void;
  onLeave: () => void;
};

/** Simulation, timers and effects stay suspended behind this panel. */
function PauseModal({ visible, duel, onResume, onLeave }: Props) {
  return (
    <ModalShell visible={visible} title="Paused" onRequestClose={onResume}>
      <Text style={styles.note}>
        {duel
          ? 'Leaving ends this duel. The current throw is abandoned and no record is saved.'
          : 'Leaving abandons this throw. No record is saved.'}
      </Text>
      <View style={styles.actions}>
        <PrimaryButton label="RESUME" onPress={onResume} Icon={Play} />
        <SecondaryButton label="LAKESIDE" onPress={onLeave} Icon={Home} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  note: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  actions: { gap: 10 },
});

export default React.memo(PauseModal);
