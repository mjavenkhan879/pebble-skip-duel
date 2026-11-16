import { useCallback, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { SPRING } from '../constants/config';

/**
 * Press feedback driven from a Pressable PARENT.
 * The Animated.View always lives INSIDE the Pressable, so Android release
 * builds never lose the release tap.
 */
export default function usePressScale(to: number = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: SPRING.tension,
      friction: SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: SPRING.tension,
      friction: SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const style = useMemo(() => ({ transform: [{ scale }] }), [scale]);

  return { scale, style, onPressIn, onPressOut };
}
