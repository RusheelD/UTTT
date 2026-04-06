/**
 * Game state creation and reset helpers.
 */

import { Players } from './types.js';
import { normalizeSettings } from './modes.js';

/**
 * @returns {import('./types.js').SubBoardState}
 */
export function createEmptySubBoard() {
  return {
    cells: Array(9).fill(null),
    result: null,
  };
}

/**
 * @returns {import('./types.js').MacroBoardState}
 */
export function createEmptyMacroBoard() {
  return {
    subBoards: Array.from({ length: 9 }, () => createEmptySubBoard()),
    result: null,
  };
}

/**
 * @param {Partial<import('./types.js').GameSettings> | undefined} settings
 * @returns {import('./types.js').GameState}
 */
export function createInitialState(settings) {
  return {
    board: createEmptyMacroBoard(),
    currentPlayer: Players.X,
    activeBoardIndex: null,
    moveCount: 0,
    winner: null,
    isDraw: false,
    settings: normalizeSettings(settings),
  };
}

/**
 * @param {import('./types.js').GameState | Partial<import('./types.js').GameSettings> | undefined} input
 * @returns {import('./types.js').GameState}
 */
export function resetGame(input) {
  const settings = input && 'board' in input ? input.settings : input;
  return createInitialState(settings);
}
