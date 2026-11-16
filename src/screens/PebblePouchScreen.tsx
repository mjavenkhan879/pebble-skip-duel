import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Play } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import PebblePreview from '../components/PebblePreview';
import PebbleTile from '../components/PebbleTile';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SoftCard from '../components/SoftCard';
import { BOTTOM_INSET, H_PADDING, WINDOW_W } from '../constants/config';
import { getLake } from '../constants/lakes';
import { PEBBLES, getPebble } from '../constants/pebbles';
import theme from '../constants/theme';
import { Progress } from '../game/progression';

const GAP = 8;
const COLS = 3;
const GRID_W = Math.min(WINDOW_W - H_PADDING * 2, 380);
const CELL = Math.floor((GRID_W - GAP * (COLS - 1)) / COLS);

type Props = {
  progress: Progress;
  onEquip: (id: string) => void;
  onPlayLake: (lakeId: number) => void;
  onBack: () => void;
};

/** 3 x 3 collection grid. Tapping an item previews it, it never equips it. */
export default function PebblePouchScreen({ progress, onEquip, onPlayLake, onBack }: Props) {
  const [previewId, setPreviewId] = useState(progress.equipped);
  const preview = getPebble(previewId);
  const unlocked = progress.unlocked.indexOf(previewId) >= 0;
  const equipped = progress.equipped === previewId;
  const requirement = useMemo(() => {
    if (preview.lakeId === 0) {
      return 'Unlocked from the start';
    }
    const lake = getLake(preview.lakeId);
    return 'Reach ' + String(lake.target) + ' skips at ' + lake.name;
  }, [preview]);

  return (
    <AppBackground variant="pouch">
      <ScreenHeader
        title="Pebble Pouch"
        leftSlot={<IconButton Icon={ArrowLeft} accessibilityLabel="Go back" onPress={onBack} />}
      />

      <View style={styles.body}>
        <SoftCard padding={12} style={styles.preview}>
          <PebblePreview pebble={preview} width={120} height={72} dim={!unlocked} />
          <View style={styles.previewText}>
            <Text style={styles.previewName} numberOfLines={1}>
              {preview.name}
            </Text>
            <Text style={styles.previewNote} numberOfLines={1}>
              Appearance only
            </Text>
            <Text style={styles.previewReq} numberOfLines={2}>
              {unlocked ? 'Collected' : requirement}
            </Text>
            <Text style={styles.previewCount} numberOfLines={1}>
              {'Collected ' + String(progress.unlocked.length) + ' of ' + String(PEBBLES.length)}
            </Text>
          </View>
        </SoftCard>

        <View style={styles.grid}>
          {PEBBLES.map(p => (
            <PebbleTile
              key={p.id}
              pebble={p}
              size={CELL}
              unlocked={progress.unlocked.indexOf(p.id) >= 0}
              equipped={progress.equipped === p.id}
              previewed={previewId === p.id}
              onPress={setPreviewId}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        {unlocked && equipped ? (
          <PrimaryButton label="EQUIPPED" onPress={() => undefined} disabled />
        ) : null}
        {unlocked && !equipped ? (
          <PrimaryButton label="EQUIP" onPress={() => onEquip(previewId)} />
        ) : null}
        {!unlocked ? (
          <PrimaryButton
            label="PLAY THIS LAKE"
            Icon={Play}
            onPress={() => onPlayLake(preview.lakeId)}
          />
        ) : null}
        <SecondaryButton label="LAKESIDE" Icon={ArrowLeft} onPress={onBack} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PADDING, paddingTop: 14, gap: 14, alignItems: 'center' },
  preview: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 120 },
  previewText: { flex: 1 },
  previewName: { fontSize: 20, fontWeight: '800', lineHeight: 26, color: theme.colors.text.primary },
  previewNote: { fontSize: 12, fontWeight: '600', lineHeight: 16, color: theme.colors.text.secondary },
  previewReq: { fontSize: 13, fontWeight: '500', lineHeight: 18, color: theme.colors.text.muted },
  previewCount: { fontSize: 12, fontWeight: '700', lineHeight: 16, marginTop: 4, color: theme.colors.lake.deep },
  grid: {
    width: GRID_W,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'flex-start',
  },
  actions: { paddingHorizontal: H_PADDING, paddingTop: 10, paddingBottom: BOTTOM_INSET, gap: 10 },
});
