import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Tile.module.scss';
import type { Tile as TileType } from '../../types';
import { ParticleContainer } from '../Particle/ParticleContainer';

interface TileProps {
    tile: TileType;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
    const [showParticles, setShowParticles] = useState(false);

    // Trigger particles on merge
    useEffect(() => {
        if (tile.mergedFrom) {
            setShowParticles(true);
        }
    }, [tile.mergedFrom]);

    // Determine color class
    const valueClass = tile.value <= 2048 ? styles[`tile_${tile.value}`] : styles.tile_super;

    // Calculate position based on grid logic
    // We should ideally get these from CSS variables, but for now we'll match the SCSS logic
    // Grid size: 500, Gap: 15 -> Tile: 106.25
    // Actually, let's use the actual values. 
    // Is there a better way? We can use the CSS classes but Framer Motion layout is struggling.
    // Let's use a simpler approach: use the CSS classes for INITIAL position, then layout for the rest?
    // No, the subagent showed it's broken.

    // Let's use CSS variables for the math to keep it responsive-ish or just match the classes.
    // Actually, if we use 'layout' and 'positionClass', Framer Motion should just work.
    // The reason it might be broken is the conflict between 'transform' in CSS and Framer's internal transform.
    // But I changed it to 'left/top'.

    // Wait! I know why it's broken! 
    // If I use 'left' and 'top' in the CSS class, and 'layout' is on, 
    // Framer Motion will calculate the bounding box. 
    // If the classes are being swapped, the element's position changes in the domestic pool.

    return (
        <motion.div
            layout
            initial={tile.isNew ? { scale: 0, opacity: 0 } : false}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                layout: { type: 'spring', stiffness: 350, damping: 40 },
                scale: { type: 'spring', stiffness: 400, damping: 25 },
                opacity: { duration: 0.1 }
            }}
            className={`${styles.tile} ${styles[`position_x_${tile.x}`]} ${styles[`position_y_${tile.y}`]}`}
            style={{
                zIndex: tile.mergedFrom ? 20 : 10,
                width: 'var(--tile-size)',
                height: 'var(--tile-size)'
            }}
        >
            <motion.div
                className={`${styles.tileInner} ${valueClass}`}
                style={{
                    fontSize: tile.value < 100 ? 'calc(var(--tile-size) * 0.5)' :
                        tile.value < 1000 ? 'calc(var(--tile-size) * 0.4)' :
                            'calc(var(--tile-size) * 0.3)'
                }}
                animate={tile.mergedFrom ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.15 }}
            >
                {tile.value}
            </motion.div>

            {showParticles && (
                <ParticleContainer
                    x={0}
                    y={0}
                    color={getTileColor(tile.value)}
                    onComplete={() => setShowParticles(false)}
                />
            )}
        </motion.div>
    );
};

const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
        2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
        32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
        512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[val] || '#3c3a32';
};
