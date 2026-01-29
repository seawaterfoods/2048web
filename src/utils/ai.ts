import { Direction } from '../types';
import type { Grid } from '../types';
import { moveGrid } from './gameLogic';
import { cloneGrid, getEmptyCells } from './grid';

const MAX_DEPTH = 3;
const CHANCE_NODE_CANDIDATE_LIMIT = 3;

const SCORING = {
    MONOTONICITY: 1000,
    SMOOTHNESS: -10,
    EMPTY: 500,
    MAX_TILE: 1000,
    CORNER: 2000,
};

export const getBestMove = (grid: Grid): Direction | null => {
    let bestScore = -Infinity;
    let bestMove: Direction | null = null;
    const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];

    for (const dir of directions) {
        const result = moveGrid(grid, dir);
        if (!result.moved) continue;

        const score = expectimax(result.grid, MAX_DEPTH - 1, false);

        if (score > bestScore) {
            bestScore = score;
            bestMove = dir;
        }
    }

    return bestMove;
};

const expectimax = (grid: Grid, depth: number, isMax: boolean): number => {
    if (depth === 0) return evaluate(grid);

    if (isMax) {
        let maxScore = -Infinity;
        let moved = false;

        // Player turn (maximize)
        for (const dir of [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]) {
            const res = moveGrid(grid, dir);
            if (res.moved) {
                moved = true;
                maxScore = Math.max(maxScore, expectimax(res.grid, depth - 1, false));
            }
        }

        if (!moved) return -100000;
        return maxScore;
    } else {
        const emptyCells = getEmptyCells(grid);
        if (emptyCells.length === 0) return evaluate(grid);

        let totalScore = 0;
        let count = 0;

        const candidates = emptyCells.length > CHANCE_NODE_CANDIDATE_LIMIT
            ? emptyCells.sort(() => 0.5 - Math.random()).slice(0, CHANCE_NODE_CANDIDATE_LIMIT)
            : emptyCells;

        for (const cell of candidates) {
            const grid2 = cloneGrid(grid);
            grid2[cell.y][cell.x] = { id: 'temp2', value: 2, x: cell.x, y: cell.y, isNew: false };
            const s2 = expectimax(grid2, depth - 1, true);
            totalScore += 0.9 * s2;

            const grid4 = cloneGrid(grid);
            grid4[cell.y][cell.x] = { id: 'temp4', value: 4, x: cell.x, y: cell.y, isNew: false };
            const s4 = expectimax(grid4, depth - 1, true);
            totalScore += 0.1 * s4;

            count++;
        }

        return totalScore / count;
    }
};

const evaluate = (grid: Grid): number => {
    let score = 0;

    const emptyCells = getEmptyCells(grid).length;
    score += Math.log(emptyCells + 1) * SCORING.EMPTY;

    // 2. Max Tile & Corner
    let maxVal = 0;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (grid[y][x]) {
                if (grid[y][x]!.value > maxVal) {
                    maxVal = grid[y][x]!.value;
                    maxX = x;
                    maxY = y;
                }
            }
        }
    }
    score += maxVal * SCORING.MAX_TILE;

    if ((maxX === 0 || maxX === 3) && (maxY === 0 || maxY === 3)) {
        score += SCORING.CORNER;
    }

    const totals = [0, 0, 0, 0];
    for (let y = 0; y < 4; y++) {
        let current = 0;
        let next = current + 1;
        while (next < 4) {
            while (next < 4 && !grid[y][next]) next++;
            if (next >= 4) { next--; break; }
            const currentVal = grid[y][current] ? Math.log(grid[y][current]!.value) / Math.log(2) : 0;
            const nextVal = grid[y][next] ? Math.log(grid[y][next]!.value) / Math.log(2) : 0;

            if (currentVal > nextVal) {
                totals[0] += nextVal - currentVal; // Score decreases L->R, so it is monotonic Left
            } else if (nextVal > currentVal) {
                totals[1] += currentVal - nextVal; // Score increases L->R, so it is monotonic Right
            }
            current = next;
            next++;
        }
    }

    // Up/Down
    for (let x = 0; x < 4; x++) {
        let current = 0;
        let next = current + 1;
        while (next < 4) {
            while (next < 4 && !grid[next][x]) next++;
            if (next >= 4) { next--; break; }
            const currentVal = grid[current][x] ? Math.log(grid[current][x]!.value) / Math.log(2) : 0;
            const nextVal = grid[next][x] ? Math.log(grid[next][x]!.value) / Math.log(2) : 0;

            if (currentVal > nextVal) {
                totals[2] += nextVal - currentVal; // Monotonic Up
            } else if (nextVal > currentVal) {
                totals[3] += currentVal - nextVal; // Monotonic Down
            }
            current = next;
            next++;
        }
    }

    score += Math.max(...totals) * SCORING.MONOTONICITY;


    // 4. Smoothness (minimize difference between neighbors)
    let smoothness = 0;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (grid[y][x]) {
                const val = Math.log(grid[y][x]!.value) / Math.log(2);
                if (x < 3 && grid[y][x + 1]) {
                    const right = Math.log(grid[y][x + 1]!.value) / Math.log(2);
                    smoothness -= Math.abs(val - right);
                }
                if (y < 3 && grid[y + 1][x]) {
                    const down = Math.log(grid[y + 1][x]!.value) / Math.log(2);
                    smoothness -= Math.abs(val - down);
                }
            }
        }
    }
    score += smoothness * Math.abs(SCORING.SMOOTHNESS);

    return score;
};
