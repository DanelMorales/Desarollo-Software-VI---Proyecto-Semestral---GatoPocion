export function checkAnswer(instruction, selectedPotions) {
  const colorOk = !instruction.color || selectedPotions.every(p => p.color === instruction.color);
  const shapeOk = !instruction.shape || selectedPotions.every(p => p.shape === instruction.shape);
  const quantityOk = !instruction.quantity || selectedPotions.length === instruction.quantity;
  
  return colorOk && shapeOk && quantityOk;
}