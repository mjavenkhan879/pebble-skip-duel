import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADING_MAX, HEADING_MIN, POWER_DEFAULT, POWER_STEP } from '../constants/config';
import theme from '../constants/theme';
import { clamp } from '../utils/format';
import ModalShell from './ModalShell';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import StepSlider from './StepSlider';

type Props = {
  visible: boolean;
  angle: number;
  onThrow: (heading: number, power: number) => void;
  onCancel: () => void;
};

/**
 * Button-based throwing. Same simulation as a swipe, no advantage and no score
 * adjustment — it only supplies the same committed parameters.
 */
function ThrowControlsModal({ visible, angle, onThrow, onCancel }: Props) {
  const [heading, setHeading] = useState(0);
  const [power, setPower] = useState(POWER_DEFAULT);

  const commit = useCallback(() => {
    onThrow(clamp(heading, HEADING_MIN, HEADING_MAX), clamp(power / 100, 0, 1));
    setHeading(0);
    setPower(POWER_DEFAULT);
  }, [heading, onThrow, power]);

  return (
    <ModalShell visible={visible} title="Throw controls" onRequestClose={onCancel}>
      <Text style={styles.angle}>{'Angle ' + String(angle) + ' degrees'}</Text>
      <StepSlider
        label="Heading"
        unit=" degrees"
        value={heading}
        min={HEADING_MIN}
        max={HEADING_MAX}
        step={1}
        onChange={setHeading}
      />
      <StepSlider
        label="Power"
        unit="%"
        value={power}
        min={0}
        max={100}
        step={POWER_STEP}
        onChange={setPower}
      />
      <View style={styles.actions}>
        <PrimaryButton label="THROW" onPress={commit} />
        <SecondaryButton label="CANCEL" onPress={onCancel} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  angle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  actions: { gap: 10 },
});

export default React.memo(ThrowControlsModal);
