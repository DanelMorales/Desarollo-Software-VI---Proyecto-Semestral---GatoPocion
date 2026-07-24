import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ShapePlaceholder from './ShapePlaceholder';

export default function PotionCard({ image, colorValue, shape, isSelected, disabled, onPress, floatDelay = 0 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.15 : 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  // Flotación suave y constante, con un pequeño retraso distinto por
  // poción (floatDelay) para que no todas suban y bajen exactamente
  // igual al mismo tiempo - se ve más orgánico.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(floatDelay),
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.potionCard,
        isSelected && styles.selectedBorder,
        disabled && styles.potionDisabled,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
        }}
      >
        {image ? (
          <Image source={image} style={styles.potionImage} resizeMode="contain" />
        ) : (
          <ShapePlaceholder shape={shape} color={colorValue} size={65} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  potionCard: {
    width: 80,
    height: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  potionImage: { width: 65, height: 65 },
  selectedBorder: {
    borderColor: '#FFD60A',
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
  },
  potionDisabled: { opacity: 0.5 },
});
