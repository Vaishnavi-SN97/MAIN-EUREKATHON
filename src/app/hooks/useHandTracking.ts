import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

export interface HandTrackingResult {
  fingerCount: number;
  indexFingerTip: { x: number; y: number } | null;
  isDrawing: boolean;
  landmarks: any[] | null;
}

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement>) {
  const [result, setResult] = useState<HandTrackingResult>({
    fingerCount: 0,
    indexFingerTip: null,
    isDrawing: false,
    landmarks: null
  });
  const [isReady, setIsReady] = useState(false);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number>();
  const lastDetectionTimeRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;

    async function initializeHandLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        if (mounted) {
          handLandmarkerRef.current = handLandmarker;
          setIsReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize hand tracking:', error);
      }
    }

    initializeHandLandmarker();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || !videoRef.current || !handLandmarkerRef.current) return;

    const video = videoRef.current;
    
    function detectHands() {
      if (!video || !handLandmarkerRef.current || video.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(detectHands);
        return;
      }

      const now = Date.now();
      if (now - lastDetectionTimeRef.current < 100) {
        animationFrameRef.current = requestAnimationFrame(detectHands);
        return;
      }
      lastDetectionTimeRef.current = now;

      try {
        const detections = handLandmarkerRef.current.detectForVideo(video, now);
        
        if (detections.landmarks && detections.landmarks.length > 0) {
          const landmarks = detections.landmarks[0];
          const fingerCount = countFingers(landmarks);
          const indexFingerTip = landmarks[8];
          const thumbTip = landmarks[4];
          const distance = Math.sqrt(
            Math.pow(indexFingerTip.x - thumbTip.x, 2) +
            Math.pow(indexFingerTip.y - thumbTip.y, 2)
          );
          
          setResult({
            fingerCount,
            indexFingerTip: {
              x: indexFingerTip.x,
              y: indexFingerTip.y
            },
            isDrawing: distance > 0.08,
            landmarks: detections.landmarks
          });
        } else {
          setResult({
            fingerCount: 0,
            indexFingerTip: null,
            isDrawing: false,
            landmarks: null
          });
        }
      } catch (error) {
        console.error('Hand detection error:', error);
      }

      animationFrameRef.current = requestAnimationFrame(detectHands);
    }

    detectHands();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReady, videoRef]);

  return { ...result, isReady };
}

// Count extended fingers
function countFingers(landmarks: any[]): number {
  let count = 0;

  // Thumb
  if (landmarks[4].x < landmarks[3].x) {
    count++;
  }

  // Other fingers
  const fingerTips = [8, 12, 16, 20];
  const fingerPips = [6, 10, 14, 18];

  fingerTips.forEach((tip, index) => {
    if (landmarks[tip].y < landmarks[fingerPips[index]].y) {
      count++;
    }
  });

  return count;
}
