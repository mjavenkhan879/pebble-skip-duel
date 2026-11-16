import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import PageControls from '../components/PageControls';
import RecordRow from '../components/RecordRow';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { BOTTOM_INSET, H_PADDING } from '../constants/config';
import { LAKES } from '../constants/lakes';
import { PEBBLES } from '../constants/pebbles';
import theme from '../constants/theme';
import { Progress, lakesPlayed } from '../game/progression';

const PER_PAGE = 4;
const PAGES = Math.ceil(LAKES.length / PER_PAGE);

type Props = {
  progress: Progress;
  onSelectLake: (lakeId: number) => void;
  onBack: () => void;
};

/** Paged lake records. No vertical ScrollView wrapper. */
export default function RecordsScreen({ progress, onSelectLake, onBack }: Props) {
  const [page, setPage] = useState(0);
  const rows = LAKES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const played = lakesPlayed(progress);

  return (
    <AppBackground variant="records">
      <ScreenHeader
        title="Lake Records"
        leftSlot={<IconButton Icon={ArrowLeft} accessibilityLabel="Go back" onPress={onBack} />}
      />

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatCard
              value={String(played) + '/' + String(LAKES.length)}
              label="lakes thrown"
              tone={theme.colors.lake.green}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={String(progress.unlocked.length) + '/' + String(PEBBLES.length)}
              label="paintings"
              tone={theme.colors.lake.purple}
            />
          </View>
        </View>

        <View style={styles.rows}>
          {rows.map(lake => (
            <RecordRow
              key={lake.id}
              lake={lake}
              record={progress.records[lake.id]}
              unlocked={progress.unlocked.indexOf(lake.pebbleId) >= 0}
              onPress={onSelectLake}
            />
          ))}
        </View>

        <PageControls page={page} pageCount={PAGES} onChange={setPage} />
      </View>

      <View style={styles.actions}>
        <Text style={styles.note} numberOfLines={1}>
          Tap a lake to select it and return to Lakeside.
        </Text>
        <SecondaryButton label="LAKESIDE" Icon={ArrowLeft} onPress={onBack} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PADDING, paddingTop: 14, gap: 12 },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  statSlot: { flex: 1 },
  rows: { gap: 10 },
  actions: { paddingHorizontal: H_PADDING, paddingTop: 8, paddingBottom: BOTTOM_INSET, gap: 8 },
  note: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});
