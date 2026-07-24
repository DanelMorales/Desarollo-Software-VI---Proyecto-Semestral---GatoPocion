import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Switch } from 'react-native';
import { isMusicEnabled, setMusicEnabled } from '../game/music';
import { isSoundEnabled, setSoundEnabled } from '../game/sounds';

export default function SettingsModal({ visible, onClose }) {
  const [musicOn, setMusicOn] = useState(isMusicEnabled());
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  function toggleMusic(value) {
    setMusicOn(value);
    setMusicEnabled(value);
  }

  function toggleSound(value) {
    setSoundOn(value);
    setSoundEnabled(value);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Configuración</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🎵 Música</Text>
            <Switch value={musicOn} onValueChange={toggleMusic} />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🔊 Sonidos</Text>
            <Switch value={soundOn} onValueChange={toggleSound} />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsPanel: {
    backgroundColor: '#F3E9D2',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    borderWidth: 3,
    borderColor: '#4A3728',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3728',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: { fontSize: 16, color: '#4A3728', fontWeight: '600' },
  closeButton: {
    backgroundColor: '#4A3728',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});
