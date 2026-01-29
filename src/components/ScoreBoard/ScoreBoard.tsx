import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ScoreBoard.module.scss';
import { useTranslation } from '../../contexts/LanguageContext';

interface ScoreBoardProps {
    score: number;
    bestScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore }) => {
    const { t } = useTranslation();
    const [scoreDiff, setScoreDiff] = useState<number>(0);
    const [diffKey, setDiffKey] = useState<number>(0);
    const prevScoreRef = useRef(score);

    useEffect(() => {
        const diff = score - prevScoreRef.current;
        if (diff > 0) {
            setScoreDiff(diff);
            setDiffKey(prev => prev + 1);
        }
        prevScoreRef.current = score;
    }, [score]);

    return (
        <div className={styles.scoreContainer}>
            <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>{t('score')}</div>
                <div className={styles.scoreValue}>
                    {score}
                    <AnimatePresence>
                        {scoreDiff > 0 && (
                            <motion.div
                                key={diffKey}
                                initial={{ y: 0, opacity: 1, scale: 1 }}
                                animate={{ y: -60, opacity: 0, scale: 1.2 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className={styles.scoreFloat}
                            >
                                +{scoreDiff}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>{t('best')}</div>
                <div className={styles.scoreValue}>{bestScore}</div>
            </div>
        </div>
    );
};
