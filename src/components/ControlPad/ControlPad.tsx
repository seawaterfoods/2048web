import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ControlPad.module.scss';
import { Direction } from '../../types';

interface ControlPadProps {
    onMove: (direction: Direction) => void;
    disabled?: boolean;
    mode: 'standard' | 'floating';
    onToggleMode: () => void;
}

export const ControlPad: React.FC<ControlPadProps> = ({ onMove, disabled, mode, onToggleMode }) => {
    // Manage drag position for floating mode
    const [position, setPosition] = useState(() => {
        if (typeof window === 'undefined') return { x: 0, y: 0 };
        const saved = localStorage.getItem('2048-controlpad-position');
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
        localStorage.setItem('2048-controlpad-position', JSON.stringify(newPosition));
    };

    return (
        <motion.div
            className={`${styles.controlPad} ${mode === 'floating' ? styles.floating : ''}`}
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
            <div className={styles.padContent}>
                <motion.button
                    className={styles.toggleMode}
                    onClick={onToggleMode}
                    title={mode === 'floating' ? '固定按鈕' : '懸浮按鈕'}
                    aria-label="Toggle Mode"
                    drag={mode === 'floating'}
                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    dragElastic={0}
                    onDrag={(_event, info) => {
                        if (mode === 'floating') {
                            const newX = position.x + info.delta.x;
                            const newY = position.y + info.delta.y;
                            setPosition({ x: newX, y: newY });
                        }
                    }}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: mode === 'floating' ? 'grab' : 'pointer' }}
                >
                    {mode === 'floating' ? '⚓' : '🚀'}
                </motion.button>
                <div className={styles.row}>
                    <button
                        className={styles.button}
                        onClick={() => onMove(Direction.UP)}
                        disabled={disabled}
                        aria-label="Move Up"
                    >
                        ▲
                    </button>
                </div>
                <div className={styles.row}>
                    <button
                        className={styles.button}
                        onClick={() => onMove(Direction.LEFT)}
                        disabled={disabled}
                        aria-label="Move Left"
                    >
                        ◀
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => onMove(Direction.DOWN)}
                        disabled={disabled}
                        aria-label="Move Down"
                    >
                        ▼
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => onMove(Direction.RIGHT)}
                        disabled={disabled}
                        aria-label="Move Right"
                    >
                        ▶
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
