import React from 'react';
import styles from './GameOverlay.module.scss';
import type { GameStatus } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

interface GameOverlayProps {
    status: GameStatus;
    onRestart: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ status, onRestart }) => {
    const { t } = useTranslation();
    if (status === 'PLAYING') return null;

    const isWon = status === 'WON';
    const message = isWon ? t('you_win') : t('game_over');
    const overlayClass = isWon ? `${styles.overlay} ${styles.won}` : styles.overlay;

    return (
        <div className={overlayClass}>
            <div className={styles.message}>{message}</div>
            <button className={styles.tryAgainButton} onClick={onRestart}>
                {t('try_again')}
            </button>
        </div>
    );
};
