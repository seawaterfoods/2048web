import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction } from '../types';
import type { Grid, GameStatus } from '../types';
import { getBestMove } from '../utils/ai';

export const useAutoPlay = (
    grid: Grid,
    status: GameStatus,
    move: (dir: Direction) => void
) => {
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const toggleAutoPlay = useCallback(() => {
        setIsAutoPlaying(prev => !prev);
    }, []);

    const stopAutoPlay = useCallback(() => {
        setIsAutoPlaying(false);
    }, []);

    useEffect(() => {
        if (isAutoPlaying && status === 'PLAYING') {
            // Run AI loop
            // Use setTimeout to allow UI to render between moves
            timerRef.current = setTimeout(() => {
                // Determine best move
                // We use requestAnimationFrame or just blocking? 
                // Since JS is single threaded, calculation blocks UI.
                // For a demo, blocking 50-100ms is ok.
                const bestMove = getBestMove(grid);

                if (bestMove) {
                    move(bestMove);
                } else {
                    // No valid moves? Should be Game Over handled by game logic.
                    // But if AI returns null, we stop.
                    setIsAutoPlaying(false);
                }
            }, 100); // 100ms delay for visual pacing
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isAutoPlaying, grid, status, move]);

    // Stop if game over
    useEffect(() => {
        if (status !== 'PLAYING') {
            setIsAutoPlaying(false);
        }
    }, [status]);

    return { isAutoPlaying, toggleAutoPlay, stopAutoPlay };
};
