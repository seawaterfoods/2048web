export type TileValue = number;

export interface Tile {
    id: string;
    value: TileValue;
    x: number;
    y: number;
    mergedFrom?: Tile[];
    isNew?: boolean;
}

export type Grid = (Tile | null)[][];
export type Vector = { x: number; y: number };

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
    history?: { grid: Grid; score: number }[];
};
