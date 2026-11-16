import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  children: React.ReactNode;
  tone?: 'light' | 'cool';
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

/** Shared SOFT_UI raised surface: 1dp border, 18dp corners, short soft shadow. */
function SoftCard({ children, tone = 'light', padding = 16, style }: Props) {
  return (
    <View
      style={[
        styles.card,
        tone === 'cool' ? styles.cool : styles.light,
        { padding },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadow.card,
  },
  light: { backgroundColor: theme.colors.ui.surface },
  cool: { backgroundColor: theme.colors.ui.surfaceCool },
});

export default React.memo(SoftCard);
