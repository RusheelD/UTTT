import { GameModes, PlayerTypes } from './types.js';
import { initUI, renderUI } from './ui.js';
import { createInitialState, applyMove, resetGame } from './gameState.js';
import { isLegalMove } from './rules.js';
import { findBestMove } from './ai.js';

const SINGLE_PLAYER_TYPES = Object.freeze({
  X: PlayerTypes.Human,
  O: PlayerTypes.AI,
});

const LOCAL_PLAYER_TYPES = Object.freeze({
  X: PlayerTypes.Human,
  O: PlayerTypes.Human,
});

let state = createInitialState();
let isThinking = false;

initUI({
  onCellClick: handleCellClick,
  onNewGame: handleNewGame,
  onModeChange: handleModeChange,
  initialMode: state.settings.mode,
});

render();
maybeTriggerAi();

function handleCellClick({ subBoardIndex, cellIndex }) {
  if (isThinking) {
    return;
  }
  const move = { subBoardIndex, cellIndex, player: state.currentPlayer };
  if (!isLegalMove(state, move)) {
    return;
  }
  state = applyMove(state, move);
  render();
  maybeTriggerAi();
}

function handleNewGame() {
  state = resetGame(state.settings);
  isThinking = false;
  render();
  maybeTriggerAi();
}

function handleModeChange(mode) {
  const playerTypes = mode === GameModes.Local ? LOCAL_PLAYER_TYPES : SINGLE_PLAYER_TYPES;
  const settings = {
    ...state.settings,
    mode,
    playerTypes: { ...playerTypes },
  };
  state = resetGame(settings);
  isThinking = false;
  render();
  maybeTriggerAi();
}

function render() {
  renderUI(state, { isThinking });
}

function maybeTriggerAi() {
  if (state.winner || state.isDraw) {
    return;
  }
  const currentPlayerType = state.settings.playerTypes[state.currentPlayer];
  if (state.settings.mode !== GameModes.Single || currentPlayerType !== PlayerTypes.AI) {
    return;
  }

  isThinking = true;
  render();

  window.setTimeout(() => {
    const move = findBestMove(state);
    if (move && isLegalMove(state, move)) {
      state = applyMove(state, { ...move, player: state.currentPlayer });
    }
    isThinking = false;
    render();
  }, 200);
}
