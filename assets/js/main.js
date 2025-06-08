import { depthFirst } from '../algorithms/dfs.js';
import { breadthFirst } from '../algorithms/bfs.js';
import { bestFirst } from '../algorithms/bestfirst.js';
import { aStar } from '../algorithms/astar.js';

import {
  CELL_WIDTH, CELL_HEIGHT, HORIZONTAL_SPACING, ODD_ROW_OFFSET,
  rows, cols, sleep, ANIMATION_DELAY,
  START_COLOR, END_COLOR, BLOCKED_COLOR, DEFAULT_CELL_COLOR, CELL_BORDER_COLOR,
  EXPANDED_COLOR, VISITED_COLOR, PATH_COLOR,
  Node, getCellDrawingCoords, drawCell, H, G, getAdjacentCells,
  setCanvasAndContext, setVisitedCountDisplay, setAlgorithmLog, algorithmLog
} from './common.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

setCanvasAndContext(canvas, ctx);

const visitedCountDisplay = document.getElementById('visitedCountDisplay');
setVisitedCountDisplay(visitedCountDisplay);

const algorithmLogElement = document.getElementById('algorithmLog');
setAlgorithmLog(algorithmLogElement);

let startState = [5, 5];
let endState = [0, 0];
let blocked = [];
let mode = "start";
let isSimulationRunning = false;

let currentPath = null;

const currentModeDisplay = document.getElementById('currentMode');
const startNodeDisplay = document.getElementById('startNodeDisplay');
const endNodeDisplay = document.getElementById('endNodeDisplay');
const blockedNodesDisplay = document.getElementById('blockedNodesDisplay');

function updateUI() {
  currentModeDisplay.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
  startNodeDisplay.textContent = `(${startState[0]}, ${startState[1]})`;
  endNodeDisplay.textContent = `(${endState[0]}, ${endState[1]})`;
  blockedNodesDisplay.textContent = blocked.map(b => `(${b[0]}, ${b[1]})`).join(', ') || 'None';
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const { x, y, width, height } = getCellDrawingCoords([i, j]);

      ctx.fillStyle = DEFAULT_CELL_COLOR;
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = CELL_BORDER_COLOR;
      ctx.strokeRect(x, y, width, height);
    }
  }

  if (currentPath) {
    for (let i = 0; i < currentPath.length; i++) {
      const coord = currentPath[i];
      if (coord.toString() === startState.toString() || coord.toString() === endState.toString()) {
        continue;
      }
      drawCell(coord, PATH_COLOR);
    }
  }

  drawCell(startState, START_COLOR);

  drawCell(endState, END_COLOR);

  for (let b of blocked) {
    drawCell(b, BLOCKED_COLOR, true);
  }
  updateUI();
}

canvas.addEventListener("click", e => {
  if (isSimulationRunning) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const { x: cellX, y: cellY, width: cellWidth, height: cellHeight } = getCellDrawingCoords([i, j]);

      if (x > cellX && x < cellX + cellWidth && y > cellY && y < cellY + cellHeight) {
        const coord = [i, j];
        const coordStr = coord.toString();

        if (mode === "start") {
          if (!blocked.some(b => b.toString() === coordStr) && coordStr !== endState.toString()) {
            startState = coord;
            currentPath = null;
          } else {
            alert("Cannot select a blocked node or the end node as start!");
          }
        } else if (mode === "end") {
          if (!blocked.some(b => b.toString() === coordStr) && coordStr !== startState.toString()) {
            endState = coord;
            currentPath = null;
          } else {
            alert("Cannot select a blocked node or the start node as end!");
          }
        } else if (mode === "block") {

          if (coordStr === startState.toString() || coordStr === endState.toString()) {
            alert("Cannot block the start or end node!");
          } else {
            const index = blocked.findIndex(b => b[0] === i && b[1] === j);
            if (index >= 0) {
              blocked.splice(index, 1);
            } else {
              blocked.push(coord);
            }
            currentPath = null;
          }
        }
        drawBoard();
        return;
      }
    }
  }
});

function setMode(newMode) {
  mode = newMode;
  updateUI();
}

function setButtonsDisabled(disabled) {
  document.getElementById('btn-set-start').disabled = disabled;
  document.getElementById('btn-set-end').disabled = disabled;
  document.getElementById('btn-set-block').disabled = disabled;
  document.getElementById('btn-run-dfs').disabled = disabled;
  document.getElementById('btn-run-bfs').disabled = disabled;
  document.getElementById('btn-run-bestfirst').disabled = disabled;
  document.getElementById('btn-run-astar').disabled = disabled;
  document.getElementById('btn-reset').disabled = disabled;
}

async function startSearch(algorithm) {
  if (isSimulationRunning) {
    alert("A simulation is already running. Please wait for it to complete.");
    return;
  }

  isSimulationRunning = true;
  setButtonsDisabled(true);

  currentPath = null;
  drawBoard();
  visitedCountDisplay.textContent = '0';
  algorithmLog.innerHTML = '';

  await sleep(ANIMATION_DELAY * 2);

  let foundPath = null;
  switch (algorithm) {
    case 'dfs':
      foundPath = await depthFirst(startState, endState, blocked);
      break;
    case 'bfs':
      foundPath = await breadthFirst(startState, endState, blocked);
      break;
    case 'bestfirst':
      foundPath = await bestFirst(startState, endState, blocked);
      break;
    case 'astar':
      foundPath = await aStar(startState, endState, blocked);
      break;
    default:
      alert("Unknown algorithm.");
  }

  if (foundPath) {
    currentPath = foundPath;
  } else {
    currentPath = null;
  }

  isSimulationRunning = false;
  setButtonsDisabled(false);
  drawBoard();
}

function reset() {
  if (isSimulationRunning) {
    alert("Please wait for the current simulation to complete before resetting.");
    return;
  }
  startState = [5, 5];
  endState = [0, 0];
  blocked = [];
  currentPath = null;
  drawBoard();
  updateUI();
  algorithmLog.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-set-start').addEventListener('click', () => setMode('start'));
  document.getElementById('btn-set-end').addEventListener('click', () => setMode('end'));
  document.getElementById('btn-set-block').addEventListener('click', () => setMode('block'));
  document.getElementById('btn-run-dfs').addEventListener('click', () => startSearch('dfs'));
  document.getElementById('btn-run-bfs').addEventListener('click', () => startSearch('bfs'));
  document.getElementById('btn-run-bestfirst').addEventListener('click', () => startSearch('bestfirst'));
  document.getElementById('btn-run-astar').addEventListener('click', () => startSearch('astar'));
  document.getElementById('btn-reset').addEventListener('click', reset);

  const downloadLogButton = document.getElementById('downloadLogBtn');
  if (downloadLogButton) {
      downloadLogButton.addEventListener('click', () => {
          const logContent = algorithmLogElement.innerText;
          if (!logContent.trim()) {
              alert("The log is empty. Run a simulation first to generate log content.");
              return;
          }

          const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const now = new Date();
          const fileName = `algorithm_log_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.txt`;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      });
  }

  drawBoard();
});