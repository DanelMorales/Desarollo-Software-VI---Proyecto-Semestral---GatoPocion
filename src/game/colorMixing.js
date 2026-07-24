const MIXING_RULES = {
  'rojo+amarillo': 'naranja',
  'azul+amarillo': 'verde',
  'rojo+azul': 'morado',
};

export function mixColors(colorA, colorB) {
  const key1 = `${colorA}+${colorB}`;
  const key2 = `${colorB}+${colorA}`;
  return MIXING_RULES[key1] || MIXING_RULES[key2] || null;
}