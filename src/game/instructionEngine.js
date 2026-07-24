// src/game/instructionEngine.js

function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function pickRandomInRange([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateInstruction(level) {
  const attributes = level.attributesRequired;
  
  const instruction = {};
  if (attributes.includes('color')) instruction.color = pickRandom(level.colorPool);
  if (attributes.includes('shape')) instruction.shape = pickRandom(level.shapePool);
  if (attributes.includes('quantity')) instruction.quantity = pickRandomInRange(level.quantityRange);
  
  return instruction;
}