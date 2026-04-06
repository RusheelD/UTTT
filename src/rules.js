/**
 * Move validation and application rules.
 */

import { Players } from './types.js';
import { getSubBoardResult, getMacroBoardResult, isBoardFull } from './winDetection.js';

/**
 * @param {import('./types.js').GameState} state
 * @param {import('./types.js').Move} move
 * @returns {{ valid: boolean, reason: string | null }}
 */
export function validateMove(state, move) {
  if (state.winner || state.isDraw) {
    return { valid: false, reason: 'Game is over.' };
  }

  const { subBoardIndex, cellIndex } = move;
  if (subBoardIndex < 0 || subBoardIndex > 8 || cellIndex < 0 || cellIndex > 8) {
    return { valid: false, reason: 'Move out of bounds.' };
  }

  const targetSubBoard = state.board.subBoards[subBoardIndex];
  if (targetSubBoard.result !== null) {
    return { valid: false, reason: 'Sub-board already resolved.' };
  }

  const activeIndex = state.activeBoardIndex;
  if (activeIndex !== null) {
    const activeBoard = state.board.subBoards[activeIndex];
    const activePlayable = activeBoard.result === null && !isBoardFull(activeBoard.cells);
    if (activePlayable && subBoardIndex !== activeIndex) {
      return { valid: false, reason: 'Must play in active sub-board.' };
    }
  }

  if (targetSubBoard.cells[cellIndex] !== null) {
    return { valid: false, reason: 'Cell already occupied.' };
  }

  return { valid: true, reason: null };
}

/**
 * @param {import('./types.js').GameState} state
 * @param {import('./types.js').Move} move
 * @returns {{ state: import('./types.js').GameState, error: string | null }}
 */
export function applyMove(state, move) {
  const validation = validateMove(state, move);
  if (!validation.valid) {
    return { state, error: validation.reason };
  }

  const player = move.player ?? state.currentPlayer;
  const { subBoardIndex, cellIndex } = move;

  const subBoards = state.board.subBoards.map((subBoard, index) => {
    if (index !== subBoardIndex) {
      return subBoard;
    }
    const cells = subBoard.cells.slice();
    cells[cellIndex] = player;
    const updated = {
      cells,
      result: subBoard.result,
    };
    updated.result = getSubBoardResult(updated);
    return updated;
  });

  const board = {
    subBoards,
    result: state.board.result,
  };
  board.result = getMacroBoardResult(board);

  const winner = board.result === Players.X || board.result === Players.O ? board.result : null;
  const isDraw = board.result === 'draw';

  const nextActiveBoard = (() => {
    const targetBoard = subBoards[cellIndex];
    if (!targetBoard || targetBoard.result !== null || isBoardFull(targetBoard.cells)) {
      return null;
    }
    return cellIndex;
  })();

  const nextPlayer = player === Players.X ? Players.O : Players.X;

  return {
    state: {
      ...state,
      board,
      currentPlayer: winner || isDraw ? state.currentPlayer : nextPlayer,
      activeBoardIndex: winner || isDraw ? null : nextActiveBoard,
      moveCount: state.moveCount + 1,
      winner,
      isDraw,
    },
    error: null,
  };
}
