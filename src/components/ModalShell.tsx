import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ANIM } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  visible: boolean;
  title: string;
  onRequestClose?: () => void;
  children: React.ReactNode;
};

/**
 * Shared raised panel: 180ms backdrop fade and 8dp rise.
 * pointerEvents="box-none" on the animated panel so the inner buttons keep
 * receiving their release tap on Android release builds.
 */
function ModalShell({ visible, title, onRequestClose, children }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (!visible) {
      fade.setValue(0);
      rise.setValue(8);
      return;
    }
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: ANIM.modal, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: ANIM.modal, useNativeDriver: true }),
    ]).start();
  }, [fade, rise, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}>
      <View style={styles.root}>
        <Pressable
          style={styles.scrim}
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onRequestClose}
        />
        <Animated.View
          pointerEvents="box-none"
          style={[styles.panelWrap, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <LinearGradient
            colors={theme.gradients.sheet}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.panel}>
            <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>
              {title}
            </Text>
            {children}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.ui.scrim },
  panelWrap: { width: '100%', maxWidth: 348 },
  panel: {
    width: '100%',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 16,
    gap: 12,
    ...theme.shadow.sheet,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export default React.memo(ModalShell);
