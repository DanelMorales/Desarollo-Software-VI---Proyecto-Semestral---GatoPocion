export const CAT_POSES = {
  welcoming: require('../../assets/gato/gato_welcoming.png'),
  celebrating: require('../../assets/gato/gato_celebrating.png'),
  thinking: require('../../assets/gato/gato_thinking.png'),
};

export function getCatImage(pose) {
  return CAT_POSES[pose] || CAT_POSES.welcoming; // si no existe la pose, usa "welcoming" como respaldo
}