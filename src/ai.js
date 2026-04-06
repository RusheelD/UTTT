import { isLegalMove } from './rules.js';
import { applyMove } from './gameState.js';
import { Players } from './types.js';

const MAX_DEPTH = 3;
const MAX_TIME_MS = 180;

/**
 * @param {import('./types.js').GameState} state
 */
export function findBestMove(state) {
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) {
    return null;
  }

  const startTime = performance.now();
  let bestScore = -Infinity;
  let bestMove = legalMoves[0];

  for (const move of legalMoves) {
    const nextState = applyMove(state, { ...move, player: state.currentPlayer });
    const score = minimax(nextState, 1, false, -Infinity, Infinity, state.currentPlayer, startTime);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (performance.now() - startTime > MAX_TIME_MS) {
      break;
    }
  }

  return bestMove;
}

/**
 * @param {import('./types.js').GameState} state
 */
export function getLegalMoves(state) {
  const moves = [];
  for (let subBoardIndex = 0; subBoardIndex < 9; subBoardIndex += 1) {
    for (let cellIndex = 0; cellIndex < 9; cellIndex += 1) {
      const move = { subBoardIndex, cellIndex, player: state.currentPlayer };
      if (isLegalMove(state, move)) {
        moves.push({ subBoardIndex, cellIndex });
      }
    }
  }
  return moves;
}

/**
 * @param {import('./types.js').GameState} state
 * @param {number} depth
 * @param {boolean} isMaximizing
 * @param {number} alpha
 * @param {number} beta
 * @param {import('./types.js').Player} aiPlayer
 * @param {number} startTime
 */
function minimax(state, depth, isMaximizing, alpha, beta, aiPlayer, startTime) {
  if (state.winner || state.isDraw || depth >= MAX_DEPTH) {
    return evaluateState(state, aiPlayer);
  }
  if (performance.now() - startTime > MAX_TIME_MS) {
    return evaluateState(state, aiPlayer);
  }

  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) {
    return evaluateState(state, aiPlayer);
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, { ...move, player: state.currentPlayer });
      const score = minimax(nextState, depth + 1, false, alpha, beta, aiPlayer, startTime);
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const move of legalMoves) {
    const nextState = applyMove(state, { ...move, player: state.currentPlayer });
    const score = minimax(nextState, depth + 1, true, alpha, beta, aiPlayer, startTime);
    bestScore = Math.min(bestScore, score);
    beta = Math.min(beta, score);
    if (beta <= alpha) {
      break;
    }
  }
  return bestScore;
}

/**
 * @param {import('./types.js').GameState} state
 * @param {import('./types.js').Player} aiPlayer
 */
function evaluateState(state, aiPlayer) {
  if (state.winner) {
    return state.winner === aiPlayer ? 1000 : -1000;
  }
  if (state.isDraw) {
    return 0;
  }

  const opponent = aiPlayer === Players.X ? Players.O : Players.X;
  let score = 0;

  state.board.subBoards.forEach((subBoard) => {
    if (subBoard.result === aiPlayer) {
      score += 40;
    } else if (subBoard.result === opponent) {
      score -= 40;
    } else if (subBoard.result === null) {
      score += evaluatePotentialLines(subBoard.cells, aiPlayer) * 2;
      score -= evaluatePotentialLines(subBoard.cells, opponent) * 2;
    }
  });

  return score;
}

/**
 * @param {import('./types.js').CellValue[]} cells
 * @param {import('./types.js').Player} player
 */
function evaluatePotentialLines(cells, player) {
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let lineScore = 0;
  for (const [a, b, c] of WIN_LINES) {
    const line = [cells[a], cells[b], cells[c]];
    const playerCount = line.filter((cell) => cell === player).length;
    const emptyCount = line.filter((cell) => cell === null).length;
    if (playerCount === 2 && emptyCount === 1) {
      lineScore += 6;
    } else if (playerCount === 1 && emptyCount === 2) {
      lineScore += 2;
    }
  }
  return lineScore;
}
