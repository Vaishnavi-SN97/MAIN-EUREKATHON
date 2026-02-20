import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { Level } from '../utils/game';

interface LevelCardProps {
  level: Level;
  onClick: () => void;
}

export function LevelCard({ level, onClick }: LevelCardProps) {
  return (
    <motion.button
      whileHover={level.unlocked ? { scale: 1.05 } : {}}
      whileTap={level.unlocked ? { scale: 0.95 } : {}}
      onClick={level.unlocked ? onClick : undefined}
      disabled={!level.unlocked}
      className={`
        relative p-6 border-4 transition-all
        ${level.unlocked 
          ? 'bg-retro-purple border-retro-green cursor-pointer hover:border-retro-cyan' 
          : 'bg-retro-blue/30 border-muted-foreground/30 cursor-not-allowed opacity-50'
        }
        ${level.completed ? 'border-retro-yellow' : ''}
      `}
      style={{
        boxShadow: level.unlocked ? '6px 6px 0 rgba(0, 255, 136, 0.3)' : 'none'
      }}
    >
      {!level.unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      
      {level.completed && (
        <div className="absolute top-2 right-2 text-retro-yellow text-xl">
          ★
        </div>
      )}

      <div className="text-left space-y-3">
        <h3 className={`text-[12px] ${level.unlocked ? 'text-retro-green' : 'text-muted-foreground'}`}>
          {level.name}
        </h3>
        <div className="text-[8px] text-retro-cyan">
          Score needed: {level.requiredScore}
        </div>
      </div>
    </motion.button>
  );
}
