
import type { Grid, Tile } from '../types';
import { Direction } from '../types';
import { cloneGrid, GRID_SIZE, getEmptyCells } from './grid';
import { createTile } from './tile';

type MoveResult = {
    grid: Grid;
    score: number;
    moved: boolean;
};

// Use direction to determine vector/traversal if needed, 
// but currently logic is hardcoded for axis processing.

export const moveGrid = (grid: Grid, direction: Direction): MoveResult => {
    const newGrid = cloneGrid(grid);
    let score = 0;
    let moved = false;

    // We need to process tiles in the correct order to ensure they stack correctly.
    // Actually, standard logic:
    // For each line perpendicular to movement:
    //   Extract tiles
    //   Merge
    //   Place back

    if (direction === Direction.LEFT || direction === Direction.RIGHT) {
        for (let y = 0; y < GRID_SIZE; y++) {
            const row = newGrid[y];
            const newRow = processLine(row, direction === Direction.LEFT);

            // Update grid and check for changes
            for (let x = 0; x < GRID_SIZE; x++) {
                const oldTile = row[x];
                const newTile = newRow[x];
                if (newTile) {
                    newTile.x = x;
                    newTile.y = y;
                }

                if (oldTile?.value !== newTile?.value || oldTile?.id !== newTile?.id) {
                    moved = true;
                }
                // Capture score from merges (marked by mergedFrom)
                if (newTile && newTile.mergedFrom) {
                    score += newTile.value;
                }
            }
            newGrid[y] = newRow;
        }
    } else {
        // UP / DOWN
        for (let x = 0; x < GRID_SIZE; x++) {
            const col = [newGrid[0][x], newGrid[1][x], newGrid[2][x], newGrid[3][x]];
            const newCol = processLine(col, direction === Direction.UP);

            for (let y = 0; y < GRID_SIZE; y++) {
                const oldTile = newGrid[y][x];
                const newTile = newCol[y];
                if (newTile) {
                    newTile.x = x;
                    newTile.y = y;
                }

                if (oldTile?.value !== newTile?.value || oldTile?.id !== newTile?.id) {
                    moved = true;
                }
                if (newTile && newTile.mergedFrom) {
                    score += newTile.value;
                }
                newGrid[y][x] = newTile;
            }
        }
    }

    // Handle moved flag correctly: if grids are identical, not moved.
    // My per-tile check above is decent but loose.

    return { grid: newGrid, score, moved };
};

// Process a single line of tiles (row or col)
// moveTowardsStart: true for Left/Up, false for Right/Down
const processLine = (line: (Tile | null)[], moveTowardsStart: boolean): (Tile | null)[] => {
    let tiles = line.filter(t => t !== null) as Tile[];

    if (!moveTowardsStart) {
        tiles.reverse();
    }

    const newTiles: (Tile | null)[] = [];

    for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        let nextTile = tiles[i + 1];

        // Reset merge status for next step
        tile = { ...tile, mergedFrom: undefined, isNew: false };

        if (nextTile && tile.value === nextTile.value) {
            // Merge
            // Create new tile with combined value
            const mergedVal = (tile.value * 2);
            const newTile = createTile(mergedVal, -1, -1); // Coords will be set by caller
            newTile.mergedFrom = [tile, nextTile];
            newTile.isNew = false; // Merged is not "new" in terms of spawn animation usually, or handled differently
            newTiles.push(newTile);
            i++; // Skip next tile
        } else {
            newTiles.push(tile);
        }
    }

    // Pad with nulls
    while (newTiles.length < GRID_SIZE) {
        newTiles.push(null);
    }

    if (!moveTowardsStart) {
        newTiles.reverse();
    }

    return newTiles;
}

export const canMove = (grid: Grid): boolean => {
    // Check for empty cells
    if (getEmptyCells(grid).length > 0) return true;

    // Check for possible merges
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const tile = grid[y][x];
            if (!tile) return true; // Should be covered by empty check but safe

            // Check Right
            if (x < GRID_SIZE - 1) {
                const right = grid[y][x + 1];
                if (right && right.value === tile.value) return true;
            }
            // Check Down
            if (y < GRID_SIZE - 1) {
                const down = grid[y + 1][x];
                if (down && down.value === tile.value) return true;
            }
        }
    }
    return false;
};
