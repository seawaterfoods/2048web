import { useReducer, useEffect, useCallback } from 'react';
import { Direction } from '../types';
import type { GameState } from '../types';
import { createEmptyGrid, getRandomEmptyCell } from '../utils/grid';
import { createTile } from '../utils/tile';
import { moveGrid, canMove } from '../utils/gameLogic';
import type { GameStatus } from '../types';

// Initial state
const initialState: GameState = {
    grid: createEmptyGrid(),
    score: 0,
    bestScore: 0,
    status: 'PLAYING',
    history: [],
};

// Key to store game state in localStorage
const STORAGE_KEY_STATE = '2048-game-state';
const STORAGE_KEY_BEST_SCORE = '2048-best-score';

// Actions
type Action =
    | { type: 'START_GAME' }
    | { type: 'MOVE'; direction: Direction }
    | { type: 'CONTINUE' }
    | { type: 'UNDO' };

const gameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case 'START_GAME': {
            const grid = createEmptyGrid();
            // Spawn 2 tiles
            const cell1 = getRandomEmptyCell(grid);
            if (cell1) grid[cell1.y][cell1.x] = createTile(2, cell1.x, cell1.y);

            const cell2 = getRandomEmptyCell(grid);
            if (cell2) grid[cell2.y][cell2.x] = createTile(Math.random() < 0.9 ? 2 : 4, cell2.x, cell2.y);

            return {
                ...state,
                grid,
                score: 0,
                status: 'PLAYING',
                history: [], // Reset history
            };
        }

        case 'MOVE': {
            if (state.status !== 'PLAYING' && state.status !== 'WON') return state; // Allow move if WON (continue)? No, status check handles it.

            const { grid: newGrid, score: addedScore, moved } = moveGrid(state.grid, action.direction);

            if (!moved) return state;

            // Push to history before modifying state
            // Limit history to 5 steps
            const newHistory = [
                { grid: state.grid, score: state.score },
                ...(state.history || [])
            ].slice(0, 5);

            // Spawn new tile
            const cell = getRandomEmptyCell(newGrid);
            if (cell) {
                newGrid[cell.y][cell.x] = createTile(Math.random() < 0.9 ? 2 : 4, cell.x, cell.y);
            }

            const newScore = state.score + addedScore;
            const newBestScore = Math.max(newScore, state.bestScore);

            // Check for Game Over or Win
            let status: GameStatus = state.status;

            // Check for 2048
            const has2048 = newGrid.some(row => row.some(tile => tile?.value === 2048));
            if (has2048 && !state.grid.some(row => row.some(tile => tile?.value === 2048))) {
                status = 'WON';
            } else if (!canMove(newGrid)) {
                status = 'LOST';
            }

            return {
                ...state,
                grid: newGrid,
                score: newScore,
                bestScore: newBestScore,
                status,
                history: newHistory,
            };
        }

        case 'UNDO': {
            if (!state.history || state.history.length === 0) return state;

            const previous = state.history[0];
            const remainingHistory = state.history.slice(1);

            return {
                ...state,
                grid: previous.grid,
                score: previous.score,
                status: 'PLAYING', // Reset status if it was lost/won? Maybe.
                history: remainingHistory,
            };
        }

        default:
            return state;
    }
};

export const useGameLogic = () => {
    // Load state from local storage or use initial
    const getInitialState = (): GameState => {
        const storedBest = localStorage.getItem(STORAGE_KEY_BEST_SCORE);
        const bestScore = storedBest ? parseInt(storedBest, 10) : 0;

        try {
            const storedState = localStorage.getItem(STORAGE_KEY_STATE);
            if (storedState) {
                const parsedState = JSON.parse(storedState);
                // Validate if grid size matches, otherwise ignore
                if (parsedState.grid && parsedState.grid.length === 4) {
                    return { ...parsedState, bestScore }; // Always use latest bestScore
                }
            }
        } catch (e) {
            console.warn('Failed to load game state', e);
        }

        return {
            ...initialState,
            bestScore
        };
    };

    const [state, dispatch] = useReducer(gameReducer, initialState, getInitialState);

    useEffect(() => {
        // Persist best score
        localStorage.setItem(STORAGE_KEY_BEST_SCORE, state.bestScore.toString());
    }, [state.bestScore]);

    useEffect(() => {
        // Persist game state
        if (state.status === 'PLAYING') {
            localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
        } else {
            // If game over, maybe clear state? 
            // Or keep it so user sees game over screen on reload.
            localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
        }
    }, [state]);

    // Start game on mount ONLY if grid is empty (i.e. not loaded from storage)
    // Actually getInitialState handles hydration.
    // But we have a useEffect below that calls START_GAME on mount?
    // That would overwrite loaded state.

    useEffect(() => {
        // Only start new game if grid is all null (meaning fresh start and no persistence found)
        // But getInitialState returns initialized grid if no persistence.
        // Wait, createEmptyGrid returns all nulls.
        // So we can check if grid is empty.

        const isEmpty = state.grid.every(row => row.every(cell => cell === null));
        if (isEmpty) {
            dispatch({ type: 'START_GAME' });
        }
    }, []); // Run once

    const startGame = useCallback(() => {
        dispatch({ type: 'START_GAME' });
    }, []);

    const move = useCallback((direction: Direction) => {
        dispatch({ type: 'MOVE', direction });
    }, []);

    const undo = useCallback(() => {
        dispatch({ type: 'UNDO' });
    }, []);

    return { state, startGame, move, undo };
};
