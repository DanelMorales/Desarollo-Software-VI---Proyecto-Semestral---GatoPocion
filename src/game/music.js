import { createAudioPlayer } from 'expo-audio';

// Registra aquí cada pista de música. Si aún no tienes el archivo,
// comenta la línea correspondiente — playMusic() simplemente no hará
// nada si no la encuentra, sin romper el juego.
const MUSIC_FILES = {
  map: require('../../assets/music/map_theme.mp3'),
  game: require('../../assets/music/game_theme.mp3'),
  mixing: require('../../assets/music/mixing_theme.mp3'),
};

const MUSIC_VOLUME = 0.4;

// Guardamos el estado en `globalThis` en vez de variables normales del
// módulo. Esto es importante: cuando Expo recarga este archivo en caliente
// (Fast Refresh, al guardar cambios durante desarrollo), las variables
// normales se reinician a null, pero el audio nativo que ya sonaba sigue
// sonando de fondo sin que podamos detenerlo — causando que se
// sobrepongan varias pistas. Usar `globalThis` hace que la referencia
// sobreviva esas recargas.
if (!globalThis.__gatoPocionMusic) {
  globalThis.__gatoPocionMusic = {
    enabled: true,
    player: null,
    track: null,
  };
}

const musicState = globalThis.__gatoPocionMusic;

export function isMusicEnabled() {
  return musicState.enabled;
}

// Silencia o restaura el volumen de la música que esté sonando ahora mismo,
// sin detenerla ni reiniciarla (para que no se sienta un "corte" brusco).
export function setMusicEnabled(value) {
  musicState.enabled = value;
  if (musicState.player) {
    musicState.player.volume = value ? MUSIC_VOLUME : 0;
  }
}

export function playMusic(trackName) {
  // Si ya está sonando esa misma pista, no hace nada (evita reinicios innecesarios
  // al re-entrar a la misma pantalla)
  if (musicState.track === trackName && musicState.player) return;

  stopMusic();

  const file = MUSIC_FILES[trackName];
  if (!file) return; // pista no registrada todavía, no rompe nada

  try {
    musicState.player = createAudioPlayer(file);
    musicState.player.loop = true;
    musicState.player.volume = musicState.enabled ? MUSIC_VOLUME : 0;
    musicState.player.play();
    musicState.track = trackName;
  } catch (err) {
    console.warn('No se pudo reproducir la música:', trackName, err);
  }
}

export function stopMusic() {
  if (musicState.player) {
    try {
      musicState.player.pause();
      musicState.player.release();
    } catch (err) {
      // El reproductor podría venir de una versión anterior del módulo
      // (antes de este cambio) y ya no ser válido - lo ignoramos con
      // seguridad, ya que de todas formas vamos a reemplazarlo.
    }
    musicState.player = null;
    musicState.track = null;
  }
}
