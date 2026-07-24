import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { generateInstruction } from '../game/instructionEngine';
import { generatePotionPool } from '../game/potionPool';
import { checkAnswer } from '../game/validator';
import { getColorValue } from '../game/colorMap';
import { LEVELS } from '../data/levels';
import { getPotionImage } from '../game/potionImages';
import { getCatImage } from '../game/catImages';
import { playSound } from '../game/sounds';
import { playMusic } from '../game/music';
import { buildInstructionText } from '../game/textHelpers';
import PotionCard from '../components/PotionCard';

const CORRECT_TO_ADVANCE = 3;

// Cuando generes el fondo de escena, guárdalo en esta ruta y descomenta:
const SCENE_BACKGROUND = require('../../assets/backgrounds/game_background.png');

export default function GameScreen({ levelIndex, onLevelCompleted, onExit }) {
  const level = LEVELS[levelIndex];

  const [instruction, setInstruction] = useState(() => generateInstruction(level));
  const [potionPool, setPotionPool] = useState(() => generatePotionPool(level, instruction));
  const [selectedIds, setSelectedIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0);

  useEffect(() => {
    playMusic('game');
  }, []);

  function togglePotion(id) {
    if (feedback !== null) return;

    playSound('select');

    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  }

  function getSelectedPotions() {
    return potionPool.filter(p => selectedIds.includes(p.id));
  }

  function submitAnswer() {
    const isCorrect = checkAnswer(instruction, getSelectedPotions());

    if (isCorrect) {
      playSound('correct');
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setFeedback(newStreak >= CORRECT_TO_ADVANCE ? 'level_up_ready' : 'correct');
    } else {
      playSound('incorrect');
      setCorrectStreak(0);
      setFeedback('incorrect');
    }
  }

  function newRound() {
    const newInstruction = generateInstruction(level);
    setInstruction(newInstruction);
    setPotionPool(generatePotionPool(level, newInstruction));
    setSelectedIds([]);
    setFeedback(null);
  }

  function retryRound() {
    setSelectedIds([]);
    setFeedback(null);
  }

  function nextInstruction() {
    newRound();
  }

  function getCurrentCatPose() {
    if (feedback === 'correct' || feedback === 'level_up_ready') return 'celebrating';
    if (feedback === 'incorrect') return 'thinking';
    return 'welcoming';
  }

  function finishLevel() {
    onLevelCompleted();
  }

  const sceneContent = (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onExit}>
          <Text style={styles.exitText}>← Mapa</Text>
        </TouchableOpacity>
        <Text style={styles.levelTitle}>{level.name}</Text>
        <Text style={styles.streakText}>⭐ {correctStreak}/{CORRECT_TO_ADVANCE}</Text>
      </View>

      {/* Pociones flotando, sin estante */}
      <View style={styles.floatingArea}>
        <View style={styles.potionGrid}>
          {potionPool.map((potion, index) => {
            const image = getPotionImage(potion.color, potion.shape);

            return (
              <PotionCard
                key={potion.id}
                image={image}
                colorValue={getColorValue(potion.color)}
                shape={potion.shape}
                isSelected={selectedIds.includes(potion.id)}
                disabled={feedback !== null}
                onPress={() => togglePotion(potion.id)}
                floatDelay={index * 150}
              />
            );
          })}
        </View>
      </View>

      {/* Gato + diálogo */}
      <View style={styles.catRow}>
        <Image
          source={getCatImage(getCurrentCatPose())}
          style={styles.catImage}
          resizeMode="contain"
        />

        <View style={styles.speechBubble}>
          <Text style={styles.instructionText}>"{buildInstructionText(instruction)}"</Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.bottomBar}>
        <Text style={styles.selectedText}>Seleccionadas: {selectedIds.length}</Text>

        {feedback === null && (
          <TouchableOpacity style={styles.actionButton} onPress={submitAnswer}>
            <Text style={styles.actionButtonText}>Entregar a Gato</Text>
          </TouchableOpacity>
        )}

        {feedback === 'correct' && (
          <View style={styles.feedbackRow}>
            <Text style={styles.correctText}>¡Correcto! 🎉</Text>
            <TouchableOpacity style={styles.actionButton} onPress={nextInstruction}>
              <Text style={styles.actionButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        )}

        {feedback === 'level_up_ready' && (
          <View style={styles.feedbackRow}>
            <Text style={styles.correctText}>¡Ya dominas este nivel! 🌟</Text>
            <TouchableOpacity style={styles.actionButton} onPress={finishLevel}>
              <Text style={styles.actionButtonText}>Completar nivel</Text>
            </TouchableOpacity>
          </View>
        )}

        {feedback === 'incorrect' && (
          <View style={styles.feedbackRow}>
            <Text style={styles.incorrectText}>Casi... ¡inténtalo de nuevo!</Text>
            <TouchableOpacity style={styles.actionButton} onPress={retryRound}>
              <Text style={styles.actionButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );

  if (typeof SCENE_BACKGROUND !== 'undefined') {
    return (
      <ImageBackground source={SCENE_BACKGROUND} style={styles.scene} resizeMode="cover">
        {sceneContent}
      </ImageBackground>
    );
  }

  return <View style={styles.scene}>{sceneContent}</View>;
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#2D2438',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  exitText: { fontSize: 14, fontWeight: '600', color: 'white' },
  levelTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  streakText: { fontSize: 14, fontWeight: '600', color: 'white' },

  // Zona donde flotan las pociones, con proporción fija para que nunca
  // choque con lo de abajo, sin importar cuántas pociones haya
  floatingArea: {
    flex: 0.35,
    justifyContent: 'center',
    marginTop: 30
  },
  potionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },

  catRow: {
    flex: 0.38,
    flexDirection: 'row',
    alignItems: 'center',
     marginTop: 60,
  },
  catImage: { 
    width: 250, 
    height: 250,
    marginLeft: -30,
   },
 speechBubble: {
  flex: 1,
  backgroundColor: 'rgba(255,255,255,0.95)',
  borderRadius: 20,
  padding: 20,
  marginLeft: -50,   // ← antes era 10, ahora negativo para acercarla
  marginRight: 4,
  borderWidth: 3,
  borderColor: '#4A3728',
  justifyContent: 'center',
  minHeight: 100,
},
instructionText: {
  fontSize: 18,            // texto más grande (antes 15)
  color: '#333',
  lineHeight: 24,          // más espacio entre líneas si el texto es largo
},
  instructionText: { fontSize: 15, color: '#333' },

  bottomBar: {
    flex: 0.28,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  selectedText: {
    fontSize: 13,
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  feedbackRow: { alignItems: 'center' },
  actionButton: {
    backgroundColor: '#4A3728',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: { color: 'white', fontWeight: 'bold' },
  correctText: {
    fontSize: 15,
    color: '#FFD60A',
    marginBottom: 8,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  incorrectText: {
    fontSize: 15,
    color: '#FF8A80',
    marginBottom: 8,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
