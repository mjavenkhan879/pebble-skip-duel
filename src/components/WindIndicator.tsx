import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../constants/theme';
import { windLabel } from '../utils/format';

type Props = { wind: number };

/** Vector direction mark plus a readable value — never an arrow character. */
function WindIndicator({ wind }: Props) {
  const label = windLabel(wind);
  const dir = wind === 0 ? 0 : wind > 0 ? 1 : -1;
  return (
    <View style={styles.root} accessible accessibilityLabel={'Wind ' + label}>
      <View style={styles.glyph}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          {dir === 0 ? (
            <Path
              d="M4 9 H18 M4 15 H14"
              stroke={theme.colors.text.secondary}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          ) : (
            <Path
              d={
                dir > 0
                  ? 'M3 12 H18 M13 7 L19 12 L13 17'
                  : 'M21 12 H6 M11 7 L5 12 L11 17'
              }
              stroke={theme.colors.lake.deep}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  glyph: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  text: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
});

export default React.memo(WindIndicator);
