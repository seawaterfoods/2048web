import React, { useState, useEffect } from 'react';
import styles from './Layout.module.scss';
import { ScoreBoard } from '../ScoreBoard/ScoreBoard';
import { useTranslation } from '../../contexts/LanguageContext';

interface LayoutProps {
    children: React.ReactNode;
    score: number;
    bestScore: number;
    onRestart: () => void;
    onUndo?: () => void;
    onAutoPlay?: () => void;
    isAutoPlaying?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, score, bestScore, onRestart, onUndo, onAutoPlay, isAutoPlaying }) => {
    const { t, setLanguage, language } = useTranslation();
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('2048-theme') as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('2048-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <main className={styles.layout}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.title}>2048</h1>
                        <div className={styles.headerButtons}>
                            <div className={styles.languageGroup}>
                                <button
                                    className={`${styles.langButton} ${language === 'zh-TW' ? styles.activeLang : ''}`}
                                    onClick={() => setLanguage('zh-TW')}
                                >
                                    繁
                                </button>
                                <button
                                    className={`${styles.langButton} ${language === 'en' ? styles.activeLang : ''}`}
                                    onClick={() => setLanguage('en')}
                                >
                                    EN
                                </button>
                                <button
                                    className={`${styles.langButton} ${language === 'ja' ? styles.activeLang : ''}`}
                                    onClick={() => setLanguage('ja')}
                                >
                                    日
                                </button>
                            </div>
                            <button className={styles.themeToggle} onClick={toggleTheme}>
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </div>
                    </div>
                    <div className={styles.subText}>{t('title_sub')}</div>
                </div>
                <div className={styles.scoresContainer}>
                    <ScoreBoard score={score} bestScore={bestScore} />
                    <div className={styles.controls}>
                        {onUndo && (
                            <button className={styles.newGameButton} onClick={onUndo}>
                                {t('undo')}
                            </button>
                        )}
                        <button className={styles.newGameButton} onClick={onRestart}>
                            {t('new_game')}
                        </button>
                        <button
                            className={styles.newGameButton}
                            onClick={onAutoPlay}
                            style={{ backgroundColor: isAutoPlaying ? '#e74c3c' : '#f1c40f' }}
                        >
                            {isAutoPlaying ? t('stop_auto') : t('auto_play')}
                        </button>
                    </div>
                </div>
            </div>
            {children}
        </main>
    );
};
