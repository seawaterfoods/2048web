import { useEffect, useRef } from 'react';
import { Direction } from '../types';

interface TouchGesturesOptions {
    onSwipe: (direction: Direction) => void;
    threshold?: number; // Minimum distance to trigger swipe
}

export const useTouchGestures = ({ onSwipe, threshold = 50 }: TouchGesturesOptions) => {
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartX.current === null || touchStartY.current === null) {
                return;
            }

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchEndX - touchStartX.current;
            const diffY = touchEndY - touchStartY.current;

            const absDiffX = Math.abs(diffX);
            const absDiffY = Math.abs(diffY);

            if (Math.max(absDiffX, absDiffY) > threshold) {
                // It's a swipe
                if (absDiffX > absDiffY) {
                    // Horizontal
                    if (diffX > 0) {
                        onSwipe(Direction.RIGHT);
                    } else {
                        onSwipe(Direction.LEFT);
                    }
                } else {
                    // Vertical
                    if (diffY > 0) {
                        onSwipe(Direction.DOWN);
                    } else {
                        onSwipe(Direction.UP);
                    }
                }

                // Prevent default behavior if needed? 
                // We usually want to prevent scrolling when swiping on the game board.
                // But this listener is on window currently (or we can attach to element).
                // If on window, verify e.cancelable before preventDefault if we modify it.
            }

            touchStartX.current = null;
            touchStartY.current = null;
        };

        // Using simple window listeners for MVP. Ideally attach to board ref.
        // To prevent scrolling, we should use { passive: false } and preventDefault in touchmove.

        // Let's add touchmove to prevent scroll ONLY if swipe is detected? 
        // Or just prevent default on the board area.

        const element = window;

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSwipe, threshold]);
};
