const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * @param {import('./types.js').CellValue[]} cells
 */
export function getSubBoardResult(cells) {
  for (const [a, b, c] of WIN_LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  if (cells.every((cell) => cell !== null)) {
    return 'draw';
  }
  return null;
}

/**
 * @param {import('./types.js').SubBoardState[]} subBoards
 */
export function getMacroBoardResult(subBoards) {
  const macroCells = subBoards.map((subBoard) =>
    subBoard.result === 'X' || subBoard.result === 'O' ? subBoard.result : null,
  );

  for (const [a, b, c] of WIN_LINES) {
    if (macroCells[a] && macroCells[a] === macroCells[b] && macroCells[a] === macroCells[c]) {
      return macroCells[a];
    }
  }

  const allResolved = subBoards.every((subBoard) => subBoard.result !== null);
  if (allResolved) {
    return 'draw';
  }

  return null;
}

/**
 * @param {import('./types.js').CellValue[]} cells
 */
export function isBoardFull(cells) {
  return cells.every((cell) => cell !== null);
}
