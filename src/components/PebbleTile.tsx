import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { Pebble } from '../constants/pebbles';
import theme from '../constants/theme';
import PebblePreview from './PebblePreview';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  pebble: Pebble;
  size: number;
  unlocked: boolean;
  equipped: boolean;
  previewed: boolean;
  onPress: (id: string) => void;
};

/** Grid cell: artwork, two-line name and collection state. */
function PebbleTile({ pebble, size, unlocked, equipped, previewed, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(pebble.id)}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: previewed }}
      accessibilityLabel={
        pebble.name + (unlocked ? (equipped ? ', equipped' : ', unlocked') : ', locked')
      }
      style={[
        styles.tile,
        { width: size, height: Math.max(88, size + 26) },
        previewed ? styles.previewed : null,
      ]}>
      <View style={styles.art}>
        <PebblePreview
          pebble={pebble}
          width={size - 26}
          height={(size - 26) * 0.62}
          dim={!unlocked}
        />
        {!unlocked ? (
          <View style={styles.lock}>
            <Lock size={16} color={theme.colors.text.secondary} strokeWidth={2.5} />
          </View>
        ) : null}
        {equipped ? (
          <View style={styles.check}>
            <Check size={14} color={theme.colors.text.onAccent} strokeWidth={3} />
          </View>
        ) : null}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {pebble.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    ...theme.shadow.card,
  },
  previewed: { borderColor: theme.colors.lake.purple, borderWidth: 2 },
  art: { alignItems: 'center', justifyContent: 'center' },
  lock: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lake.green,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
    marginTop: 6,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
});

export default React.memo(PebbleTile);
