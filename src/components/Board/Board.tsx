import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Board.module.scss';
import { GRID_SIZE } from '../../utils/grid';

interface BoardProps {
    children?: React.ReactNode;
    mode?: 'standard' | 'floating';
    onToggleMode?: () => void;
}

export const Board: React.FC<BoardProps> = ({ children, mode = 'standard', onToggleMode }) => {
    // Generate 16 empty cells for background
    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

    // Manage drag position for floating mode
    const [position, setPosition] = useState(() => {
        if (typeof window === 'undefined') return { x: 0, y: 0 };
        const saved = localStorage.getItem('2048-board-position');
        return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    });

    // Reset position when switching modes
    useEffect(() => {
        if (mode === 'standard') {
            setPosition({ x: 0, y: 0 });
        }
    }, [mode]);

    const handleDragEnd = (_event: any, info: any) => {
        const newPosition = { x: info.point.x, y: info.point.y };
        setPosition(newPosition);
        localStorage.setItem('2048-board-position', JSON.stringify(newPosition));
    };

    return (
        <motion.div
            className={`${styles.boardWrapper} ${mode === 'floating' ? styles.floating : ''}`}
            drag={mode === 'floating'}
            dragMomentum={false}
            dragElastic={0.05}
            dragConstraints={{
                top: 0,
                left: 0,
                right: typeof window !== 'undefined' ? window.innerWidth - 100 : 0,
                bottom: typeof window !== 'undefined' ? window.innerHeight - 100 : 0
            }}
            style={mode === 'floating' ? { x: position.x, y: position.y } : {}}
            onDragEnd={handleDragEnd}
            dragListener={false}
        >
            {onToggleMode && (
                <motion.button
                    className={styles.toggleMode}
                    onClick={onToggleMode}
                    title={mode === 'floating' ? '固定棋盤' : '懸浮棋盤'}
                    drag={mode === 'floating'}
                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    dragElastic={0}
                    onDrag={(event, info) => {
                        // Propagate drag to parent
                        if (mode === 'floating') {
                            const parent = (event.target as HTMLElement).closest(`.${styles.boardWrapper}`) as HTMLElement;
                            if (parent) {
                                const newX = position.x + info.delta.x;
                                const newY = position.y + info.delta.y;
                                setPosition({ x: newX, y: newY });
                            }
                        }
                    }}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: mode === 'floating' ? 'grab' : 'pointer' }}
                >
                    {mode === 'floating' ? '⚓' : '🚀'}
                </motion.button>
            )}
            <div className={styles.backgroundGrid}>
                {cells.map((_, index) => (
                    <div key={index} className={styles.gridCell} />
                ))}
            </div>
            <div className={styles.tileContainer}>
                {children}
            </div>
        </motion.div>
    );
};
