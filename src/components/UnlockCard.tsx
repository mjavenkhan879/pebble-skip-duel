import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ANIM } from '../constants/config';
import { getPebble } from '../constants/pebbles';
import theme from '../constants/theme';
import PebblePreview from './PebblePreview';

type Props = { pebbleId: string; lakeName: string };

/** 72dp unlock card, fades in over 180ms. Contains no interactive child. */
function UnlockCard({ pebbleId, lakeName }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const pebble = getPebble(pebbleId);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: ANIM.modal,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <Animated.View style={[styles.card, { opacity: fade }]}>
      <PebblePreview pebble={pebble} width={64} height={40} />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {'Unlocked: ' + pebble.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {'Earned at ' + lakeName}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.lake.green,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  text: { flex: 1 },
  title: { fontSize: 15, fontWeight: '800', lineHeight: 20, color: theme.colors.text.primary },
  sub: { fontSize: 12, fontWeight: '500', lineHeight: 16, color: theme.colors.text.secondary },
});

export default React.memo(UnlockCard);
