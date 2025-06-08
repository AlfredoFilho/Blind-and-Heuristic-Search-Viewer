export let canvas;
export let ctx;

export function setCanvasAndContext(c, context) {
    canvas = c;
    ctx = context;
}

export const CELL_WIDTH = 50;
export const CELL_HEIGHT = 49;
export const HORIZONTAL_SPACING = 5;
export const ODD_ROW_OFFSET = 25;
export const OFFSET_GLOBAL_X = 20;

export const rows = 11;
export const cols = 11;

export const ANIMATION_DELAY = 100;

export const START_COLOR = "orange";
export const END_COLOR = "#456fb2";
export const BLOCKED_COLOR = "red";
export const DEFAULT_CELL_COLOR = "#f0f0f0";
export const CELL_BORDER_COLOR = "#ccc";
export const EXPANDED_COLOR = "rgba(128, 128, 128, 0.5)";
export const VISITED_COLOR = "rgba(97, 183, 107, 0.5)";
export const PATH_COLOR = "#4a8e52";

export let visitedCountDisplay;
export function setVisitedCountDisplay(element) {
    visitedCountDisplay = element;
}

export let algorithmLog;
export function setAlgorithmLog(element) {
    algorithmLog = element;
}

export class Node {
    constructor(coordinate, parent = null, distanceToStart_G = 0, heuristicDistanceToEnd_H = 0) {
        this.coordinate = coordinate;
        this.parent = parent;
        this.distanceToStart_G = distanceToStart_G;
        this.heuristicDistanceToEnd_H = heuristicDistanceToEnd_H;
        this.total_F = this.distanceToStart_G + this.heuristicDistanceToEnd_H;
    }
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function getCellDrawingCoords(coord) {
    const row = coord[0];
    const col = coord[1];

    let x_offset = col * (CELL_WIDTH + HORIZONTAL_SPACING);
    if (row % 2 !== 0) {
        x_offset += ODD_ROW_OFFSET;
    }
    x_offset += OFFSET_GLOBAL_X;

    const y_offset = row * CELL_HEIGHT;

    const x = x_offset;
    const y = y_offset;

    const centerX = x + CELL_WIDTH / 2;
    const centerY = y + CELL_HEIGHT / 2;

    const radius = (CELL_WIDTH / 2) * 0.4;

    return { x, y, width: CELL_WIDTH, height: CELL_HEIGHT, centerX, centerY, radius };
}

export function drawCell(coord, color, cross = false) {
    if (!ctx) {
        console.error("Canvas context not available in drawCell.");
        return;
    }
    const { x, y, width, height, centerX, centerY, radius } = getCellDrawingCoords(coord);

    ctx.fillStyle = DEFAULT_CELL_COLOR;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = CELL_BORDER_COLOR;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (cross) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y + height * 0.2);
        ctx.lineTo(x + width * 0.8, y + height * 0.8);
        ctx.moveTo(x + width * 0.8, y + height * 0.2);
        ctx.lineTo(x + width * 0.2, y + height * 0.8);
        ctx.stroke();
        ctx.closePath();
    }
}

