import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleContainerProps {
    x: number;
    y: number;
    color: string;
    onComplete: () => void;
}

export const ParticleContainer: React.FC<ParticleContainerProps> = ({ x, y, color, onComplete }) => {
    const particles = useMemo(() => {
        const count = 12;
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            angle: (i / count) * Math.PI * 2,
            distance: Math.random() * 40 + 20,
            size: Math.random() * 6 + 4,
        }));
    }, []);

    return (
        <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 100 }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        x: Math.cos(p.angle) * p.distance,
                        y: Math.sin(p.angle) * p.distance,
                        opacity: 0,
                        scale: 0.5
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    onAnimationComplete={p.id === 0 ? onComplete : undefined}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        backgroundColor: color,
                        borderRadius: '50%',
                    }}
                />
            ))}
        </div>
    );
};
