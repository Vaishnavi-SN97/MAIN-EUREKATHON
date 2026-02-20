import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PixelCharacterProps {
  message?: string;
  speaking?: boolean;
}

export function PixelCharacter({ message, speaking }: PixelCharacterProps) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (message && speaking) {
      setShowBubble(true);
    } else {
      const timer = setTimeout(() => setShowBubble(false), 300);
      return () => clearTimeout(timer);
    }
  }, [message, speaking]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <AnimatePresence>
        {showBubble && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="relative bg-white border-4 border-retro-green p-4 max-w-xs"
            style={{ boxShadow: '4px 4px 0 #00ff88' }}
          >
            <div className="text-retro-bg text-[10px] leading-relaxed">
              {message}
            </div>
            <div
              className="absolute -bottom-3 left-8 w-0 h-0"
              style={{
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '12px solid #00ff88'
              }}
            />
            <div
              className="absolute -bottom-2 left-8 w-0 h-0"
              style={{
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '12px solid white'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={speaking ? {
          y: [0, -8, 0]
        } : {
          y: [0, -4, 0]
        }}
        transition={{
          duration: speaking ? 0.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="relative"
      >
        <PixelBoy />
      </motion.div>
    </div>
  );
}

function PixelBoy() {
  return (
    <svg width="64" height="64" viewBox="0 0 16 16" className="w-16 h-16" style={{ imageRendering: 'pixelated' }}>
      {/* Body */}
      <rect x="5" y="8" width="6" height="6" fill="#00d9ff" />
      
      {/* Head */}
      <rect x="4" y="2" width="8" height="6" fill="#ffbe0b" />
      
      {/* Hair */}
      <rect x="4" y="2" width="8" height="2" fill="#8b4513" />
      
      {/* Eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#000" />
      <rect x="9" y="4" width="1" height="1" fill="#000" />
      
      {/* Mouth */}
      <rect x="7" y="6" width="2" height="1" fill="#000" />
      
      {/* Arms */}
      <rect x="3" y="9" width="2" height="3" fill="#ffbe0b" />
      <rect x="11" y="9" width="2" height="3" fill="#ffbe0b" />
      
      {/* Legs */}
      <rect x="6" y="14" width="2" height="2" fill="#16213e" />
      <rect x="8" y="14" width="2" height="2" fill="#16213e" />
    </svg>
  );
}
