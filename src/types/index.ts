export type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | number;

export interface Tile {
    id: string;
    value: TileValue;
    x: number;
    y: number;
    mergedFrom?: Tile[]; // Determine if it is a result of a merge
    isNew?: boolean; // For animation
}

export type Grid = (Tile | null)[][]; // 4x4 matrix

export type Vector = {
    x: number;
    y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
} as const;

export type GameStatus = 'PLAYING' | 'WON' | 'LOST';

export type GameState = {
    grid: Grid;
    score: number;
    bestScore: number;
    status: GameStatus;
    history?: { grid: Grid; score: number }[]; // Stack for undo
};
