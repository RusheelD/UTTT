import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { applyMove, validateMove } from '../src/rules.js';
import { createInitialState } from '../src/gameState.js';
import { Players } from '../src/types.js';

const cloneState = (state) => JSON.parse(JSON.stringify(state));

const buildResolvedSubBoard = (result) => ({
  cells: Array(9).fill(result === 'draw' ? 'X' : result ?? null),
  result,
});

describe('rules validation', () => {
  test('validateMove allows legal move on fresh board', () => {
    const state = createInitialState();
    const validation = validateMove(state, { subBoardIndex: 0, cellIndex: 0 });
    assert.equal(validation.valid, true);
  });

  test('validateMove rejects out-of-bounds moves', () => {
    const state = createInitialState();
    const validation = validateMove(state, { subBoardIndex: 9, cellIndex: 0 });
    assert.equal(validation.valid, false);
  });

  test('validateMove enforces active sub-board restriction', () => {
    const state = createInitialState();
    state.activeBoardIndex = 2;
    const validation = validateMove(state, { subBoardIndex: 1, cellIndex: 0 });
    assert.equal(validation.valid, false);
    assert.equal(validation.reason, 'Must play in active sub-board.');
  });

  test('validateMove allows free move when active board resolved', () => {
    const state = createInitialState();
    state.activeBoardIndex = 2;
    state.board.subBoards[2] = buildResolvedSubBoard('draw');
    const validation = validateMove(state, { subBoardIndex: 1, cellIndex: 0 });
    assert.equal(validation.valid, true);
  });

  test('validateMove rejects occupied cell and resolved sub-board', () => {
    const state = createInitialState();
    state.board.subBoards[0].cells[3] = Players.X;
    let validation = validateMove(state, { subBoardIndex: 0, cellIndex: 3 });
    assert.equal(validation.valid, false);
    state.board.subBoards[0].result = Players.X;
    validation = validateMove(state, { subBoardIndex: 0, cellIndex: 4 });
    assert.equal(validation.valid, false);
  });

  test('validateMove rejects moves after game ends', () => {
    const state = createInitialState();
    state.winner = Players.O;
    const validation = validateMove(state, { subBoardIndex: 0, cellIndex: 0 });
    assert.equal(validation.valid, false);
  });
});

describe('rules applyMove', () => {
  test('applyMove updates board, player turn, and active board', () => {
    const state = createInitialState();
    const { state: nextState, error } = applyMove(state, { subBoardIndex: 0, cellIndex: 0 });
    assert.equal(error, null);
    assert.equal(nextState.board.subBoards[0].cells[0], Players.X);
    assert.equal(nextState.currentPlayer, Players.O);
    assert.equal(nextState.activeBoardIndex, 0);
    assert.equal(nextState.moveCount, 1);
    assert.equal(nextState.winner, null);
    assert.equal(nextState.isDraw, false);
  });

  test('applyMove returns error for illegal move without mutating state', () => {
    const state = createInitialState();
    const snapshot = cloneState(state);
    const result = applyMove(state, { subBoardIndex: 0, cellIndex: 9 });
    assert.equal(result.error, 'Move out of bounds.');
    assert.deepEqual(state, snapshot);
  });

  test('applyMove updates sub-board result and macro winner', () => {
    const state = createInitialState();
    state.board.subBoards[0].result = Players.X;
    state.board.subBoards[1].result = Players.X;

    const targetSub = state.board.subBoards[2];
    targetSub.cells = [Players.X, Players.X, null, null, null, null, null, null, null];

    const { state: nextState } = applyMove(state, { subBoardIndex: 2, cellIndex: 2, player: Players.X });
    assert.equal(nextState.board.subBoards[2].result, Players.X);
    assert.equal(nextState.board.result, Players.X);
    assert.equal(nextState.winner, Players.X);
    assert.equal(nextState.activeBoardIndex, null);
    assert.equal(nextState.currentPlayer, Players.X);
  });
});
