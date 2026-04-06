/**
 * UI rendering and DOM utilities.
 */

const elements = {
  board: null,
  status: null,
  thinking: null,
  newGame: null,
  modeSelect: null,
  subBoards: [],
  cells: [],
};

/**
 * @param {{
 *  onCellClick: (move: {subBoardIndex: number, cellIndex: number}) => void,
 *  onNewGame: () => void,
 *  onModeChange: (mode: string) => void,
 *  initialMode: string,
 * }} config
 */
export function initUI({ onCellClick, onNewGame, onModeChange, initialMode }) {
  elements.board = document.getElementById('board');
  elements.status = document.getElementById('status');
  elements.thinking = document.getElementById('thinking');
  elements.newGame = document.getElementById('new-game');
  elements.modeSelect = document.getElementById('mode-select');

  elements.board.innerHTML = '';
  elements.subBoards = [];
  elements.cells = [];

  for (let subBoardIndex = 0; subBoardIndex < 9; subBoardIndex += 1) {
    const subBoard = document.createElement('div');
    subBoard.className = 'sub-board';
    subBoard.dataset.subBoardIndex = String(subBoardIndex);
    subBoard.setAttribute('role', 'group');
    subBoard.setAttribute('aria-label', `Sub-board ${subBoardIndex + 1}`);

    const cellRow = [];
    for (let cellIndex = 0; cellIndex < 9; cellIndex += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.subBoardIndex = String(subBoardIndex);
      cell.dataset.cellIndex = String(cellIndex);
      cell.setAttribute('aria-label', `Sub-board ${subBoardIndex + 1}, cell ${cellIndex + 1}`);
      subBoard.appendChild(cell);
      cellRow.push(cell);
    }

    elements.board.appendChild(subBoard);
    elements.subBoards.push(subBoard);
    elements.cells.push(cellRow);
  }

  elements.board.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (!target.classList.contains('cell') || target.disabled) {
      return;
    }
    const subBoardIndex = Number(target.dataset.subBoardIndex);
    const cellIndex = Number(target.dataset.cellIndex);
    onCellClick({ subBoardIndex, cellIndex });
  });

  elements.newGame.addEventListener('click', () => onNewGame());
  elements.modeSelect.addEventListener('change', (event) => {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : initialMode;
    onModeChange(value);
  });

  elements.modeSelect.value = initialMode;
}

/**
 * @param {import('./types.js').GameState} state
 * @param {{ isThinking?: boolean }} options
 */
export function renderUI(state, { isThinking = false } = {}) {
  if (!state) {
    return;
  }

  elements.status.textContent = getStatusText(state, isThinking);
  elements.thinking.hidden = !isThinking;

  state.board.subBoards.forEach((subBoard, subBoardIndex) => {
    const subBoardElement = elements.subBoards[subBoardIndex];
    const isPlayableSubBoard =
      subBoard.result === null &&
      (state.activeBoardIndex === null || state.activeBoardIndex === subBoardIndex);
    const isActive = isPlayableSubBoard && !state.winner && !state.isDraw;

    subBoardElement.classList.toggle('is-active', isActive);
    subBoardElement.classList.toggle('is-resolved', subBoard.result !== null);
    subBoardElement.classList.toggle('is-won', subBoard.result === 'X' || subBoard.result === 'O');
    subBoardElement.classList.toggle('is-draw', subBoard.result === 'draw');
    subBoardElement.dataset.result = subBoard.result ?? '';

    subBoard.cells.forEach((cellValue, cellIndex) => {
      const cellElement = elements.cells[subBoardIndex][cellIndex];
      cellElement.textContent = cellValue ?? '';
      const isPlayableCell =
        isPlayableSubBoard &&
        cellValue === null &&
        !state.winner &&
        !state.isDraw &&
        !isThinking;
      cellElement.disabled = !isPlayableCell;
    });
  });
}

/**
 * @param {import('./types.js').GameState} state
 * @param {boolean} isThinking
 */
function getStatusText(state, isThinking) {
  if (state.winner) {
    return `Winner: ${state.winner}`;
  }
  if (state.isDraw) {
    return 'Game drawn.';
  }
  if (isThinking) {
    return `Current player: ${state.currentPlayer} (AI thinking)`;
  }
  if (state.activeBoardIndex === null) {
    return `Current player: ${state.currentPlayer}  Free move`;
  }
  return `Current player: ${state.currentPlayer}  Active board ${state.activeBoardIndex + 1}`;
}
