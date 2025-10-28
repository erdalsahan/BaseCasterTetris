// 🎨 Tetris şekilleri ve renkleri
const SHAPES = [
  {
    name: "I",
    shape: [
      [1, 1, 1, 1],
    ],
    color: "#06b6d4", // cyan
  },
  {
    name: "O",
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#facc15", // yellow
  },
  {
    name: "T",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#a855f7", // purple
  },
  {
    name: "L",
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: "#f97316", // orange
  },
  {
    name: "J",
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "#3b82f6", // blue
  },
  {
    name: "S",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#22c55e", // green
  },
  {
    name: "Z",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#ef4444", // red
  },
];

// 🎲 Rastgele şekil seçici
export const randomShape = () => {
  const rand = Math.floor(Math.random() * SHAPES.length);
  return SHAPES[rand];
};
