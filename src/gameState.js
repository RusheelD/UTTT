import { GameModes, Players, PlayerTypes } from './types.js';
import { getSubBoardResult, getMacroBoardResult, isBoardFull } from './winDetection.js';

const DEFAULT_SETTINGS = Object.freeze({
  mode: GameModes.Single,
  playerTypes: { X: PlayerTypes.Human, O: PlayerTypes.AI },
});

/**
 * @returns {import('./types.js').SubBoardState}
 */
export function createEmptySubBoard() {
  return {
    cells: Array.from({ length: 9 }, () => null),
    result: null,
  };
}

/**
 * @param {import('./types.js').GameSettings} [settings]
 * @returns {import('./types.js').GameState}
 */
export function createInitialState(settings = DEFAULT_SETTINGS) {
  return {
    board: {
      subBoards: Array.from({ length: 9 }, () => createEmptySubBoard()),
      result: null,
    },
    currentPlayer: Players.X,
    activeBoardIndex: null,
    moveCount: 0,
    winner: null,
    isDraw: false,
    settings: {
      mode: settings.mode,
      playerTypes: { ...settings.playerTypes },
    },
  };
}

/**
 * @param {import('./types.js').GameSettings} [settings]
 */
export function resetGame(settings = DEFAULT_SETTINGS) {
  return createInitialState(settings);
}

/**
 * @param {import('./types.js').GameState} state
 * @param {import('./types.js').Move} move
 * @returns {import('./types.js').GameState}
 */
export function applyMove(state, move) {
  const subBoards = state.board.subBoards.map((subBoard, subIndex) => {
    if (subIndex !== move.subBoardIndex) {
      return subBoard;
    }
    const cells = subBoard.cells.map((cell, cellIndex) =>
      cellIndex === move.cellIndex ? move.player ?? state.currentPlayer : cell,
    );
    const result = getSubBoardResult(cells);
    return { cells, result };
  });

  const macroResult = getMacroBoardResult(subBoards);
  const winner = macroResult && macroResult !== 'draw' ? macroResult : null;
  const nextActive = resolveNextActiveBoard(subBoards, move.cellIndex);
  const moveCount = state.moveCount + 1;
  const isDraw = !winner && macroResult === 'draw';

  return {
    ...state,
    board: {
      subBoards,
      result: macroResult,
    },
    currentPlayer: state.currentPlayer === Players.X ? Players.O : Players.X,
    activeBoardIndex: nextActive,
    moveCount,
    winner,
    isDraw,
  };
}

/**
 * @param {import('./types.js').SubBoardState[]} subBoards
 * @param {number} targetIndex
 */
function resolveNextActiveBoard(subBoards, targetIndex) {
  const target = subBoards[targetIndex];
  if (!target || target.result !== null || isBoardFull(target.cells)) {
    return null;
  }
  return targetIndex;
}
