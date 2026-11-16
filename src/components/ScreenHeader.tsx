import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_H, H_PADDING, TOP_INSET } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  compact?: boolean;
};

/**
 * The single header used by every screen. Screens differ only by the slots and
 * the title, never by their own copy of this markup.
 */
function ScreenHeader({ title, subtitle, leftSlot, rightSlot, compact = false }: Props) {
  return (
    <View style={[styles.root, compact ? styles.compact : null]}>
      <View style={styles.slot}>{leftSlot || <View style={styles.spacer} />}</View>
      <View style={styles.center}>
        <Text
          style={[styles.title, compact ? styles.titleCompact : null]}
          numberOfLines={2}
          accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.slot}>{rightSlot || <View style={styles.spacer} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: TOP_INSET,
    height: TOP_INSET + HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    backgroundColor: theme.colors.ui.surfaceSoft,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  compact: {
    height: TOP_INSET + 56,
  },
  slot: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  spacer: { width: 48, height: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  titleCompact: { fontSize: 20, lineHeight: 26 },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default React.memo(ScreenHeader);
