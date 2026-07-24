// src/game/colorMap.js
export const COLOR_MAP = {
  rojo: '#E63946',
  amarillo: '#FFD60A',
  azul: '#1D7BF0',
  verde: '#2ECC71',
  naranja: '#FF8C42',
  morado: '#8E44AD',
};

export function getColorValue(colorName) {
  return COLOR_MAP[colorName] || '#CCCCCC'; // gris si no lo encuentra
}