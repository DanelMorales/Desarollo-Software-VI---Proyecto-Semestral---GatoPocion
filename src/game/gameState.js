export const GAME_PHASES = {
  MENU: 'menu',
  PLAYING: 'playing',
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  LEVEL_COMPLETE: 'level_complete',
  MIXING: 'mixing',
};

export function createInitialState() {
  return {
    phase: GAME_PHASES.MENU,
    currentLevelIndex: 0,
    currentInstruction: null,
    score: 0,
    attemptsInLevel: 0,
    correctInLevel: 0,
  };
}