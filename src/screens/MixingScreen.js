import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, ImageBackground } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { getColorValue } from '../game/colorMap';
import { getCatImage } from '../game/catImages';
import { getPotionImage } from '../game/potionImages';
import { playSound } from '../game/sounds';
import { playMusic } from '../game/music';

const SHAKE_THRESHOLD = 1.6;
const SHAKE_COOLDOWN_MS = 300;
const SHAKES_NEEDED = 6;

const MIXING_BACKGROUND = require('../../assets/backgrounds/mixing_background.png');

// Imagen real del caldero, con fondo transparente
const CAULDRON_IMAGES = {
  empty: require('../../assets/mixing/cauldron.png'),
  naranja: require('../../assets/mixing/cauldron_naranja.png'),
  verde: require('../../assets/mixing/cauldron_verde.png'),
  morado: require('../../assets/mixing/cauldron_morado.png'),
};

function getCauldronImage(liquidColor) {
  if (!liquidColor) return CAULDRON_IMAGES.empty;
  return CAULDRON_IMAGES[liquidColor] || CAULDRON_IMAGES.empty;
}

const COMBOS = [
  {
    colors: ['rojo', 'amarillo'],
    result: 'naranja',
    fact: '¿Sabías que si combinas una poción roja con una amarilla obtienes naranja?',
  },
  {
    colors: ['azul', 'amarillo'],
    result: 'verde',
    fact: '¿Sabías que si combinas una poción azul con una amarilla obtienes verde?',
  },
  {
    colors: ['rojo', 'azul'],
    result: 'morado',
    fact: '¿Sabías que si combinas una poción roja con una azul obtienes morado?',
  },
];

const ALL_COLORS = ['rojo', 'amarillo', 'azul'];

function sameColors(a, b) {
  return [...a].sort().join(',') === [...b].sort().join(',');
}

function Cauldron({ liquidColor }) {
  return (
    <View style={styles.cauldronWrapper}>
      <Image
        source={getCauldronImage(liquidColor)}
        style={styles.cauldronImage}
        resizeMode="contain"
      />
    </View>
  );
}

