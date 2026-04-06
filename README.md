# Ultimate Tic Tac Toe

A browser-only Ultimate Tic Tac Toe game with a minimax-based AI opponent, polished UI, and local multiplayer support. Built with vanilla HTML/CSS/JS and ready for GitHub Pages.

## Features

- Ultimate Tic Tac Toe rules with active-board targeting and free-move handling.
- Single-player mode (human vs AI) and local multiplayer.
- Responsive, accessible UI with active-board highlights and win overlays.
- Async AI turns with a visible “thinking” indicator.
- Node-based unit tests for core game logic.

## How to Play

1. The active sub-board is highlighted. You must play in that sub-board unless it is full/resolved, in which case you get a free move.
2. Win a sub-board by getting three in a row inside it.
3. Win the game by winning three sub-boards in a row on the macro board.

Use the **Mode** selector to switch between single-player and local multiplayer.

## Getting Started

Because the UI uses ES modules, run a local server instead of opening `index.html` directly:

```bash
# Option 1
npx serve

# Option 2
python -m http.server
```

Then visit the local URL in your browser.

## Controls

- Click a cell to place your mark.
- **New Game** resets the board.
- **Mode** switches between single-player and local multiplayer.

## AI Notes

The AI uses a depth- and time-limited minimax search with alpha-beta pruning and a heuristic evaluator. Turns are computed asynchronously to keep the UI responsive.

## Project Structure

```
index.html        # App shell
styles.css        # UI styling
src/              # Game logic, AI, and UI modules
test/             # Unit tests for core logic
```

## Testing

```bash
npm test
```

## Deployment (GitHub Pages)

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the `main` branch and `/ (root)` folder.

The site will serve `index.html` from the repository root.
