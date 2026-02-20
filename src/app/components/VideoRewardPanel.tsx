import { motion } from 'motion/react';
import { Youtube } from 'lucide-react';

interface VideoRewardPanelProps {
  show: boolean;
  isCorrect: boolean;
}

export function VideoRewardPanel({ show, isCorrect }: VideoRewardPanelProps) {
  if (!show) return null;

  // Mock educational videos
  const videos = isCorrect ? [
    {
      id: '1',
      title: 'Great Job! Learn More About Numbers',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: '3:45'
    }
  ] : [
    {
      id: '1',
      title: "Don't Give Up! Practice Makes Perfect",
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: '2:30'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-retro-purple border-4 border-retro-cyan p-4 mt-4"
      style={{ boxShadow: '6px 6px 0 rgba(0, 217, 255, 0.3)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Youtube className="w-4 h-4 text-retro-pink" />
        <h3 className="text-[10px] text-retro-cyan">
          {isCorrect ? 'REWARD VIDEO!' : 'LEARNING RESOURCE'}
        </h3>
      </div>

      <div className="grid gap-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-retro-blue border-2 border-retro-green p-3 cursor-pointer hover:border-retro-cyan transition-colors"
          >
            <div className="flex gap-3">
              <div className="w-24 h-16 bg-retro-bg border-2 border-retro-green flex items-center justify-center flex-shrink-0">
                <Youtube className="w-8 h-8 text-retro-pink" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] text-white leading-relaxed mb-2">
                  {video.title}
                </div>
                <div className="text-[8px] text-retro-cyan">
                  Duration: {video.duration}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[8px] text-muted-foreground mt-3 text-center">
        Mock YouTube integration - Educational content
      </div>
    </motion.div>
  );
}