export function H(current, exit) {
    const difference = exit[1] - current[1];

    if (current[0] === exit[0]) {
        return Math.abs(difference);
    }

    if (current[0] % 2 === 1) {
        if (Math.abs(current[0] - exit[0]) === 1) {
            if (difference <= 0) {
                return Math.abs(difference) + 1;
            } else {
                return Math.abs(difference);
            }
        }

        if (Math.abs(current[0] - exit[0]) === 2) {
            if (difference === 0) {
                return 2;
            } else {
                return Math.abs(difference) + 1;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 3) {
            if (difference >= -1 && difference <= 2) {
                return 3;
            } else if (difference > 0) {
                return Math.abs(difference) + 3;
            } else {
                return Math.abs(difference) + 2;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 4) {
            if (difference >= -1 && difference <= 2) {
                return 4;
            } else if (difference > 0) {
                return Math.abs(difference) + 3;
            } else {
                return Math.abs(difference) + 3;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 5) {
            if (difference >= -2 && difference <= 3) {
                return 5;
            } else if (difference > 0) {
                return Math.abs(difference) + 4;
            } else {
                return Math.abs(difference) + 3;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 6) {
            if (difference >= -2 && difference <= 3) {
                return 6;
            } else if (difference > 0) {
                return Math.abs(difference) + 4;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 7) {
            if (difference >= -3 && difference <= 4) {
                return 7;
            } else if (difference > 0) {
                return Math.abs(difference) + 5;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 8) {
            if (difference >= -4 && difference <= 4) {
                return 8;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 9) {
            if (difference >= -5 && difference <= 4) {
                return 9;
            } else if (difference > 0) {
                return Math.abs(difference) + 5;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 10) {
            if (difference >= -5 && difference <= 5) {
                return 10;
            } else {
                return Math.abs(difference) + 5;
            }
        }
    } else {
        if (Math.abs(current[0] - exit[0]) === 1) {
            if (difference >= 0) {
                return Math.abs(difference) + 1;
            } else {
                return Math.abs(difference);
            }
        }

        if (Math.abs(current[0] - exit[0]) === 2) {
            if (difference === 0) {
                return 2;
            } else {
                return Math.abs(difference) + 1;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 3) {
            if (difference >= -2 && difference <= 1) {
                return 3;
            } else if (difference > 0) {
                return Math.abs(difference) + 2;
            } else {
                return Math.abs(difference) + 3;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 4) {
            if (difference >= -2 && difference <= 1) {
                return 4;
            } else if (difference > 0) {
                return Math.abs(difference) + 3;
            } else {
                return Math.abs(difference) + 3;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 5) {
            if (difference >= -3 && difference <= 2) {
                return 5;
            } else if (difference > 0) {
                return Math.abs(difference) + 3;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 6) {
            if (difference >= -3 && difference <= 2) {
                return 6;
            } else if (difference > 0) {
                return Math.abs(difference) + 4;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 7) {
            if (difference >= -4 && difference <= 3) {
                return 7;
            } else if (difference > 0) {
                return Math.abs(difference) + 4;
            } else {
                return Math.abs(difference) + 5;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 8) {
            if (difference >= -4 && difference <= 3) {
                return 8;
            } else {
                return Math.abs(difference) + 4;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 9) {
            if (difference >= -4 && difference <= 5) {
                return 9;
            } else if (difference > 0) {
                return Math.abs(difference) + 4;
            } else {
                return Math.abs(difference) + 5;
            }
        }

        if (Math.abs(current[0] - exit[0]) === 10) {
            if (difference >= -5 && difference <= 5) {
                return 10;
            } else {
                return Math.abs(difference) + 5;
            }
        }
    }
    return Infinity;
}

export function G(start, current, closedList, openList) {
    let g_val = 0;
    if (current[0] === start[0] && current[1] === start[1]) {
        return g_val;
    } else {
        let currentNode = openList.find(n => n.coordinate[0] === current[0] && n.coordinate[1] === current[1]);
        if (!currentNode) {
            currentNode = closedList.find(n => n.coordinate[0] === current[0] && n.coordinate[1] === current[1]);
        }
        if (currentNode && currentNode.parent) {
            let parentNode = openList.find(n => n.coordinate[0] === currentNode.parent[0] && n.coordinate[1] === currentNode.parent[1]);
            if (!parentNode) {
                parentNode = closedList.find(n => n.coordinate[0] === currentNode.parent[0] && n.coordinate[1] === currentNode.parent[1]);
            }
            if (parentNode) {
                return parentNode.distanceToStart_G + 1;
            }
        }
        return 1;
    }
}

export function getAdjacentCells(coord, blocked) {
  const [x, y] = coord;
  const isOddRow = x % 2 !== 0;
  let candidates;

  if (isOddRow) {
    candidates = [
      [x + 1, y + 1],
      [x, y + 1],
      [x - 1, y + 1],
      [x - 1, y],
      [x, y - 1],
      [x + 1, y]
    ];
  } else {
    candidates = [
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1]
    ];
  }

  return candidates.filter(([i, j]) =>
    i >= 0 && i < rows &&
    j >= 0 && j < cols &&
    !blocked.some(b => b[0] === i && b[1] === j)
  );
}