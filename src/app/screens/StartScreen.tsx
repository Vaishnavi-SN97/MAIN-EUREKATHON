import { motion } from 'motion/react';
import { PixelCharacter } from '../components/PixelCharacter';
import { SoundManager, VoiceManager } from '../utils/sound';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const handleStart = () => {
    SoundManager.playClick();
    VoiceManager.speak("Let's begin your learning adventure!");
    setTimeout(() => {
      onStart();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-retro-bg flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-retro-green"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-2xl w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-retro-green text-[24px] mb-4 pixel-shadow">
            ADAPTIVE
          </h1>
          <h1 className="text-retro-cyan text-[24px] mb-2 pixel-shadow">
            LEARNING
          </h1>
          <h1 className="text-retro-pink text-[20px] pixel-shadow">
            QUEST
          </h1>
          <div className="mt-6 text-retro-yellow text-[8px]">
            Gesture-Driven Education System
          </div>
        </motion.div>

        {/* Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <PixelCharacter 
            message="Hey there! Ready to level up your learning?"
            speaking={true}
          />
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStart}
          className="bg-retro-green text-retro-bg px-12 py-4 border-4 border-retro-green hover:bg-retro-cyan hover:border-retro-cyan transition-colors"
          style={{ boxShadow: '8px 8px 0 rgba(0, 255, 136, 0.5)' }}
        >
          <span className="text-[14px]">START GAME</span>
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="grid grid-cols-3 gap-4 w-full mt-8"
        >
          {[
            { icon: '👋', text: 'Hand Gestures' },
            { icon: '✏️', text: 'Air Drawing' },
            { icon: '🎮', text: 'Game Levels' }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-retro-purple border-2 border-retro-cyan p-4 text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-[8px] text-retro-cyan">{feature.text}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
