import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LAKES, LAKE_COUNT, getLake } from '../constants/lakes';
import { LakeRecord } from '../game/types';
import theme from '../constants/theme';
import IconButton from './IconButton';
import SoftCard from './SoftCard';

type Props = {
  selectedId: number;
  records: Record<number, LakeRecord>;
  paintings: number;
  totalPaintings: number;
  onSelect: (id: number) => void;
};

/** Single lake card with 48dp pagers. Selecting never starts a throw. */
function LakeSelector({ selectedId, records, paintings, totalPaintings, onSelect }: Props) {
  const lake = getLake(selectedId);
  const record = records[lake.id];
  const bestText = record && record.best > 0 ? 'Best: ' + String(record.best) + ' skips' : 'No record yet';
  const index = LAKES.findIndex(l => l.id === lake.id);

  const step = (delta: number) => {
    const next = (index + delta + LAKE_COUNT) % LAKE_COUNT;
    onSelect(LAKES[next].id);
  };

  return (
    <SoftCard padding={12} style={styles.card}>
      <View style={styles.row}>
        <IconButton
          Icon={ChevronLeft}
          accessibilityLabel="Previous lake"
          onPress={() => step(-1)}
        />
        <View
          style={styles.center}
          accessible
          accessibilityLabel={'Lake ' + String(index + 1) + ' of ' + String(LAKE_COUNT) + ', ' + lake.name}>
          <Text style={styles.index} numberOfLines={1}>
            {'LAKE ' + String(lake.id) + ' OF ' + String(LAKE_COUNT)}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {lake.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {bestText + '  ·  Target ' + String(lake.target)}
          </Text>
          <Text style={styles.paint} numberOfLines={1}>
            {'Paintings ' + String(paintings) + '/' + String(totalPaintings)}
          </Text>
        </View>
        <IconButton
          Icon={ChevronRight}
          accessibilityLabel="Next lake"
          onPress={() => step(1)}
        />
      </View>
    </SoftCard>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', minHeight: 96, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  center: { flex: 1, alignItems: 'center' },
  index: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
  name: { fontSize: 20, fontWeight: '800', lineHeight: 26, color: theme.colors.text.primary },
  meta: { fontSize: 12, fontWeight: '600', lineHeight: 16, color: theme.colors.text.muted },
  paint: { fontSize: 11, fontWeight: '600', lineHeight: 15, color: theme.colors.lake.deep },
});

export default React.memo(LakeSelector);
