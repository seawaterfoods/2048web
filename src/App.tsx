import React, { useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout/Layout';
import { Board } from './components/Board/Board';
import { Tile } from './components/Tile/Tile';
import { GameOverlay } from './components/GameOverlay/GameOverlay';
import { ControlPad } from './components/ControlPad/ControlPad';
import { useGameLogic, useTouchGestures, useAutoPlay, useKeyboardControls } from './hooks';
import { useTranslation } from './contexts/LanguageContext';
import { Direction } from './types';
import layoutStyles from './components/Layout/Layout.module.scss';

const App: React.FC = () => {
  const { state, startGame, move, undo } = useGameLogic();
  const { isAutoPlaying, toggleAutoPlay } = useAutoPlay(state.grid, state.status, move);
  const { t } = useTranslation();

  // Handle keyboard controls
  useKeyboardControls(move, undo, state.status === 'PLAYING' && !isAutoPlaying);

  // Handle touch interactions
  const handleTouch = useCallback((direction: Direction) => {
    if (state.status === 'PLAYING' && !isAutoPlaying) {
      move(direction);
    }
  }, [move, state.status, isAutoPlaying]);

  useTouchGestures({ onSwipe: handleTouch });

  // Initial game start if no state loaded
  useEffect(() => {
    if (state.grid.flat().every(cell => cell === null)) {
      startGame();
    }
  }, [startGame, state.grid]);

  // Flatten tiles for rendering
  const tiles = state.grid.flat().filter(tile => tile !== null);

  const [controlPadMode, setControlPadMode] = React.useState<'standard' | 'floating'>(() => {
    return (localStorage.getItem('2048-control-mode') as 'standard' | 'floating') || 'standard';
  });

  const [boardMode, setBoardMode] = React.useState<'standard' | 'floating'>(() => {
    return (localStorage.getItem('2048-board-mode') as 'standard' | 'floating') || 'standard';
  });

  const toggleControlPadMode = () => {
    const newMode = controlPadMode === 'standard' ? 'floating' : 'standard';
    setControlPadMode(newMode);
    localStorage.setItem('2048-control-mode', newMode);
  };

  const toggleBoardMode = () => {
    const newMode = boardMode === 'standard' ? 'floating' : 'standard';
    setBoardMode(newMode);
    localStorage.setItem('2048-board-mode', newMode);
  };

  return (
    <Layout
      score={state.score}
      bestScore={state.bestScore}
      onRestart={startGame}
      onUndo={undo}
      onAutoPlay={toggleAutoPlay}
      isAutoPlaying={isAutoPlaying}
    >
      <Board mode={boardMode} onToggleMode={toggleBoardMode}>
        <AnimatePresence>
          {tiles.map(tile => (
            <Tile key={tile!.id} tile={tile!} />
          ))}
        </AnimatePresence>
        <GameOverlay status={state.status} onRestart={startGame} />
      </Board>
      <ControlPad
        onMove={move}
        disabled={state.status !== 'PLAYING' || isAutoPlaying}
        mode={controlPadMode}
        onToggleMode={toggleControlPadMode}
      />
      <div className={layoutStyles.gameIntro}>
        <p>{t('game_intro')}</p>
      </div>
    </Layout>
  );
};

export default App;
