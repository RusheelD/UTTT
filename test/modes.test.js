import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createDefaultSettings, normalizeSettings, getPlayerType, isAiTurn } from '../src/modes.js';
import { GameModes, PlayerTypes, Players } from '../src/types.js';
import { createInitialState } from '../src/gameState.js';

describe('modes', () => {
  test('createDefaultSettings returns local human config', () => {
    assert.deepEqual(createDefaultSettings(), {
      mode: GameModes.Local,
      playerTypes: { X: PlayerTypes.Human, O: PlayerTypes.Human },
    });
  });

  test('normalizeSettings fills in missing defaults', () => {
    assert.deepEqual(normalizeSettings(), createDefaultSettings());

    const normalized = normalizeSettings({ mode: GameModes.Single, playerTypes: { O: PlayerTypes.AI } });
    assert.equal(normalized.mode, GameModes.Single);
    assert.deepEqual(normalized.playerTypes, { X: PlayerTypes.Human, O: PlayerTypes.AI });
  });

  test('getPlayerType returns configured type for player', () => {
    const settings = normalizeSettings({ playerTypes: { X: PlayerTypes.AI } });
    assert.equal(getPlayerType(settings, Players.X), PlayerTypes.AI);
    assert.equal(getPlayerType(settings, Players.O), PlayerTypes.Human);
  });

  test('isAiTurn detects AI player based on current player', () => {
    const state = createInitialState({ playerTypes: { X: PlayerTypes.AI } });
    assert.equal(isAiTurn(state), true);

    const nextState = { ...state, currentPlayer: Players.O };
    assert.equal(isAiTurn(nextState), false);
  });
});
