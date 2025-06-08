import {
    EXPANDED_COLOR, VISITED_COLOR, PATH_COLOR,
    drawCell, sleep, Node, getAdjacentCells, H,
    visitedCountDisplay, ANIMATION_DELAY, algorithmLog
} from '../js/common.js';

function insertOrdered(list, node) {
    let i = 0;
    while (i < list.length && list[i].heuristicDistanceToEnd_H < node.heuristicDistanceToEnd_H) {
        i++;
    }
    list.splice(i, 0, node);
}

export async function bestFirst(startState, endState, blocked) {
    let openList = [];
    let closedList = new Map();

    let visitedCount = 0;

    const startNode = new Node(startState, null, 0, H(startState, endState));
    startNode.total_F = startNode.heuristicDistanceToEnd_H;
    insertOrdered(openList, startNode);

    while (openList.length > 0) {
        const currentNode = openList.shift();

        const currentNodeCoordStr = currentNode.coordinate.toString();

        if (closedList.has(currentNodeCoordStr)) {
            continue;
        }

        closedList.set(currentNodeCoordStr, currentNode);
        visitedCount++;
        if (visitedCountDisplay) {
            visitedCountDisplay.textContent = visitedCount;
        }

        if (currentNodeCoordStr !== startState.toString() && currentNodeCoordStr !== endState.toString()) {
            drawCell(currentNode.coordinate, EXPANDED_COLOR);
            await sleep(ANIMATION_DELAY);
        }

        let logEntry = `------------- Best-First Execution Log -------------\n`;
        logEntry += `Current State: (${currentNode.coordinate[0]}, ${currentNode.coordinate[1]})\n\n`;
        logEntry += `Expanded Nodes:\n`;
        const neighbors = getAdjacentCells(currentNode.coordinate, blocked);
        for (const neighborCoord of neighbors) {
            const hScore = H(neighborCoord, endState);
            const gScore = 0;
            const fScore = hScore;
            logEntry += `    Coordinate: (${neighborCoord[0]}, ${neighborCoord[1]})\n`;
            logEntry += `        F (Total Estimated Cost) = ${fScore}\n`;
            logEntry += `        G (Cost from Start)      = ${gScore}\n`;
            logEntry += `        H (Heuristic to End)     = ${hScore}\n\n`;
        }
        logEntry += `Open List: ${openList.map(node => `(${node.coordinate[0]}, ${node.coordinate[1]})`).join(' ')}\n`;
        logEntry += `Closed List: ${Array.from(closedList.values()).map(node => `(${node.coordinate[0]}, ${node.coordinate[1]})`).join(' ')}\n`;
        logEntry += `----------------------\n\n`;
        if (algorithmLog) {
            algorithmLog.innerHTML += logEntry;
            algorithmLog.scrollTop = algorithmLog.scrollHeight;
        }

        if (currentNodeCoordStr === endState.toString()) {
            let currentNodeInPath = currentNode;
            const finalPathCoords = [];

            while (currentNodeInPath) {
                finalPathCoords.push(currentNodeInPath.coordinate);
                if (currentNodeInPath.coordinate.toString() === startState.toString()) {
                    break;
                }
                const parentCoord = currentNodeInPath.parent;
                if (parentCoord) {
                    const foundParentNode = closedList.get(parentCoord.toString());
                    if (foundParentNode) {
                        currentNodeInPath = foundParentNode;
                    } else {
                        console.error("Error reconstructing Best-First path: parent node not found in closedList.");
                        return null;
                    }
                } else {
                    console.error("Error reconstructing Best-First path: current node has no parent, but is not the start node.");
                    return null;
                }
            }

            finalPathCoords.reverse();

            for (let i = 0; i < finalPathCoords.length; i++) {
                const coord = finalPathCoords[i];
                if (coord.toString() === startState.toString() || coord.toString() === endState.toString()) {
                    continue;
                }
                drawCell(coord, PATH_COLOR);
                await sleep(ANIMATION_DELAY / 2);
            }
            console.log("Path found!");
            return finalPathCoords;
        }

        for (const neighborCoord of neighbors) {
            const neighborCoordStr = neighborCoord.toString();

            const hScore = H(neighborCoord, endState);
            const gScore = 0;
            const fScore = hScore;

            const neighborInClosedList = closedList.has(neighborCoordStr);
            const neighborInOpenList = openList.some(n => n.coordinate.toString() === neighborCoordStr);

            if (!neighborInClosedList && !neighborInOpenList) {
                const newNeighborNode = new Node(neighborCoord, currentNode.coordinate, gScore, hScore);
                newNeighborNode.total_F = fScore;
                insertOrdered(openList, newNeighborNode);

                if (neighborCoordStr !== startState.toString() && neighborCoordStr !== endState.toString()) {
                    drawCell(neighborCoord, VISITED_COLOR);
                    await sleep(ANIMATION_DELAY);
                }
            }
        }
    }
    console.log("No path found.");
    return null;
}