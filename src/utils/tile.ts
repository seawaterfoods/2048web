import type { Tile, TileValue } from '../types';
// import { v4 as uuidv4 } from 'uuid'; // Need to install uuid if I use it, or write simple id generator

// Simple ID generator to avoid extra dependency if not strictly needed, 
// but UUID is safer. MVP can use Date + Random.
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const createTile = (value: TileValue, x: number, y: number): Tile => {
    return {
        id: generateId(),
        value,
        x,
        y,
        isNew: true,
    };
};
