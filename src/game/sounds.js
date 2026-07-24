import { createAudioPlayer } from 'expo-audio';

// Registra aquí cada sonido que tengas. Si aún no tienes el archivo,
// comenta la línea correspondiente — playSound() simplemente no hará nada
// si no encuentra el sonido, sin romper el juego.
const SOUND_FILES = {
  correct: require('../../assets/sounds/success_chime.mp3'),
  select: require('../../assets/sounds/glass_clink.mp3'),
  // incorrect: require('../../assets/sounds/incorrect.mp3'), // agrégalo cuando lo consigas
};

let soundEnabled = true;

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(value) {
  soundEnabled = value;
}

export function playSound(name) {
  if (!soundEnabled) return;

  try {
    const file = SOUND_FILES[name];
    if (!file) return;

    const player = createAudioPlayer(file);
    player.play();

    const checkFinished = setInterval(() => {
      if (player.currentTime >= player.duration && player.duration > 0) {
        clearInterval(checkFinished);
        player.release();
      }
    }, 100);
  } catch (err) {
    console.warn('No se pudo reproducir el sonido:', name, err);
  }
}
