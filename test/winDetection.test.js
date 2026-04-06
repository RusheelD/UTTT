import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { getSubBoardResult, getMacroBoardResult, isBoardFull } from '../src/winDetection.js';

const emptyCells = () => Array(9).fill(null);
const buildSubBoard = (result) => ({
  cells: emptyCells(),
  result,
});

describe('winDetection', () => {
  test('getSubBoardResult returns winner or draw', () => {
    const winning = ['O', 'O', 'O', null, null, null, null, null, null];
    assert.equal(getSubBoardResult(winning), 'O');

    const drawCells = ['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O'];
    assert.equal(getSubBoardResult(drawCells), 'draw');

    assert.equal(getSubBoardResult(emptyCells()), null);
  });

  test('getMacroBoardResult returns winner or draw', () => {
    const board = [
      buildSubBoard('X'),
      buildSubBoard('X'),
      buildSubBoard('X'),
      buildSubBoard(null),
      buildSubBoard(null),
      buildSubBoard(null),
      buildSubBoard(null),
      buildSubBoard(null),
      buildSubBoard(null),
    ];
    assert.equal(getMacroBoardResult(board), 'X');

    const drawBoard = [
      buildSubBoard('X'),
      buildSubBoard('O'),
      buildSubBoard('X'),
      buildSubBoard('O'),
      buildSubBoard('O'),
      buildSubBoard('X'),
      buildSubBoard('X'),
      buildSubBoard('X'),
      buildSubBoard('O'),
    ];
    assert.equal(getMacroBoardResult(drawBoard), 'draw');
  });

  test('isBoardFull detects full board', () => {
    assert.equal(isBoardFull(Array(9).fill('X')), true);
    assert.equal(isBoardFull([...Array(8).fill('O'), null]), false);
  });
});
