// Formas femeninas/plurales de cada color, para que el texto sea gramaticalmente
// correcto ("una poción roja" / "3 pociones rojas"), en vez de usar notaciones
// confusas como "poción(es)".
const COLOR_ADJECTIVES = {
  rojo: { singular: 'roja', plural: 'rojas' },
  amarillo: { singular: 'amarilla', plural: 'amarillas' },
  azul: { singular: 'azul', plural: 'azules' },
  verde: { singular: 'verde', plural: 'verdes' },
  naranja: { singular: 'naranja', plural: 'naranjas' },
  morado: { singular: 'morada', plural: 'moradas' },
};

function getColorAdjective(color, isPlural) {
  const forms = COLOR_ADJECTIVES[color];
  if (!forms) return color; // respaldo por si falta el color en el mapa
  return isPlural ? forms.plural : forms.singular;
}

export function buildInstructionText(instruction) {
  const quantity = instruction.quantity || 1;
  const isPlural = quantity > 1;
  const shapeText = instruction.shape ? ` en forma de ${instruction.shape}` : '';

  if (isPlural) {
    const colorAdj = getColorAdjective(instruction.color, true);
    return `Necesito ${quantity} pociones ${colorAdj}${shapeText}`;
  }

  const colorAdj = getColorAdjective(instruction.color, false);
  return `Necesito una poción ${colorAdj}${shapeText}`;
}
