/**
 * Win and draw detection utilities.
 */

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
 * @returns {import('./types.js').Player | null}
 */
export function getLineWinner(cells) {
  for (const [a, b, c] of WIN_LINES) {
    const value = cells[a];
    if (value && value === cells[b] && value === cells[c]) {
      return value;
    }
  }
  return null;
}

/**
 * @param {import('./types.js').CellValue[]} cells
 * @returns {boolean}
 */
export function isBoardFull(cells) {
  return cells.every((cell) => cell !== null);
}

/**
 * @param {import('./types.js').SubBoardState} subBoard
 * @returns {import('./types.js').SubBoardResult}
 */
export function getSubBoardResult(subBoard) {
  const winner = getLineWinner(subBoard.cells);
  if (winner) {
    return winner;
  }
  if (isBoardFull(subBoard.cells)) {
    return 'draw';
  }
  return null;
}

/**
 * @param {import('./types.js').MacroBoardState} board
 * @returns {import('./types.js').SubBoardResult}
 */
export function getMacroBoardResult(board) {
  const macroCells = board.subBoards.map((subBoard) =>
    subBoard.result === 'draw' ? null : subBoard.result,
  );
  const winner = getLineWinner(macroCells);
  if (winner) {
    return winner;
  }
  const allResolved = board.subBoards.every((subBoard) => subBoard.result !== null);
  if (allResolved) {
    return 'draw';
  }
  return null;
}
