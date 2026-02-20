import { useState } from 'react';
import { motion } from 'motion/react';
import { PixelCharacter } from '../components/PixelCharacter';
import { Level, Mistake, LevelId } from '../utils/game';
import { SoundManager } from '../utils/sound';
import { Play, ChevronLeft } from 'lucide-react';

interface ProgressHubProps {
  score: number;
  levels: Level[];
  mistakes: Mistake[];
  onBack: () => void;
}

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  youtubeId: string;
}

export function ProgressHub({ score, levels, mistakes, onBack }: ProgressHubProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Educational videos from approved channels
  const educationalVideos: Video[] = [
    {
      id: '1',
      title: 'Math Basics: Numbers 1-10',
      channel: 'Khan Academy Kids',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '5:20',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Fun with Addition',
      channel: 'CoComelon',
      thumbnail: 'https://img.youtube.com/vi/K4TOrx_VV6M/maxresdefault.jpg',
      duration: '3:45',
      youtubeId: 'K4TOrx_VV6M'
    },
    {
      id: '3',
      title: 'Shapes Around Us',
      channel: 'Sesame Street',
      thumbnail: 'https://img.youtube.com/vi/GYcUlp6zTEU/maxresdefault.jpg',
      duration: '4:15',
      youtubeId: 'GYcUlp6zTEU'
    },
    {
      id: '4',
      title: 'Counting Song 1-20',
      channel: 'Super Simple Songs',
      thumbnail: 'https://img.youtube.com/vi/SyzkWaJ6V-Q/maxresdefault.jpg',
      duration: '3:30',
      youtubeId: 'SyzkWaJ6V-Q'
    },
  ];

  // Calculate weekly stats
  const completedLevelsThisWeek = levels.filter(l => l.completed).length;
  const mistakesThisWeek = mistakes.length;
  const accuracyPercentage = score > 0 
    ? Math.round((score / (score + mistakesThisWeek * 5)) * 100) 
    : 100;

  // Get last 5 mistakes
  const recentMistakes = mistakes.slice(-5).reverse();

  const getLevelLabel = (type: LevelId): string => {
    const levelMap: Record<LevelId, string> = {
      counting: 'Counting',
      addition: 'Addition',
      subtraction: 'Subtraction',
      shapes: 'Shapes'
    };
    return levelMap[type];
  };

  const handleBack = () => {
    SoundManager.playClick();
    onBack();
  };

  const handleVideoClick = (video: Video) => {
    SoundManager.playClick();
    setSelectedVideo(video);
  };

  const getMistakeSessionLabel = (timestamp: number, index: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `Session ${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-retro-bg p-8 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-retro-cyan"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-retro-purple text-retro-cyan px-4 py-2 border-4 border-retro-cyan hover:bg-retro-cyan hover:text-retro-bg transition-colors"
            style={{ boxShadow: '4px 4px 0 rgba(0, 217, 255, 0.3)' }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[10px]">BACK</span>
          </button>
          
          <h1 className="text-retro-green text-[24px] pixel-shadow">
            PROGRESS HUB
          </h1>
          
          <div className="w-16" />
        </motion.div>

        {/* Character greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <PixelCharacter 
            message="Here's your learning progress!"
            speaking={true}
          />
        </motion.div>

        {/* Main content grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Weekly Progress Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-retro-purple border-4 border-retro-cyan p-6"
            style={{ boxShadow: '6px 6px 0 rgba(0, 217, 255, 0.3)' }}
          >
            <h2 className="text-retro-cyan text-[14px] mb-6">WEEKLY PROGRESS</h2>
            
            <div className="space-y-6">
              {/* Points */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] text-retro-green">TOTAL POINTS</span>
                  <span className="text-[10px] text-retro-yellow">{score}</span>
                </div>
                <div className="bg-retro-bg border-2 border-retro-green h-6 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((score / 500) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-retro-green h-full flex items-center justify-end pr-2"
                  >
                    {score > 25 && <span className="text-[8px] text-retro-bg font-bold">{Math.min((score / 500) * 100, 100).toFixed(0)}%</span>}
                  </motion.div>
                </div>
              </div>

              {/* Levels Completed */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] text-retro-cyan">LEVELS COMPLETED</span>
                  <span className="text-[10px] text-retro-pink">{completedLevelsThisWeek}/4</span>
                </div>
                <div className="bg-retro-bg border-2 border-retro-cyan h-6 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedLevelsThisWeek / 4) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-retro-cyan h-full"
                  />
                </div>
              </div>

              {/* Accuracy */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] text-retro-yellow">ACCURACY</span>
                  <span className="text-[10px] text-retro-green">{accuracyPercentage}%</span>
                </div>
                <div className="bg-retro-bg border-2 border-retro-yellow h-6 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracyPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-retro-yellow h-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-retro-blue border-4 border-retro-green p-6"
            style={{ boxShadow: '6px 6px 0 rgba(0, 255, 136, 0.3)' }}
          >
            <h3 className="text-retro-green text-[12px] mb-4">STATS</h3>
            
            <div className="space-y-4">
              <div className="bg-retro-bg border-2 border-retro-green p-3">
                <div className="text-[8px] text-retro-cyan mb-1">Current Score</div>
                <div className="text-[16px] text-retro-yellow font-bold">{score}</div>
              </div>

              <div className="bg-retro-bg border-2 border-retro-cyan p-3">
                <div className="text-[8px] text-retro-green mb-1">Levels Unlocked</div>
                <div className="text-[16px] text-retro-cyan font-bold">
                  {levels.filter(l => l.unlocked).length}/4
                </div>
              </div>

              <div className="bg-retro-bg border-2 border-retro-pink p-3">
                <div className="text-[8px] text-retro-yellow mb-1">Mistakes Today</div>
                <div className="text-[16px] text-retro-pink font-bold">{mistakesThisWeek}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Educational Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-retro-purple border-4 border-retro-pink p-6 mb-8"
          style={{ boxShadow: '6px 6px 0 rgba(255, 0, 110, 0.2)' }}
        >
          <h2 className="text-retro-pink text-[14px] mb-6">EDUCATIONAL VIDEOS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {educationalVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                onClick={() => handleVideoClick(video)}
                className="cursor-pointer group"
              >
                <div
                  className="bg-retro-blue border-4 border-retro-green p-3 hover:border-retro-cyan transition-colors h-full flex flex-col"
                  style={{ boxShadow: '4px 4px 0 rgba(0, 255, 136, 0.2)' }}
                >
                  {/* Thumbnail */}
                  <div className="relative mb-3 bg-retro-bg border-2 border-retro-green aspect-video flex items-center justify-center overflow-hidden group-hover:border-retro-cyan transition-colors">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="absolute"
                    >
                      <Play className="w-8 h-8 text-retro-pink fill-retro-pink" />
                    </motion.div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-[9px] text-white leading-tight mb-2 font-bold">
                      {video.title}
                    </h3>
                    <div className="text-[7px] text-retro-cyan mb-3 flex-1">
                      {video.channel}
                    </div>
                    <div className="text-[8px] text-retro-yellow">
                      {video.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Mistakes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-retro-purple border-4 border-retro-yellow p-6"
          style={{ boxShadow: '6px 6px 0 rgba(255, 190, 11, 0.2)' }}
        >
          <h2 className="text-retro-yellow text-[14px] mb-4">PAST MISTAKES (Last 5)</h2>
          
          {recentMistakes.length === 0 ? (
            <div className="bg-retro-bg border-2 border-retro-green p-4 text-center">
              <p className="text-[10px] text-retro-green">
                ✨ No mistakes yet! Keep up the great work! ✨
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {recentMistakes.map((mistake, index) => (
                <motion.div
                  key={mistake.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  className="bg-retro-blue border-2 border-retro-pink p-3 hover:border-retro-cyan transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-retro-pink font-bold mb-1">
                        {getLevelLabel(mistake.type)}
                      </div>
                      <div className="text-[9px] text-white leading-tight break-words mb-1">
                        Question: {mistake.question}
                      </div>
                    </div>
                    <div className="text-[8px] text-retro-cyan whitespace-nowrap">
                      {getMistakeSessionLabel(mistake.timestamp, index)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-retro-purple border-4 border-retro-green p-6 max-w-2xl w-full"
            style={{ boxShadow: '8px 8px 0 rgba(0, 255, 136, 0.3)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-retro-green text-[14px]">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-retro-pink text-[18px] hover:text-retro-cyan"
              >
                ✕
              </button>
            </div>

            <div className="bg-retro-bg border-4 border-retro-cyan mb-4 aspect-video flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-retro-cyan">
                <span className="text-retro-green font-bold">Channel:</span> {selectedVideo.channel}
              </p>
              <p className="text-[10px] text-retro-yellow">
                <span className="text-retro-green font-bold">Duration:</span> {selectedVideo.duration}
              </p>
            </div>

            <button
              onClick={() => setSelectedVideo(null)}
              className="mt-6 w-full bg-retro-green text-retro-bg px-4 py-3 border-4 border-retro-green hover:bg-retro-cyan hover:border-retro-cyan transition-colors text-[10px]"
              style={{ boxShadow: '4px 4px 0 rgba(0, 255, 136, 0.3)' }}
            >
              CLOSE
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
