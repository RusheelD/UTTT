import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { isLegalMove } from '../src/rules.js';
import { createInitialState } from '../src/gameState.js';
import { Players } from '../src/types.js';

describe('rules isLegalMove', () => {
  test('allows legal move on fresh board', () => {
    const state = createInitialState();
    assert.equal(isLegalMove(state, { subBoardIndex: 0, cellIndex: 0 }), true);
  });

  test('rejects out-of-bounds moves', () => {
    const state = createInitialState();
    assert.equal(isLegalMove(state, { subBoardIndex: 9, cellIndex: 0 }), false);
  });

  test('enforces active sub-board restriction', () => {
    const state = createInitialState();
    state.activeBoardIndex = 2;
    assert.equal(isLegalMove(state, { subBoardIndex: 1, cellIndex: 0 }), false);
  });

  test('allows free move when forced board is full', () => {
    const state = createInitialState();
    state.activeBoardIndex = 2;
    state.board.subBoards[2].cells = Array(9).fill(Players.X);
    assert.equal(isLegalMove(state, { subBoardIndex: 1, cellIndex: 0 }), true);
  });

  test('rejects occupied cell or resolved sub-board', () => {
    const state = createInitialState();
    state.board.subBoards[0].cells[3] = Players.X;
    assert.equal(isLegalMove(state, { subBoardIndex: 0, cellIndex: 3 }), false);
    state.board.subBoards[0].result = Players.X;
    assert.equal(isLegalMove(state, { subBoardIndex: 0, cellIndex: 4 }), false);
  });

  test('rejects moves after game ends', () => {
    const state = createInitialState();
    state.winner = Players.O;
    assert.equal(isLegalMove(state, { subBoardIndex: 0, cellIndex: 0 }), false);
  });
});
