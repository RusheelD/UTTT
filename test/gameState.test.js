import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createEmptySubBoard, createEmptyMacroBoard, createInitialState, resetGame } from '../src/gameState.js';
import { GameModes, PlayerTypes, Players } from '../src/types.js';

const expectAllNull = (cells) => cells.every((cell) => cell === null);

describe('gameState', () => {
  test('createEmptySubBoard returns empty cells and null result', () => {
    const subBoard = createEmptySubBoard();
    assert.equal(subBoard.cells.length, 9);
    assert.ok(expectAllNull(subBoard.cells));
    assert.equal(subBoard.result, null);
  });

  test('createEmptyMacroBoard returns 9 empty sub-boards', () => {
    const board = createEmptyMacroBoard();
    assert.equal(board.subBoards.length, 9);
    board.subBoards.forEach((subBoard) => {
      assert.equal(subBoard.cells.length, 9);
      assert.ok(expectAllNull(subBoard.cells));
      assert.equal(subBoard.result, null);
    });
    assert.equal(board.result, null);
  });

  test('createInitialState uses defaults when settings missing', () => {
    const state = createInitialState();
    assert.equal(state.currentPlayer, Players.X);
    assert.equal(state.activeBoardIndex, null);
    assert.equal(state.moveCount, 0);
    assert.equal(state.winner, null);
    assert.equal(state.isDraw, false);
    assert.deepEqual(state.settings, {
      mode: GameModes.Local,
      playerTypes: { X: PlayerTypes.Human, O: PlayerTypes.Human },
    });
  });

  test('createInitialState merges custom settings', () => {
    const state = createInitialState({
      mode: GameModes.Single,
      playerTypes: { O: PlayerTypes.AI },
    });
    assert.equal(state.settings.mode, GameModes.Single);
    assert.deepEqual(state.settings.playerTypes, { X: PlayerTypes.Human, O: PlayerTypes.AI });
  });

  test('resetGame returns fresh state with provided settings', () => {
    const state = createInitialState({
      mode: GameModes.Single,
      playerTypes: { X: PlayerTypes.Human, O: PlayerTypes.AI },
    });
    const reset = resetGame(state);
    assert.notEqual(reset, state);
    assert.equal(reset.moveCount, 0);
    assert.equal(reset.activeBoardIndex, null);
    assert.equal(reset.winner, null);
    assert.equal(reset.isDraw, false);
    assert.deepEqual(reset.settings, state.settings);
  });
});
