/**
 * Game mode and player type utilities.
 */

import { GameModes, PlayerTypes, Players } from './types.js';

/**
 * @returns {import('./types.js').GameSettings}
 */
export function createDefaultSettings() {
  return {
    mode: GameModes.Local,
    playerTypes: {
      [Players.X]: PlayerTypes.Human,
      [Players.O]: PlayerTypes.Human,
    },
  };
}

/**
 * @param {Partial<import('./types.js').GameSettings> | undefined} settings
 * @returns {import('./types.js').GameSettings}
 */
export function normalizeSettings(settings) {
  const defaults = createDefaultSettings();
  if (!settings) {
    return defaults;
  }
  return {
    mode: settings.mode ?? defaults.mode,
    playerTypes: {
      ...defaults.playerTypes,
      ...(settings.playerTypes ?? {}),
    },
  };
}

/**
 * @param {import('./types.js').GameSettings} settings
 * @param {import('./types.js').Player} player
 * @returns {import('./types.js').PlayerType}
 */
export function getPlayerType(settings, player) {
  return settings.playerTypes[player];
}

/**
 * @param {import('./types.js').GameState} state
 * @returns {boolean}
 */
export function isAiTurn(state) {
  return getPlayerType(state.settings, state.currentPlayer) === PlayerTypes.AI;
}
