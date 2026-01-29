import { useEffect, useCallback } from 'react';
import { Direction } from '../types';

export const useKeyboardControls = (
    move: (direction: Direction) => void,
    undo: () => void,
    enabled: boolean
) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Prevent default scrolling for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                move(Direction.UP);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                move(Direction.DOWN);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                move(Direction.LEFT);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                move(Direction.RIGHT);
                break;
            case 'u':
            case 'U':
            case 'z': // Standard undo shortcut (Ctrl+Z handled separately usually, but Z is fine here)
                undo();
                break;
        }
    }, [move, undo, enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
};
