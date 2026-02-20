import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsButtonProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function SettingsButton({ soundEnabled, onToggleSound }: SettingsButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggleSound}
      className="fixed top-4 right-4 z-50 bg-retro-purple border-2 border-retro-cyan p-3 hover:bg-retro-blue transition-colors"
      style={{ boxShadow: '4px 4px 0 rgba(0, 217, 255, 0.3)' }}
      title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
    >
      {soundEnabled ? (
        <Volume2 className="w-5 h-5 text-retro-cyan" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      )}
    </motion.button>
  );
}
