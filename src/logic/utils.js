// Matrisi saat yönünde döndür
export const rotateMatrix = (matrix) => {
  const N = matrix.length;
  const result = Array.from({ length: N }, () => Array(N).fill(0));

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      result[x][N - 1 - y] = matrix[y][x];
    }
  }

  return result;
};
