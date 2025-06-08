import {
    EXPANDED_COLOR, VISITED_COLOR, PATH_COLOR,
    drawCell, sleep, Node, getAdjacentCells, H,
    visitedCountDisplay, ANIMATION_DELAY, algorithmLog
} from '../js/common.js';

export async function aStar(startState, endState, blocked) {
    let openList = [];
    let closedList = new Map();

    let visitedCount = 0;

    const startNode = new Node(startState, null, 0, H(startState, endState));
    startNode.total_F = startNode.distanceToStart_G + startNode.heuristicDistanceToEnd_H;
    openList.push(startNode);

    while (openList.length > 0) {
        openList.sort((a, b) => a.total_F - b.total_F);
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

        let logEntry = `------------- A* Execution Log -------------\n`;
        logEntry += `Current State: (${currentNode.coordinate[0]}, ${currentNode.coordinate[1]})\n\n`;
        logEntry += `Expanded Nodes:\n`;
        const neighbors = getAdjacentCells(currentNode.coordinate, blocked);
        for (const neighborCoord of neighbors) {
            const gScore = currentNode.distanceToStart_G + 1;
            const hScore = H(neighborCoord, endState);
            const fScore = gScore + hScore;
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
            algorithmLog.scrollTop = algorithmLog.scrollHeight; // Scroll to the bottom
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
                        console.error("Error reconstructing A* path: parent node not found in closedList.");
                        return null;
                    }
                } else {
                    console.error("Error reconstructing A* path: current node has no parent, but is not the start node.");
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

            const gScore = currentNode.distanceToStart_G + 1;
            const hScore = H(neighborCoord, endState);
            const fScore = gScore + hScore;

            const neighborInClosedList = closedList.get(neighborCoordStr);
            const neighborInOpenList = openList.find(n => n.coordinate.toString() === neighborCoordStr);

            if (neighborInClosedList) {
                if (gScore < neighborInClosedList.distanceToStart_G) {
                    closedList.delete(neighborCoordStr);
                    const newNeighborNode = new Node(neighborCoord, currentNode.coordinate, gScore, hScore);
                    newNeighborNode.total_F = fScore;
                    openList.push(newNeighborNode);
                    if (neighborCoordStr !== startState.toString() && neighborCoordStr !== endState.toString()) {
                        drawCell(neighborCoord, VISITED_COLOR);
                        await sleep(ANIMATION_DELAY);
                    }
                }
            } else if (neighborInOpenList) {
                if (gScore < neighborInOpenList.distanceToStart_G) {
                    neighborInOpenList.distanceToStart_G = gScore;
                    neighborInOpenList.heuristicDistanceToEnd_H = hScore;
                    neighborInOpenList.total_F = fScore;
                    neighborInOpenList.parent = currentNode.coordinate;
                }
            } else {
                const newNeighborNode = new Node(neighborCoord, currentNode.coordinate, gScore, hScore);
                newNeighborNode.total_F = fScore;
                openList.push(newNeighborNode);

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