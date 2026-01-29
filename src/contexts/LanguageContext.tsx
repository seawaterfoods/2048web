import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'zh-TW' | 'ja';

interface Translations {
    title_sub: string;
    score: string;
    best: string;
    undo: string;
    new_game: string;
    auto_play: string;
    stop_auto: string;
    game_over: string;
    you_win: string;
    try_again: string;
    game_intro: string;
}

const translations: Record<Language, Translations> = {
    'en': {
        title_sub: 'Join the numbers to get to 2048!',
        score: 'SCORE',
        best: 'BEST',
        undo: 'Undo',
        new_game: 'New Game',
        auto_play: 'Auto Play',
        stop_auto: 'Stop Auto',
        game_over: 'Game Over!',
        you_win: 'You Win!',
        try_again: 'Try again',
        game_intro: 'How to play: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!'
    },
    'zh-TW': {
        title_sub: '合併數字以得到 2048！',
        score: '分數',
        best: '最高分',
        undo: '復原',
        new_game: '新遊戲',
        auto_play: '自動操作',
        stop_auto: '停止自動',
        game_over: '遊戲結束！',
        you_win: '你贏了！',
        try_again: '再試一次',
        game_intro: '玩法：使用方向鍵來移動方塊。當兩個數字相同的方塊碰撞時，它們會合併成一個！'
    },
    'ja': {
        title_sub: '2048を作るために数字を合体させよう！',
        score: 'スコア',
        best: 'ベスト',
        undo: '元に戻す',
        new_game: '新しいゲーム',
        auto_play: '自動操作',
        stop_auto: 'オート停止',
        game_over: 'ゲームオーバー！',
        you_win: 'クリア！',
        try_again: 'もう一度',
        game_intro: '遊び方：矢印キーを使ってタイルを動かします。同じ数字のタイルが重なると、一つに合体します！'
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('2048-lang');
        return (saved as Language) || 'zh-TW';
    });

    useEffect(() => {
        localStorage.setItem('2048-lang', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: keyof Translations) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
