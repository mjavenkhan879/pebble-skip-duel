import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import ConfirmModal from '../components/ConfirmModal';
import IconButton from '../components/IconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SettingToggle from '../components/SettingToggle';
import { BOTTOM_INSET, H_PADDING } from '../constants/config';
import theme from '../constants/theme';
import { Progress } from '../game/progression';

type Props = {
  progress: Progress;
  onSound: (value: boolean) => void;
  onHaptics: (value: boolean) => void;
  onReset: () => void;
  onBack: () => void;
};

export default function SettingsScreen(props: Props) {
  const { progress, onSound, onHaptics, onReset, onBack } = props;
  const [confirm, setConfirm] = useState(false);

  return (
    <AppBackground variant="settings">
      <ScreenHeader
        title="Settings"
        leftSlot={<IconButton Icon={ArrowLeft} accessibilityLabel="Go back" onPress={onBack} />}
      />

      <View style={styles.body}>
        <Image source={assets.spriteLeaf} style={styles.leafLeft} />
        <Image source={assets.spriteLeaf} style={styles.leafRight} />

        <SettingToggle
          label="Sound"
          description="Ambient water and throw effects."
          value={progress.sound}
          onChange={onSound}
        />
        <SettingToggle
          label="Haptics"
          description="A short tick on each water contact."
          value={progress.haptics}
          onChange={onHaptics}
        />

        <View style={styles.resetRow}>
          <View style={styles.resetText}>
            <Text style={styles.resetTitle}>Reset progress</Text>
            <Text style={styles.resetNote}>Clears records and painted pebbles.</Text>
          </View>
          <View style={styles.resetAction}>
            <SecondaryButton
              label="RESET"
              Icon={Trash2}
              tone="outline"
              onPress={() => setConfirm(true)}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={2}>
          Free play. All rewards are earned in the game.
        </Text>
        <Text style={styles.version} numberOfLines={1}>
          Version 1.0
        </Text>
        <SecondaryButton label="LAKESIDE" Icon={ArrowLeft} onPress={onBack} />
      </View>

      <ConfirmModal
        visible={confirm}
        title="Reset progress"
        message="Reset all records and painted pebbles? This cannot be undone."
        cancelLabel="KEEP PROGRESS"
        confirmLabel="RESET PROGRESS"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onReset();
        }}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: H_PADDING, paddingTop: 16, gap: 12 },
  leafLeft: {
    position: 'absolute',
    left: 10,
    top: 8,
    width: 56,
    height: 56,
    resizeMode: 'contain',
    opacity: 0.4,
  },
  leafRight: {
    position: 'absolute',
    right: 10,
    top: 30,
    width: 44,
    height: 44,
    resizeMode: 'contain',
    opacity: 0.35,
    transform: [{ rotate: '140deg' }],
  },
  resetRow: {
    width: '100%',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    ...theme.shadow.card,
  },
  resetText: { flex: 1, paddingRight: 10 },
  resetTitle: { fontSize: 16, fontWeight: '700', lineHeight: 22, color: theme.colors.text.primary },
  resetNote: { fontSize: 12, fontWeight: '500', lineHeight: 16, color: theme.colors.text.muted },
  resetAction: { width: 130 },
  footer: { paddingHorizontal: H_PADDING, paddingBottom: BOTTOM_INSET, gap: 6 },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  version: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 6,
    color: theme.colors.text.secondary,
  },
});
