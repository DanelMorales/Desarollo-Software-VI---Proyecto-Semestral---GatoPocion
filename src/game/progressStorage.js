import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'gatopocion_completed_levels';

// Devuelve un array de índices de niveles completados, ej: [0, 1]
// Si nunca se guardó nada (primera vez que se abre la app), devuelve [].
export async function loadCompletedLevels() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('No se pudo cargar el progreso guardado:', err);
    return [];
  }
}

export async function saveCompletedLevels(completedLevels) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completedLevels));
  } catch (err) {
    console.warn('No se pudo guardar el progreso:', err);
  }
}

// Útil para pruebas, o si más adelante agregas un botón de "reiniciar progreso"
export async function resetProgress() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('No se pudo reiniciar el progreso:', err);
  }
}