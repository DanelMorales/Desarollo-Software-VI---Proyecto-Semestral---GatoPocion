# Desarollo-Software-VI---Proyecto-Semestral---GatoPocion
Aqui es el repositorio del proyecto final de Desarollo de Software VI 
Gato-Poción

Aplicación móvil educativa hecha con React Native y Expo, pensada para niños. El jugador ayuda a un gato hechicero a preparar pociones siguiendo instrucciones de color, forma y cantidad, y en el nivel final mezcla colores agitando el teléfono.

Descripción

Gato-Poción es un juego por niveles donde cada nivel presenta un reto distinto:

Nivel 1 — Colores: elegir la poción del color indicado.
Nivel 2 — Contando: elegir la cantidad correcta de pociones de un color.
Nivel 3 — Formas: combinar color, forma y cantidad en una sola instrucción.
Nivel 4 — Mezcla de colores: usar el acelerómetro del teléfono para "agitar" el caldero y descubrir qué color nace de combinar dos pociones (rojo + amarillo = naranja, azul + amarillo = verde, rojo + azul = morado).

El progreso del jugador se guarda automáticamente en el dispositivo, así que los niveles completados se mantienen entre sesiones.

Tecnologías
Expo ~57
React Native 0.86 / React 19
expo-sensors — lectura del acelerómetro (nivel de mezcla de colores)
expo-audio — efectos de sonido y música
@react-native-async-storage/async-storage — almacenamiento local persistente del progreso
Estructura del proyecto
GatoPocion/
├── App.js                     # Punto de entrada y navegación entre pantallas
├── src/
│   ├── screens/                # Pantallas de la app
│   │   ├── StartScreen.js
│   │   ├── LevelMapScreen.js
│   │   ├── GameScreen.js
│   │   └── MixingScreen.js     # Nivel del sensor (acelerómetro)
│   ├── game/                   # Lógica del juego
│   │   ├── progressStorage.js  # Guardar/cargar/reiniciar progreso (AsyncStorage)
│   │   ├── colorMixing.js      # Reglas de mezcla de colores
│   │   ├── validator.js        # Validación de respuestas del jugador
│   │   ├── instructionEngine.js# Generación de instrucciones aleatorias por nivel
│   │   ├── sounds.js / music.js
│   │   └── ...
│   ├── data/
│   │   └── levels.js           # Definición de los niveles (data-driven)
│   └── components/              # Componentes reutilizables de UI
└── assets/                     # Imágenes, íconos y sonidos
Requisitos previos
Node.js instalado
La app Expo Go instalada en un celular Android o iOS (para probar sin compilar)
Instalación y ejecución
bash
# Instalar dependencias
npm install

# Iniciar el proyecto
npm start

Esto abrirá el bundler de Expo. Desde ahí puedes:

Escanear el código QR con la app Expo Go en tu celular.
Ejecutar npm run android o npm run ios para abrir en un emulador.
Ejecutar npm run web para probar en el navegador.
Progreso guardado

El progreso de niveles completados se guarda localmente en el dispositivo mediante AsyncStorage (ver src/game/progressStorage.js). No requiere conexión a internet ni una cuenta de usuario.

Equipo
Danel Morales 
Licencia

Ver el archivo LICENSE.
