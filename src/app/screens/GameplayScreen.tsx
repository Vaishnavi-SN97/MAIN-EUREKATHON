import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trophy, ArrowLeft } from 'lucide-react';
import { useHandTracking } from '../hooks/useHandTracking';
import { Task, LevelId } from '../utils/game';
import { ShapeDetector, Point } from '../utils/shapeDetector';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import { VideoRewardPanel } from '../components/VideoRewardPanel';
import { PixelCharacter } from '../components/PixelCharacter';
import { CameraPermission, LoadingScreen } from '../components/CameraPermission';
import { SoundManager, VoiceManager } from '../utils/sound';

interface GameplayScreenProps {
  levelId: LevelId;
  tasks: Task[];
  currentTaskIndex: number;
  score: number;
  lives: number;
  completedLevels: LevelId[];
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}

export function GameplayScreen({
  levelId,
  tasks,
  currentTaskIndex,
  score,
  lives,
  completedLevels,
  onCorrect,
  onWrong,
  onBack
}: GameplayScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [characterMessage, setCharacterMessage] = useState('');
  const [characterSpeaking, setCharacterSpeaking] = useState(false);
  const [drawingPath, setDrawingPath] = useState<Point[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const lastAnswerCheckRef = useRef<number>(0);
  const drawingTimeoutRef = useRef<NodeJS.Timeout>();

  const { fingerCount, indexFingerTip, isDrawing, isReady, landmarks } = useHandTracking(videoRef);

  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    async function setupCamera() {
      setCameraLoading(true);
      setCameraError(false);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setCameraLoading(false);
      } catch (error) {
        console.error('Camera access error:', error);
        setCameraError(true);
        setCameraLoading(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (currentTask) {
      setCharacterMessage(currentTask.instruction);
      setCharacterSpeaking(true);
      VoiceManager.speak(currentTask.instruction);
      
      const timer = setTimeout(() => {
        setCharacterSpeaking(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentTask]);

  // Handle gesture recognition
  useEffect(() => {
    if (!currentTask || currentTask.type !== 'gesture' || !isReady) return;

    const now = Date.now();
    if (now - lastAnswerCheckRef.current < 2000) return;

    if (fingerCount > 0 && fingerCount === currentTask.answer) {
      lastAnswerCheckRef.current = now;
      handleCorrectAnswer();
    }
  }, [fingerCount, currentTask, isReady]);

  // Handle drawing
  useEffect(() => {
    if (!currentTask || currentTask.type !== 'drawing' || !indexFingerTip || !isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = indexFingerTip.x * rect.width;
    const y = indexFingerTip.y * rect.height;

    setDrawingPath(prev => [...prev, { x, y }]);

    // Clear timeout and set new one
    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
    }

    drawingTimeoutRef.current = setTimeout(() => {
      if (drawingPath.length > 20) {
        detectDrawnShape();
      }
    }, 1500);
  }, [indexFingerTip, isDrawing, currentTask]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks
    if (landmarks && landmarks.length > 0) {
      const landmarkSet = landmarks[0];
      
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;

      // Draw connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
      ];

      connections.forEach(([start, end]) => {
        const startPoint = landmarkSet[start];
        const endPoint = landmarkSet[end];
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
        ctx.stroke();
      });

      // Draw points
      ctx.fillStyle = '#00ff88';
      landmarkSet.forEach((landmark: any) => {
        ctx.beginPath();
        ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw path
    if (drawingPath.length > 1) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(drawingPath[0].x, drawingPath[0].y);
      
      for (let i = 1; i < drawingPath.length; i++) {
        ctx.lineTo(drawingPath[i].x, drawingPath[i].y);
      }
      
      ctx.stroke();
    }
  }, [landmarks, drawingPath]);

  const detectDrawnShape = () => {
    if (isDetecting || drawingPath.length < 20) return;

    setIsDetecting(true);
    const detectedShape = ShapeDetector.detectShape(drawingPath);

    if (detectedShape === currentTask.answer) {
      handleCorrectAnswer();
    } else {
      setDrawingPath([]);
      setIsDetecting(false);
    }
  };

  const handleCorrectAnswer = () => {
    setFeedback('correct');
    SoundManager.playCoin();
    setCharacterMessage('Awesome! You nailed it!');
    setCharacterSpeaking(true);
    VoiceManager.speak('Awesome! You nailed it!');
    
    setTimeout(() => {
      setFeedback(null);
      setCharacterSpeaking(false);
      setDrawingPath([]);
      setIsDetecting(false);
      onCorrect();
    }, 2000);
  };

  const handleWrongAnswer = () => {
    setFeedback('wrong');
    SoundManager.playFail();
    setCharacterMessage("Nice try! You've got this!");
    setCharacterSpeaking(true);
    VoiceManager.speak("Nice try! You've got this!");
    setShowReward(true);
    
    setTimeout(() => {
      setFeedback(null);
      setCharacterSpeaking(false);
      setShowReward(false);
      setDrawingPath([]);
      setIsDetecting(false);
      onWrong();
    }, 3000);
  };

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <div className="text-retro-green text-[14px]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      {cameraLoading && <LoadingScreen />}
      {cameraError && !cameraLoading && (
        <CameraPermission onRetry={() => window.location.reload()} />
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="bg-retro-purple border-2 border-retro-cyan p-2 hover:bg-retro-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-retro-cyan" />
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-retro-yellow" />
              <span className="text-retro-green text-[12px]">{score}</span>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${i < lives ? 'text-retro-pink fill-retro-pink' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel - Score & Progress */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-retro-purple border-4 border-retro-green p-4">
              <h3 className="text-retro-cyan text-[10px] mb-4">PROGRESS</h3>
              <div className="space-y-2">
                <div className="text-[8px] text-white">
                  Task {currentTaskIndex + 1} / {tasks.length}
                </div>
                <div className="w-full bg-retro-bg border-2 border-retro-green h-6">
                  <motion.div
                    className="h-full bg-retro-green"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentTaskIndex + 1) / tasks.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-retro-purple border-4 border-retro-green p-4">
              <PixelCharacter message={characterMessage} speaking={characterSpeaking} />
            </div>
          </div>

          {/* Center Panel - Webcam & Task */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-retro-purple border-4 border-retro-cyan p-4 relative">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`absolute inset-0 z-20 flex items-center justify-center ${
                      feedback === 'correct' ? 'bg-retro-green/20' : 'bg-retro-pink/20'
                    }`}
                  >
                    <div className={`text-[32px] ${
                      feedback === 'correct' ? 'text-retro-green' : 'text-retro-pink'
                    }`}>
                      {feedback === 'correct' ? '✓' : '✗'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative aspect-video bg-retro-bg border-4 border-retro-green overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="absolute inset-0 w-full h-full scale-x-[-1]"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div className="bg-retro-bg border-2 border-retro-green p-3">
                  <div className="text-retro-yellow text-[12px] mb-2">
                    {currentTask.question}
                  </div>
                  <div className="text-retro-cyan text-[8px]">
                    {currentTask.instruction}
                  </div>
                </div>

                {currentTask.type === 'gesture' && (
                  <div className="bg-retro-bg border-2 border-retro-cyan p-3 text-center">
                    <div className="text-[8px] text-muted-foreground mb-1">
                      Detected Fingers
                    </div>
                    <div className="text-retro-cyan text-[20px]">
                      {fingerCount}
                    </div>
                  </div>
                )}

                {currentTask.type === 'drawing' && drawingPath.length > 0 && (
                  <div className="bg-retro-bg border-2 border-retro-cyan p-3 text-center">
                    <div className="text-[8px] text-retro-cyan">
                      Drawing detected: {drawingPath.length} points
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showReward && (
              <VideoRewardPanel show={showReward} isCorrect={feedback === 'correct'} />
            )}
          </div>

          {/* Right Panel - Knowledge Graph */}
          <div className="lg:col-span-3">
            <div className="h-96">
              <KnowledgeGraph
                currentLevel={levelId}
                completedLevels={completedLevels}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}