// src/game/potionImages.js

const POTION_IMAGES = {
  rojo_circulo: require('../../assets/potions/rojo_circulo.png'),
  rojo_triangulo: require('../../assets/potions/rojo_triangulo.png'),
  rojo_cuadrado: require('../../assets/potions/rojo_cuadrado.png'),

  amarillo_circulo: require('../../assets/potions/amarillo_circulo.png'),
  amarillo_triangulo: require('../../assets/potions/amarillo_triangulo.png'),
  amarillo_cuadrado: require('../../assets/potions/amarillo_cuadrado.png'),

  azul_circulo: require('../../assets/potions/azul_circulo.png'),
  azul_triangulo: require('../../assets/potions/azul_triangulo.png'),
  azul_cuadrado: require('../../assets/potions/azul_cuadrado.png'),

  verde_circulo: require('../../assets/potions/verde_circulo.png'),
  verde_triangulo: require('../../assets/potions/verde_triangulo.png'),
  verde_cuadrado: require('../../assets/potions/verde_cuadrado.png'),

  // Colores secundarios - se usan como resultado del nivel de mezcla
  naranja_circulo: require('../../assets/potions/naranja_circulo.png'),
  morado_circulo: require('../../assets/potions/morado_circulo.png'),
};

export function getPotionImage(color, shape) {
  const key = `${color}_${shape}`;
  return POTION_IMAGES[key] || null; // null si aún no existe esa imagen
}