export default function MixingScreen({ onLevelCompleted, onExit }) {
  const [comboIndex, setComboIndex] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | selecting | shaking | result
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectionError, setSelectionError] = useState(false);
  const [shakeProgress, setShakeProgress] = useState(0);

  const cauldronScale = useRef(new Animated.Value(1)).current;
  const cauldronRotate = useRef(new Animated.Value(0)).current;
  const lastShakeTime = useRef(0);

  const combo = COMBOS[comboIndex];
  const isLastCombo = comboIndex === COMBOS.length - 1;

  useEffect(() => {
    playMusic('mixing');
  }, []);

  useEffect(() => {
    if (phase !== 'shaking') return;

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (force > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_COOLDOWN_MS) {
        lastShakeTime.current = now;
        const direction = Math.random() > 0.5 ? 1 : -1;

        Animated.parallel([
          Animated.sequence([
            Animated.timing(cauldronScale, { toValue: 1.12, duration: 90, useNativeDriver: true }),
            Animated.timing(cauldronScale, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(cauldronRotate, { toValue: direction * 8, duration: 90, useNativeDriver: true }),
            Animated.spring(cauldronRotate, { toValue: 0, friction: 3, useNativeDriver: true }),
          ]),
        ]).start();

        setShakeProgress(prev => Math.min(prev + 1, SHAKES_NEEDED));
      }
    });

    return () => subscription.remove();
  }, [phase]);

  useEffect(() => {
    if (phase === 'shaking' && shakeProgress >= SHAKES_NEEDED) {
      playSound('correct');
      setPhase('result');
    }
  }, [shakeProgress, phase]);

  function startTrying() {
    setPhase('selecting');
  }

  function toggleColor(color) {
    setSelectionError(false);

    setSelectedColors(prev => {
      if (prev.includes(color)) return prev.filter(c => c !== color);
      if (prev.length >= 2) return prev;

      const next = [...prev, color];

      if (next.length === 2) {
        if (sameColors(next, combo.colors)) {
          playSound('select');
          setTimeout(() => {
            setShakeProgress(0);
            setPhase('shaking');
          }, 400);
        } else {
          setSelectionError(true);
          setTimeout(() => {
            setSelectedColors([]);
            setSelectionError(false);
          }, 900);
        }
      }

      return next;
    });
  }

  function goToNextCombo() {
    if (isLastCombo) {
      setPhase('finale');
      playSound('correct');
      return;
    }

    setComboIndex(prev => prev + 1);
    setSelectedColors([]);
    setShakeProgress(0);
    setPhase('intro');
  }

  function finishLevel() {
    onLevelCompleted();
  }

  const rotateInterpolated = cauldronRotate.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <ImageBackground source={MIXING_BACKGROUND} style={styles.scene} resizeMode="cover">
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onExit}>
          <Text style={styles.exitText}>← Mapa</Text>
        </TouchableOpacity>
        <Text style={styles.levelTitle}>Mezcla de Colores</Text>
        <Text style={styles.streakText}>{comboIndex}/{COMBOS.length}</Text>
      </View>

      {/* Contenido central: cambia según la fase (selección, agitar, resultado) */}
      <View style={styles.centerContent}>
        {phase === 'selecting' && (
          <View>
            <Text style={styles.instructionText}>
              Elige las 2 pociones que Gato mencionó
            </Text>
            <View style={styles.shelfRow}>
              {ALL_COLORS.map(color => {
                const image = getPotionImage(color, 'circulo');
                const isSelected = selectedColors.includes(color);

                return (
                  <TouchableOpacity
                    key={color}
                    onPress={() => toggleColor(color)}
                    style={[
                      styles.potionSlot,
                      isSelected && styles.potionSlotSelected,
                      selectionError && styles.potionSlotError,
                    ]}
                  >
                    {image ? (
                      <Image source={image} style={styles.potionImage} resizeMode="contain" />
                    ) : (
                      <View style={[styles.colorFallback, { backgroundColor: getColorValue(color) }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectionError && (
              <Text style={styles.errorText}>Esas no son... ¡vuelve a intentarlo!</Text>
            )}
          </View>
        )}

        {phase === 'shaking' && (
          <View style={styles.shakeArea}>
            <Animated.View
              style={{ transform: [{ scale: cauldronScale }, { rotate: rotateInterpolated }] }}
            >
              <Cauldron liquidColor={null} />
            </Animated.View>
            <Text style={styles.instructionText}>¡Agita el teléfono para mezclar!</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBarFill, { width: `${(shakeProgress / SHAKES_NEEDED) * 100}%` }]}
              />
            </View>
          </View>
        )}

        {phase === 'result' && (
          <View style={styles.resultArea}>
            <Cauldron liquidColor={combo.result} />

            {getPotionImage(combo.result, 'circulo') && (
              <Image
                source={getPotionImage(combo.result, 'circulo')}
                style={styles.resultPotionImage}
                resizeMode="contain"
              />
            )}

            <Text style={styles.resultText}>
              {combo.colors[0]} + {combo.colors[1]} = {combo.result}
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={goToNextCombo}>
              <Text style={styles.actionButtonText}>
                {isLastCombo ? '¡Ya casi terminamos!' : 'Probar la siguiente mezcla'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Gato grande al costado, estilo "visual novel" - solo durante la fase intro */}
      {phase === 'intro' && (
        <>
          <Image
            source={getCatImage('welcoming')}
            style={styles.catBig}
            resizeMode="contain"
          />

          <View style={styles.dialogueBox}>
            <View style={styles.nameTag}>
              <Text style={styles.nameTagText}>GATO</Text>
            </View>
            <Text style={styles.factText}>{combo.fact}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={startTrying}>
              <Text style={styles.actionButtonText}>¡Vamos a intentarlo!</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Gato celebrando al final del nivel, con su comentario de cierre */}
      {phase === 'finale' && (
        <>
          <Image
            source={getCatImage('celebrating')}
            style={styles.catBig}
            resizeMode="contain"
          />

          <View style={styles.dialogueBox}>
            <View style={styles.nameTag}>
              <Text style={styles.nameTagText}>GATO</Text>
            </View>

            <View style={styles.finaleRow}>
              {COMBOS.map(item => (
                <Image
                  key={item.result}
                  source={getPotionImage(item.result, 'circulo')}
                  style={styles.finalePotionImage}
                  resizeMode="contain"
                />
              ))}
            </View>

            <Text style={styles.factText}>
              ¡Lo lograste! Ahora ya sabes cómo nacen estos 3 colores mágicos.
              ¡Eres todo un aprendiz de hechicero! 🎉
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={finishLevel}>
              <Text style={styles.actionButtonText}>Volver al mapa</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, paddingTop: 50 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  exitText: { fontSize: 14, fontWeight: '600', color: 'white' },
  levelTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  streakText: { fontSize: 14, fontWeight: '600', color: 'white' },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  // --- Gato estilo visual novel ---
  // Posicionado absoluto, pegado a la esquina inferior izquierda, recortado
  // por el borde de la pantalla (igual que en la referencia).
  catBig: {
    position: 'absolute',
    bottom: 150, // deja espacio para que no tape el cuadro de diálogo
    left: -20,
    width: 260,
    height: 260,
  },
  dialogueBox: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 3,
    borderColor: '#4A3728',
  },
  nameTag: {
    position: 'absolute',
    top: -14,
    left: 20,
    backgroundColor: '#4A3728',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nameTagText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  factText: { fontSize: 15, color: '#333', marginBottom: 12, marginTop: 6 },

  instructionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginVertical: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  shelfRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(74, 55, 40, 0.55)',
    borderRadius: 16,
    paddingVertical: 16,
  },
  potionSlot: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  potionSlotSelected: { borderColor: '#FFD60A' },
  potionSlotError: { borderColor: '#D9534F' },
  potionImage: { width: 65, height: 65 },
  colorFallback: { width: 65, height: 65, borderRadius: 10 },
  errorText: {
    textAlign: 'center',
    color: '#FFB4B0',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  shakeArea: { alignItems: 'center' },

  cauldronWrapper: {
    width: 170,
    height: 255,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cauldronImage: { width: 170, height: 255, position: 'absolute' },

  progressBarBackground: {
    width: '80%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    marginTop: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    alignSelf: 'center',
  },
  progressBarFill: { height: '100%', backgroundColor: '#FFD60A', borderRadius: 10 },

  resultArea: { alignItems: 'center' },
  resultPotionImage: { width: 70, height: 90, marginTop: -6, marginBottom: 8 },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  finaleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  finalePotionImage: { width: 50, height: 65 },

  actionButton: {
    backgroundColor: '#4A3728',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: { color: 'white', fontWeight: 'bold' },
});
