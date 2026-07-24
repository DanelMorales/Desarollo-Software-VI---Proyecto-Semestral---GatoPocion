import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Animated } from 'react-native';
import { getCatImage } from '../game/catImages';
import { playMusic } from '../game/music';
import SettingsModal from '../components/SettingsModal';

const NODE_SIZE = 64;
const NODE_POSITIONS = [
  { x: '61%', y: '75%' },
  { x: '53%', y: '35%' },
  { x: '61%', y: '7%' },
  { x: '15%', y: '4%' },
];

const MAP_BACKGROUND = require('../../assets/backgrounds/map_background.png');

function PulsingNode({ children }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
  );
}

export default function LevelMapScreen({ levels, completedLevels, onSelectLevel, onResetProgress, onExitToStart }) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    playMusic('map');
  }, []);

  function getNodeStatus(levelIndex) {
    if (completedLevels.includes(levelIndex)) return 'completed';

    const isFirstLevel = levelIndex === 0;
    const previousCompleted = completedLevels.includes(levelIndex - 1);

    if (isFirstLevel || previousCompleted) return 'unlocked';
    return 'locked';
  }

  const currentLevelIndex = levels.findIndex(
    (_, index) => getNodeStatus(index) === 'unlocked'
  );

  return (
    <ImageBackground source={MAP_BACKGROUND} style={styles.container} resizeMode="cover">
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.homeButton} onPress={onExitToStart}>
          <Text style={styles.homeIcon}>🏠</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Mapa de Hechizos de Gato 🐱✨</Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapArea}>
        {levels.map((level, index) => {
          const position = NODE_POSITIONS[index] || { x: '50%', y: '50%' };
          const status = getNodeStatus(index);
          const isCurrent = index === currentLevelIndex;

          const nodeButton = (
            <TouchableOpacity
              disabled={status === 'locked'}
              onPress={() => onSelectLevel(index)}
              style={[
                styles.node,
                status === 'completed' && styles.nodeCompleted,
                status === 'unlocked' && styles.nodeUnlocked,
                status === 'locked' && styles.nodeLocked,
              ]}
            >
              <Text style={styles.nodeText}>
                {status === 'completed' ? '⭐' : status === 'locked' ? '🔒' : index + 1}
              </Text>
            </TouchableOpacity>
          );

          return (
            <View
              key={level.id}
              style={[styles.nodeWrapper, { left: position.x, top: position.y }]}
            >
              {isCurrent ? <PulsingNode>{nodeButton}</PulsingNode> : nodeButton}

              {isCurrent && (
                <Image
                  source={getCatImage('welcoming')}
                  style={styles.catOnNode}
                  resizeMode="contain"
                />
              )}
            </View>
          );
        })}
      </View>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onResetProgress={onResetProgress}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginHorizontal: 8,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  homeButton: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: { fontSize: 18 },
  settingsButton: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: { fontSize: 20 },

  mapArea: {
    flex: 1,
    position: 'relative',
  },
  nodeWrapper: {
    position: 'absolute',
    width: NODE_SIZE,
    marginLeft: -NODE_SIZE / 2,
    marginTop: -NODE_SIZE / 2,
    alignItems: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  nodeCompleted: { backgroundColor: '#FFD60A', borderColor: '#B8860B' },
  nodeUnlocked: { backgroundColor: '#4A90D9', borderColor: '#2C5F94' },
  nodeLocked: { backgroundColor: '#B0B0B0', borderColor: '#7A7A7A' },
  nodeText: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  catOnNode: {
    position: 'absolute',
    width: 100,
    height: 100,
    left: NODE_SIZE + 6,
    top: -10,
  },
});
