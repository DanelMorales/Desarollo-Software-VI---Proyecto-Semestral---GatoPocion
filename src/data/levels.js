export const LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: Colores',
    attributesRequired: ['color'],
    colorPool: ['rojo', 'amarillo', 'azul'],
    shapePool: ['circulo'],
    quantityRange: [1, 1],
  },
  {
    id: 2,
    name: 'Nivel 2: Contando',
    attributesRequired: ['color', 'quantity'],
    colorPool: ['rojo', 'amarillo', 'azul', 'verde'],
    shapePool: ['circulo'],
    quantityRange: [1, 4],
  },
  {
    id: 3,
    name: 'Nivel 3: Formas',
    attributesRequired: ['color', 'shape', 'quantity'],
    colorPool: ['rojo', 'amarillo', 'azul', 'verde'],
    shapePool: ['circulo', 'triangulo', 'cuadrado'],
    quantityRange: [1, 4],
  },
  {
    id: 4,
    name: 'Nivel 4: Mezcla de colores',
    type: 'mixing',
    colorPool: ['rojo', 'amarillo', 'azul'],
  },
];