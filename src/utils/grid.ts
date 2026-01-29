import type { Grid, Vector } from '../types';

export const GRID_SIZE = 4;

export const createEmptyGrid = (): Grid => {
    return Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => null)
    );
};

export const getEmptyCells = (grid: Grid): Vector[] => {
    const cells: Vector[] = [];
    grid.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (!tile) {
                cells.push({ x, y });
            }
        });
    });
    return cells;
};

export const getRandomEmptyCell = (grid: Grid): Vector | null => {
    const emptyCells = getEmptyCells(grid);
    if (emptyCells.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
};

export const areGridsEqual = (grid1: Grid, grid2: Grid): boolean => {
    if (grid1.length !== grid2.length) return false;
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid1[y][x]?.value !== grid2[y][x]?.value) return false;
        }
    }
    return true;
};

export const cloneGrid = (grid: Grid): Grid => {
    return grid.map(row => row.map(tile => tile ? { ...tile } : null));
}
