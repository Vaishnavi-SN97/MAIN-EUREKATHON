import { useState, useEffect, useRef, useCallback } from 'react';
import { StartScreen } from './screens/StartScreen';
import { LevelSelectionScreen } from './screens/LevelSelectionScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { ProgressHub } from './screens/ProgressHub';
import { 
  GameState, 
  GameScreen, 
  LevelId, 
  initialGameState, 
  generateTasks,
  StorageManager,
  Mistake
} from './utils/game';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = StorageManager.load();
    return saved || initialGameState;
  });

  const [currentTasks, setCurrentTasks] = useState<any[]>([]);
  
  // Refs to prevent duplicate answer triggers
  const lastAnswerTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // Save state whenever it changes
  useEffect(() => {
    StorageManager.save(gameState);
  }, [gameState]);

  // Function to check and unlock levels based on cumulative score
  const checkAndUnlockLevels = useCallback((currentScore: number, levels: GameState['levels']): GameState['levels'] => {
    return levels.map((level) => {
      // Skip if already unlocked
      if (level.unlocked) return level;
      
      // Check if score threshold is met
      if (currentScore >= level.requiredScore) {
        return { ...level, unlocked: true };
      }
      return level;
    });
  }, []);

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'level-select'
    }));
  };

  const handleSelectLevel = (levelId: LevelId) => {
    const tasks = generateTasks(levelId);
    setCurrentTasks(tasks);
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'gameplay',
      currentLevel: levelId,
      currentTaskIndex: 0,
      completedTasks: 0
    }));
  };

  const handleCorrectAnswer = useCallback(() => {
    // Prevent duplicate triggers - minimum 1 second between answers
    const now = Date.now();
    if (now - lastAnswerTimeRef.current < 1000 || isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    lastAnswerTimeRef.current = now;

    setGameState(prev => {
      const newScore = prev.score + 10;
      const newTaskIndex = prev.currentTaskIndex + 1;
      const newCompletedTasks = prev.completedTasks + 1;
      const tasksLength = currentTasks.length;

      // Check if level is complete
      if (newTaskIndex >= tasksLength) {
        // Mark level as completed
        let updatedLevels = prev.levels.map(level => {
          if (level.id === prev.currentLevel) {
            return { ...level, completed: true };
          }
          return level;
        });

        // Check and unlock next levels based on cumulative score
        updatedLevels = checkAndUnlockLevels(newScore, updatedLevels);

        return {
          ...prev,
          score: newScore,
          completedTasks: newCompletedTasks,
          levels: updatedLevels,
          currentScreen: 'level-complete'
        };
      } else {
        // Check and unlock levels based on cumulative score during gameplay
        const updatedLevels = checkAndUnlockLevels(newScore, prev.levels);

        return {
          ...prev,
          score: newScore,
          currentTaskIndex: newTaskIndex,
          completedTasks: newCompletedTasks,
          levels: updatedLevels
        };
      }
    });

    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  }, [currentTasks, checkAndUnlockLevels]);

  const handleWrongAnswer = useCallback(() => {
    // Prevent duplicate triggers
    const now = Date.now();
    if (now - lastAnswerTimeRef.current < 1000 || isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    lastAnswerTimeRef.current = now;

    setGameState(prev => {
      const newLives = Math.max(0, prev.lives - 1);
      const newScore = Math.max(0, prev.score - 5);

      // Track mistake
      const currentTask = currentTasks[prev.currentTaskIndex];
      const newMistake: Mistake = {
        id: `mistake-${Date.now()}`,
        type: prev.currentLevel || 'counting',
        question: currentTask?.question || 'Unknown',
        timestamp: Date.now(),
        sessionLabel: `Session ${prev.completedTasks + 1}`
      };

      if (newLives === 0) {
        // Game over - reset to level select
        return {
          ...prev,
          lives: 3,
          score: newScore,
          mistakes: [...prev.mistakes, newMistake],
          currentScreen: 'level-select',
          currentLevel: null
        };
      } else {
        return {
          ...prev,
          lives: newLives,
          score: newScore,
          mistakes: [...prev.mistakes, newMistake]
        };
      }
    });

    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  }, [currentTasks]);

  const handleBackToLevelSelect = () => {
    isProcessingRef.current = false;
    lastAnswerTimeRef.current = 0;
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'level-select',
      currentLevel: null,
      lives: 3
    }));
  };

  const handleLevelComplete = () => {
    isProcessingRef.current = false;
    lastAnswerTimeRef.current = 0;
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'level-select',
      currentLevel: null,
      lives: 3
    }));
  };

  const handleOpenProgress = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'progress'
    }));
  };

  const handleBackFromProgress = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'level-select'
    }));
  };

  const completedLevelIds = gameState.levels
    .filter(level => level.completed)
    .map(level => level.id);

  return (
    <div className="min-h-screen">
      {gameState.currentScreen === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {gameState.currentScreen === 'level-select' && (
        <LevelSelectionScreen
          levels={gameState.levels}
          onSelectLevel={handleSelectLevel}
          currentScore={gameState.score}
          onProgressHub={handleOpenProgress}
        />
      )}

      {gameState.currentScreen === 'gameplay' && gameState.currentLevel && (
        <GameplayScreen
          levelId={gameState.currentLevel}
          tasks={currentTasks}
          currentTaskIndex={gameState.currentTaskIndex}
          score={gameState.score}
          lives={gameState.lives}
          completedLevels={completedLevelIds}
          onCorrect={handleCorrectAnswer}
          onWrong={handleWrongAnswer}
          onBack={handleBackToLevelSelect}
        />
      )}

      {gameState.currentScreen === 'level-complete' && gameState.currentLevel && (
        <LevelCompleteScreen
          levelName={gameState.levels.find(l => l.id === gameState.currentLevel)?.name || ''}
          score={gameState.score}
          tasksCompleted={gameState.completedTasks}
          totalTasks={currentTasks.length}
          onContinue={handleLevelComplete}
        />
      )}

      {gameState.currentScreen === 'progress' && (
        <ProgressHub
          score={gameState.score}
          levels={gameState.levels}
          mistakes={gameState.mistakes}
          onBack={handleBackFromProgress}
        />
      )}
    </div>
  );
}
