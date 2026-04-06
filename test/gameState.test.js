import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createEmptySubBoard, createInitialState, resetGame, applyMove } from '../src/gameState.js';
import { GameModes, PlayerTypes, Players } from '../src/types.js';

const expectAllNull = (cells) => cells.every((cell) => cell === null);

describe('gameState', () => {
  test('createEmptySubBoard returns empty cells and null result', () => {
    const subBoard = createEmptySubBoard();
    assert.equal(subBoard.cells.length, 9);
    assert.ok(expectAllNull(subBoard.cells));
    assert.equal(subBoard.result, null);
  });

  test('createInitialState builds empty macro board and defaults', () => {
    const state = createInitialState();
    assert.equal(state.board.subBoards.length, 9);
    state.board.subBoards.forEach((subBoard) => {
      assert.equal(subBoard.cells.length, 9);
      assert.ok(expectAllNull(subBoard.cells));
      assert.equal(subBoard.result, null);
    });
    assert.equal(state.currentPlayer, Players.X);
    assert.equal(state.activeBoardIndex, null);
    assert.equal(state.moveCount, 0);
    assert.equal(state.winner, null);
    assert.equal(state.isDraw, false);
    assert.deepEqual(state.settings, {
      mode: GameModes.Single,
      playerTypes: { X: PlayerTypes.Human, O: PlayerTypes.AI },
    });
  });

  test('createInitialState uses provided settings without mutation', () => {
    const settings = {
      mode: GameModes.Local,
      playerTypes: { X: PlayerTypes.AI, O: PlayerTypes.Human },
    };
    const state = createInitialState(settings);
    assert.deepEqual(state.settings, settings);
    settings.playerTypes.X = PlayerTypes.Human;
    assert.equal(state.settings.playerTypes.X, PlayerTypes.AI);
  });

  test('resetGame returns fresh state with provided settings', () => {
    const settings = {
      mode: GameModes.Local,
      playerTypes: { X: PlayerTypes.Human, O: PlayerTypes.Human },
    };
    const reset = resetGame(settings);
    assert.equal(reset.moveCount, 0);
    assert.equal(reset.activeBoardIndex, null);
    assert.equal(reset.winner, null);
    assert.equal(reset.isDraw, false);
    assert.deepEqual(reset.settings, settings);
  });
});

describe('gameState applyMove', () => {
  test('applyMove updates board, player turn, and active board', () => {
    const state = createInitialState();
    const nextState = applyMove(state, { subBoardIndex: 0, cellIndex: 3 });
    assert.equal(nextState.board.subBoards[0].cells[3], Players.X);
    assert.equal(nextState.currentPlayer, Players.O);
    assert.equal(nextState.activeBoardIndex, 3);
    assert.equal(nextState.moveCount, 1);
  });

  test('applyMove clears active board when target is resolved', () => {
    const state = createInitialState();
    state.board.subBoards[3].result = 'draw';
    const nextState = applyMove(state, { subBoardIndex: 0, cellIndex: 3 });
    assert.equal(nextState.activeBoardIndex, null);
  });

  test('applyMove updates sub-board and macro winners', () => {
    const state = createInitialState();
    state.board.subBoards[0].result = Players.X;
    state.board.subBoards[1].result = Players.X;
    state.board.subBoards[2].cells = [Players.X, Players.X, null, null, null, null, null, null, null];

    const nextState = applyMove(state, { subBoardIndex: 2, cellIndex: 2, player: Players.X });
    assert.equal(nextState.board.subBoards[2].result, Players.X);
    assert.equal(nextState.board.result, Players.X);
    assert.equal(nextState.winner, Players.X);
    assert.equal(nextState.currentPlayer, Players.O);
  });
});
