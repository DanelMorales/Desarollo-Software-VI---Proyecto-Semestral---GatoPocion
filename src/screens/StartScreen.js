import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { playMusic } from '../game/music';
import SettingsModal from '../components/SettingsModal';
const START_BACKGROUND = require('../../assets/backgrounds/start_screen.png');

export default function StartScreen({ onPlay }) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    playMusic('map');
  }, []);

  return (
    <ImageBackground source={START_BACKGROUND} style={styles.scene} resizeMode="cover">
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setSettingsVisible(true)}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

    

      {}
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.playButton} onPress={onPlay}>
          <Text style={styles.playButtonText}>¡Jugar!</Text>
        </TouchableOpacity>
      </View>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1 },
  settingsButton: {
    position: 'absolute',
    right: 16,
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  settingsIcon: { fontSize: 20 },

  bottomArea: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(74, 55, 40, 0.9)',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  playButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
