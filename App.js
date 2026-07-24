import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import StartScreen from './src/screens/StartScreen';
import LevelMapScreen from './src/screens/LevelMapScreen';
import GameScreen from './src/screens/GameScreen';
import MixingScreen from './src/screens/MixingScreen';
import { LEVELS } from './src/data/levels';
import { loadCompletedLevels, saveCompletedLevels, resetProgress } from './src/game/progressStorage';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [activeLevelIndex, setActiveLevelIndex] = useState(null);

  // Mientras esto es false, todavía no sabemos qué había guardado -
  // evita que la app "parpadee" mostrando el mapa vacío antes de cargar.
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);

  // Carga el progreso guardado una sola vez, al abrir la app
  useEffect(() => {
    loadCompletedLevels().then(saved => {
      setCompletedLevels(saved);
      setIsProgressLoaded(true);
    });
  }, []);

  // Guarda automáticamente cada vez que el progreso cambia (por ejemplo,
  // al completar un nivel nuevo). El chequeo de isProgressLoaded evita
  // que sobreescribamos el progreso guardado con un array vacío antes
  // de que termine de cargar la primera vez.
  useEffect(() => {
    if (!isProgressLoaded) return;
    saveCompletedLevels(completedLevels);
  }, [completedLevels, isProgressLoaded]);

  function handleSelectLevel(levelIndex) {
    setActiveLevelIndex(levelIndex);
  }

  function handleLevelCompleted(levelIndex) {
    setCompletedLevels(prev =>
      prev.includes(levelIndex) ? prev : [...prev, levelIndex]
    );
    setActiveLevelIndex(null);
  }

  function handleExitToMap() {
    setActiveLevelIndex(null);
  }

  function handleResetProgress() {
    resetProgress();
    setCompletedLevels([]);
  }

  if (!isProgressLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#2D2438' }} />;
  }

  if (!hasStarted) {
    return <StartScreen onPlay={() => setHasStarted(true)} />;
  }

  if (activeLevelIndex !== null) {
    const level = LEVELS[activeLevelIndex];

    if (level.type === 'mixing') {
      return (
        <MixingScreen
          onLevelCompleted={() => handleLevelCompleted(activeLevelIndex)}
          onExit={handleExitToMap}
        />
      );
    }

    return (
      <GameScreen
        levelIndex={activeLevelIndex}
        onLevelCompleted={() => handleLevelCompleted(activeLevelIndex)}
        onExit={handleExitToMap}
      />
    );
  }

  return (
    <LevelMapScreen
      levels={LEVELS}
      completedLevels={completedLevels}
      onSelectLevel={handleSelectLevel}
      onResetProgress={handleResetProgress}
      onExitToStart={() => setHasStarted(false)}
    />
  );
}
