// test.mjs
import { generateInstruction } from './src/game/instructionEngine.js';
import { checkAnswer } from './src/game/validator.js';
import { LEVELS } from './src/data/levels.js';

const level = LEVELS[1]; // Nivel 2: color + cantidad
const instruction = generateInstruction(level);
console.log('Instrucción generada:', instruction);

const respuestaNiño = [
  { color: 'rojo', shape: 'circulo' },
  { color: 'rojo', shape: 'circulo' },
  { color: 'rojo', shape: 'circulo' },
  { color: 'rojo', shape: 'circulo' },
];

console.log('¿Correcto?', checkAnswer(instruction, respuestaNiño));
import { mixColors } from './src/game/colorMixing.js';

console.log('Rojo + Amarillo =', mixColors('rojo', 'amarillo'));
console.log('Azul + Amarillo =', mixColors('azul', 'amarillo'));
console.log('Rojo + Azul =', mixColors('rojo', 'azul'));  
LEVELS.slice(0, 3).forEach(level => {
  const instr = generateInstruction(level);
  console.log(`${level.name} →`, instr);
});