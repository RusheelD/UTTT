/**
 * Shared type definitions and enums for Ultimate Tic Tac Toe.
 */

/** @typedef {'X' | 'O'} Player */
/** @typedef {'X' | 'O' | null} CellValue */
/** @typedef {'X' | 'O' | 'draw' | null} SubBoardResult */
/** @typedef {'single' | 'local'} GameMode */
/** @typedef {'human' | 'ai'} PlayerType */

/**
 * @typedef {Object} SubBoardState
 * @property {CellValue[]} cells - Length 9.
 * @property {SubBoardResult} result - Winner/draw for this sub-board.
 */

/**
 * @typedef {Object} MacroBoardState
 * @property {SubBoardState[]} subBoards - Length 9.
 * @property {SubBoardResult} result - Overall winner/draw for the macro board.
 */

/**
 * @typedef {Object} PlayerTypesByPlayer
 * @property {PlayerType} X
 * @property {PlayerType} O
 */

/**
 * @typedef {Object} GameSettings
 * @property {GameMode} mode
 * @property {PlayerTypesByPlayer} playerTypes
 */

/**
 * @typedef {Object} GameState
 * @property {MacroBoardState} board
 * @property {Player} currentPlayer
 * @property {number | null} activeBoardIndex - 0-8 or null for free move.
 * @property {number} moveCount
 * @property {Player | null} winner
 * @property {boolean} isDraw
 * @property {GameSettings} settings
 */

/**
 * @typedef {Object} Move
 * @property {number} subBoardIndex - 0-8.
 * @property {number} cellIndex - 0-8.
 * @property {Player} [player]
 */

/** @readonly @enum {Player} */
export const Players = Object.freeze({
  X: 'X',
  O: 'O',
});

/** @readonly @enum {GameMode} */
export const GameModes = Object.freeze({
  Single: 'single',
  Local: 'local',
});

/** @readonly @enum {PlayerType} */
export const PlayerTypes = Object.freeze({
  Human: 'human',
  AI: 'ai',
});
