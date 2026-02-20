import { motion } from 'motion/react';
import { PixelCharacter } from '../components/PixelCharacter';
import { LevelCard } from '../components/LevelCard';
import { Level, LevelId } from '../utils/game';
import { SoundManager, VoiceManager } from '../utils/sound';
import { BarChart3 } from 'lucide-react';

interface LevelSelectionScreenProps {
  levels: Level[];
  onSelectLevel: (levelId: LevelId) => void;
  currentScore: number;
  onProgressHub?: () => void;
}

export function LevelSelectionScreen({ levels, onSelectLevel, currentScore, onProgressHub }: LevelSelectionScreenProps) {
  const handleLevelSelect = (levelId: LevelId) => {
    SoundManager.playClick();
    VoiceManager.speak("Let's start this challenge!");
    setTimeout(() => {
      onSelectLevel(levelId);
    }, 300);
  };

  const handleProgressClick = () => {
    SoundManager.playClick();
    onProgressHub?.();
  };

  return (
    <div className="min-h-screen bg-retro-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="text-center flex-1">
            <h1 className="text-retro-green text-[20px] mb-4">LEVEL SELECT</h1>
            <div className="text-retro-cyan text-[10px]">
              Total Score: {currentScore}
            </div>
          </div>
          
          {onProgressHub && (
            <button
              onClick={handleProgressClick}
              className="flex items-center gap-2 bg-retro-purple text-retro-yellow px-4 py-2 border-4 border-retro-yellow hover:bg-retro-yellow hover:text-retro-bg transition-colors ml-8"
              style={{ boxShadow: '4px 4px 0 rgba(255, 190, 11, 0.3)' }}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px]">PROGRESS</span>
            </button>
          )}
        </motion.div>

        {/* Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <PixelCharacter 
            message="Choose your first challenge!"
            speaking={true}
          />
        </motion.div>

        {/* Levels Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <LevelCard
                level={level}
                onClick={() => handleLevelSelect(level.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 bg-retro-purple border-4 border-retro-cyan p-6 text-center"
          style={{ boxShadow: '6px 6px 0 rgba(0, 217, 255, 0.3)' }}
        >
          <h3 className="text-retro-cyan text-[10px] mb-4">HOW TO PLAY</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[8px] text-white leading-relaxed">
            <div>
              <div className="text-retro-green mb-2">STEP 1</div>
              Complete tasks by showing hand gestures or drawing in the air
            </div>
            <div>
              <div className="text-retro-green mb-2">STEP 2</div>
              Earn points for correct answers to unlock new levels
            </div>
            <div>
              <div className="text-retro-green mb-2">STEP 3</div>
              Master all skills to become a learning champion!
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
