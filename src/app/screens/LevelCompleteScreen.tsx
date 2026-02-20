import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { PixelCharacter } from '../components/PixelCharacter';
import { SoundManager, VoiceManager } from '../utils/sound';
import { useEffect } from 'react';

interface LevelCompleteScreenProps {
  levelName: string;
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  onContinue: () => void;
}

export function LevelCompleteScreen({
  levelName,
  score,
  tasksCompleted,
  totalTasks,
  onContinue
}: LevelCompleteScreenProps) {
  useEffect(() => {
    SoundManager.playLevelUp();
    VoiceManager.speak('Level up! You are on fire!');
  }, []);

  const handleContinue = () => {
    SoundManager.playClick();
    onContinue();
  };

  return (
    <div className="min-h-screen bg-retro-bg flex items-center justify-center p-8 relative overflow-hidden">
      {/* Confetti effect */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              background: ['#00ff88', '#00d9ff', '#ff006e', '#ffbe0b'][Math.floor(Math.random() * 4)]
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-retro-purple border-4 border-retro-green p-12 max-w-2xl w-full"
        style={{ boxShadow: '12px 12px 0 rgba(0, 255, 136, 0.5)' }}
      >
        {/* Trophy */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Trophy className="w-24 h-24 text-retro-yellow" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-retro-yellow rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-retro-green text-[20px]">LEVEL COMPLETE!</h1>
          <div className="text-retro-cyan text-[12px]">{levelName}</div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-retro-bg border-4 border-retro-cyan p-6 text-center">
            <div className="text-[8px] text-muted-foreground mb-2">SCORE</div>
            <div className="text-retro-green text-[24px]">{score}</div>
          </div>
          <div className="bg-retro-bg border-4 border-retro-cyan p-6 text-center">
            <div className="text-[8px] text-muted-foreground mb-2">TASKS</div>
            <div className="text-retro-green text-[24px]">
              {tasksCompleted}/{totalTasks}
            </div>
          </div>
        </motion.div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center gap-4 mb-8"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1 + i * 0.2, type: 'spring' }}
            >
              <Star className="w-12 h-12 text-retro-yellow fill-retro-yellow" />
            </motion.div>
          ))}
        </motion.div>

        {/* Character */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center mb-8"
        >
          <PixelCharacter
            message="Level up! You're on fire!"
            speaking={true}
          />
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            className="bg-retro-green text-retro-bg px-8 py-4 border-4 border-retro-green hover:bg-retro-cyan hover:border-retro-cyan transition-colors flex items-center gap-3"
            style={{ boxShadow: '6px 6px 0 rgba(0, 255, 136, 0.5)' }}
          >
            <span className="text-[12px]">CONTINUE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
