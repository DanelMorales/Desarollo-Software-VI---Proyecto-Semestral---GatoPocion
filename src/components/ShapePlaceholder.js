import React from 'react';
import { View } from 'react-native';

// Dibuja la forma correcta usando solo View + estilos, sin necesitar
// ninguna imagen. Esto permite que el juego sea completamente jugable
// (incluyendo distinguir formas) aunque todavía no tengas las ilustraciones.
export default function ShapePlaceholder({ shape, color, size = 65 }) {
  if (shape === 'circulo') {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    );
  }

  if (shape === 'triangulo') {
    const half = size / 2;
    return (
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: half,
          borderRightWidth: half,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    );
  }

  // 'cuadrado' o cualquier forma no reconocida cae aquí como respaldo
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: color,
      }}
    />
  );
}
