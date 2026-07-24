// src/game/potionPool.js

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Genera un pool de pociones para mostrar en pantalla.
// Incluye las que sí cumplen la instrucción + distractoras que no cumplen.
export function generatePotionPool(level, instruction, poolSize = 6) {
  const pool = [];

  // Cuántas pociones "correctas" debe haber disponibles como mínimo
  const correctNeeded = instruction.quantity || 1;

  for (let i = 0; i < correctNeeded; i++) {
    pool.push({
      id: `correct-${i}`,
      color: instruction.color || pickRandom(level.colorPool),
      shape: instruction.shape || pickRandom(level.shapePool),
    });
  }

  // Rellena el resto con pociones aleatorias (algunas pueden coincidir por casualidad, está bien)
  while (pool.length < poolSize) {
    pool.push({
      id: `random-${pool.length}`,
      color: pickRandom(level.colorPool),
      shape: pickRandom(level.shapePool),
    });
  }

  // Mezcla el orden para que no siempre estén las correctas primero
  return shuffle(pool);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}