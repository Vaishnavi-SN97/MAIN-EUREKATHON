import { Camera, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraPermissionProps {
  onRetry: () => void;
}

export function CameraPermission({ onRetry }: CameraPermissionProps) {
  return (
    <div className="absolute inset-0 bg-retro-bg/95 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-retro-purple border-4 border-retro-pink p-8 max-w-md"
        style={{ boxShadow: '8px 8px 0 rgba(255, 0, 110, 0.5)' }}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <Camera className="w-16 h-16 text-retro-cyan" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute inset-0 bg-retro-cyan rounded-full blur-xl"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-retro-pink">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-[12px]">Camera Access Needed</h3>
            </div>

            <p className="text-[8px] text-white leading-relaxed">
              This game uses your webcam to detect hand gestures. 
              Please allow camera access to continue playing.
            </p>

            <div className="text-[8px] text-muted-foreground leading-relaxed">
              Your privacy is protected - all processing happens on your device. 
              No video is recorded or transmitted.
            </div>
          </div>

          <button
            onClick={onRetry}
            className="bg-retro-cyan text-retro-bg px-8 py-3 border-4 border-retro-cyan hover:bg-retro-green hover:border-retro-green transition-colors"
            style={{ boxShadow: '4px 4px 0 rgba(0, 217, 255, 0.5)' }}
          >
            <span className="text-[10px]">ALLOW CAMERA</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-retro-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="w-16 h-16 mx-auto border-4 border-retro-green border-t-transparent"
        />
        <div className="text-retro-green text-[10px]">
          Loading Hand Tracking...
        </div>
        <div className="text-[8px] text-muted-foreground">
          This may take a moment
        </div>
      </div>
    </div>
  );
}
