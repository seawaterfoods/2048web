import { describe, it, expect } from 'vitest';
import { moveGrid, canMove } from './gameLogic';
import { createTile } from './tile';
import { Direction } from '../types';
import type { Grid } from '../types';

// Helper to create grid from number array
const createGridFromMatrix = (matrix: number[][]): Grid => {
    return matrix.map((row, y) =>
        row.map((val, x) => val === 0 ? null : createTile(val, x, y))
    );
};

// Helper to extract matrix from grid
const extractMatrix = (grid: Grid): number[][] => {
    return grid.map(row => row.map(tile => tile ? tile.value : 0));
};

describe('Game Logic', () => {
    describe('moveGrid', () => {
        it('should move tiles to the left', () => {
            // [2, 0, 0, 0] -> [2, 0, 0, 0]
            // [0, 2, 0, 0] -> [2, 0, 0, 0]
            // [2, 2, 0, 0] -> [4, 0, 0, 0]
            // [2, 2, 2, 2] -> [4, 4, 0, 0]

            const input = createGridFromMatrix([
                [2, 0, 0, 2],
                [0, 2, 0, 0],
                [2, 2, 0, 0],
                [2, 2, 2, 2]
            ]);

            const expected = [
                [4, 0, 0, 0], // Merge 2+2
                [2, 0, 0, 0], // Move
                [4, 0, 0, 0], // Merge
                [4, 4, 0, 0]  // Double merge
            ];

            const result = moveGrid(input, Direction.LEFT);
            expect(extractMatrix(result.grid)).toEqual(expected);
            expect(result.moved).toBe(true);
            expect(result.score).toBe(4 + 4 + 4 + 4);
        });

        it('should move tiles to the right', () => {
            const input = createGridFromMatrix([
                [2, 0, 0, 2],
                [0, 2, 0, 0],
                [2, 2, 0, 0],
                [2, 2, 2, 2]
            ]);

            const expected = [
                [0, 0, 0, 4],
                [0, 0, 0, 2],
                [0, 0, 0, 4],
                [0, 0, 4, 4]
            ];

            const result = moveGrid(input, Direction.RIGHT);
            expect(extractMatrix(result.grid)).toEqual(expected);
            expect(result.moved).toBe(true);
        });

        it('should not move if blocked', () => {
            const input = createGridFromMatrix([
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]
            ]);

            const result = moveGrid(input, Direction.LEFT);
            expect(result.moved).toBe(false);
        });
    });

    describe('canMove', () => {
        it('should return true if empty cells exist', () => {
            const input = createGridFromMatrix([
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 0] // 0 is empty
            ]);
            expect(canMove(input)).toBe(true);
        });

        it('should return true if merges are possible', () => {
            const input = createGridFromMatrix([
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 4] // 4, 4 adjacent
            ]);
            expect(canMove(input)).toBe(true);
        });

        it('should return false if no moves possible', () => {
            const input = createGridFromMatrix([
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]
            ]);
            expect(canMove(input)).toBe(false);
        });
    });
});
