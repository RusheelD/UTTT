import { isBoardFull } from './winDetection.js';

/**
 * @param {import('./types.js').GameState} state
 * @param {import('./types.js').Move} move
 */
export function isLegalMove(state, move) {
  if (!state || state.winner || state.isDraw) {
    return false;
  }
  if (
    move.subBoardIndex < 0 ||
    move.subBoardIndex > 8 ||
    move.cellIndex < 0 ||
    move.cellIndex > 8
  ) {
    return false;
  }

  const subBoard = state.board.subBoards[move.subBoardIndex];
  if (!subBoard || subBoard.result !== null) {
    return false;
  }

  if (subBoard.cells[move.cellIndex] !== null) {
    return false;
  }

  if (state.activeBoardIndex === null) {
    return true;
  }

  if (state.activeBoardIndex === move.subBoardIndex) {
    return true;
  }

  const forcedBoard = state.board.subBoards[state.activeBoardIndex];
  if (!forcedBoard) {
    return true;
  }

  return forcedBoard.result !== null || isBoardFull(forcedBoard.cells);
}
