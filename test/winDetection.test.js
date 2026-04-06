import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { getLineWinner, isBoardFull, getSubBoardResult, getMacroBoardResult } from '../src/winDetection.js';

const emptyCells = () => Array(9).fill(null);

const buildSubBoard = (result) => ({
  cells: emptyCells(),
  result,
});

describe('winDetection', () => {
  test('getLineWinner returns winner for completed line', () => {
    const cells = emptyCells();
    cells[0] = 'X';
    cells[1] = 'X';
    cells[2] = 'X';
    assert.equal(getLineWinner(cells), 'X');
  });

  test('getLineWinner returns null when no line completed', () => {
    const cells = ['X', 'O', 'X', null, null, null, null, null, null];
    assert.equal(getLineWinner(cells), null);
  });

  test('isBoardFull detects full board', () => {
    assert.equal(isBoardFull(Array(9).fill('X')), true);
    assert.equal(isBoardFull([...Array(8).fill('O'), null]), false);
  });

  test('getSubBoardResult returns winner or draw', () => {
    const winning = { cells: ['O', 'O', 'O', null, null, null, null, null, null], result: null };
    assert.equal(getSubBoardResult(winning), 'O');

    const drawCells = ['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O'];
    assert.equal(getSubBoardResult({ cells: drawCells, result: null }), 'draw');

    assert.equal(getSubBoardResult({ cells: emptyCells(), result: null }), null);
  });

  test('getMacroBoardResult returns winner or draw', () => {
    const board = {
      subBoards: [
        buildSubBoard('X'),
        buildSubBoard('X'),
        buildSubBoard('X'),
        buildSubBoard(null),
        buildSubBoard(null),
        buildSubBoard(null),
        buildSubBoard(null),
        buildSubBoard(null),
        buildSubBoard(null),
      ],
      result: null,
    };
    assert.equal(getMacroBoardResult(board), 'X');

    const drawBoard = {
      subBoards: [
        buildSubBoard('X'),
        buildSubBoard('O'),
        buildSubBoard('X'),
        buildSubBoard('O'),
        buildSubBoard('O'),
        buildSubBoard('X'),
        buildSubBoard('X'),
        buildSubBoard('X'),
        buildSubBoard('O'),
      ],
      result: null,
    };
    assert.equal(getMacroBoardResult(drawBoard), 'draw');
  });
});
