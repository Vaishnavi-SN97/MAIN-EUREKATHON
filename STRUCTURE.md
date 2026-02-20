# Project Structure

## 📁 File Organization

```
/src
├── /app
│   ├── App.tsx                          # Main app with game state management
│   │
│   ├── /components                       # Reusable UI components
│   │   ├── CameraPermission.tsx         # Camera access UI & loading
│   │   ├── KnowledgeGraph.tsx           # Skill tree visualization
│   │   ├── LevelCard.tsx                # Level selection card
│   │   ├── PixelCharacter.tsx           # Animated guide character
│   │   ├── SettingsButton.tsx           # Sound toggle control
│   │   └── VideoRewardPanel.tsx         # Educational video display
│   │
│   ├── /screens                          # Full-page game screens
│   │   ├── StartScreen.tsx              # Landing page with intro
│   │   ├── LevelSelectionScreen.tsx     # Level picker menu
│   │   ├── GameplayScreen.tsx           # Main game with webcam
│   │   └── LevelCompleteScreen.tsx      # Victory celebration
│   │
│   ├── /hooks                            # Custom React hooks
│   │   └── useHandTracking.ts           # MediaPipe hand detection
│   │
│   └── /utils                            # Core game logic & utilities
│       ├── game.ts                      # Game state, levels, tasks
│       ├── shapeDetector.ts             # Air drawing recognition
│       └── sound.ts                     # Audio & voice synthesis
│
└── /styles
    ├── fonts.css                        # Press Start 2P import
    ├── theme.css                        # Retro color system
    ├── tailwind.css                     # Tailwind base
    └── index.css                        # Unified imports
```

## 🎯 Component Hierarchy

```
App
├── StartScreen
│   └── PixelCharacter
│
├── LevelSelectionScreen
│   ├── PixelCharacter
│   └── LevelCard (×4)
│
├── GameplayScreen
│   ├── CameraPermission (conditional)
│   ├── LoadingScreen (conditional)
│   ├── PixelCharacter
│   ├── KnowledgeGraph
│   ├── VideoRewardPanel (conditional)
│   └── [Webcam + Canvas overlay]
│
└── LevelCompleteScreen
    └── PixelCharacter
```

## 🔧 Key Systems

### 1. Hand Tracking System
**File**: `hooks/useHandTracking.ts`

- Initializes MediaPipe hand detection
- Processes video frames at 10 FPS
- Counts extended fingers
- Tracks index finger tip position
- Detects drawing gestures

**Dependencies**: @mediapipe/tasks-vision

### 2. Shape Detection System
**File**: `utils/shapeDetector.ts`

- Normalizes drawn points
- Analyzes path closure
- Detects corners via angle changes
- Calculates circularity
- Classifies shapes (circle/triangle/square)

**Algorithm**: Geometric analysis with smoothing

### 3. Game State Management
**File**: `utils/game.ts`

- Manages progression through levels
- Generates tasks dynamically
- Handles scoring & unlocking
- LocalStorage persistence
- Level completion tracking

**State**: React useState + localStorage

### 4. Sound & Voice System
**File**: `utils/sound.ts`

- Web Audio API for retro sounds
- Speech Synthesis for character voice
- Non-overlapping sound playback
- Event-based triggering

**Audio**: Procedurally generated tones

## 🎨 Design System

### Colors
```css
--retro-bg: #1a0a2e          Deep purple
--retro-purple: #16213e      Card background
--retro-blue: #0f3460        Muted UI
--retro-cyan: #00d9ff        Secondary
--retro-green: #00ff88       Primary
--retro-pink: #ff006e        Errors
--retro-yellow: #ffbe0b      Success
```

### Typography
- **Font**: Press Start 2P
- **Sizes**: 8px, 10px, 12px, 14px, 20px, 24px
- **Weight**: 400 (normal for pixel fonts)

### Spacing
- **Base**: 4px grid system
- **Borders**: 2px, 4px solid
- **Shadows**: 4px, 6px, 8px hard-edge
- **Radius**: 0px (no rounding)

## 📊 Data Flow

### Game Initialization
```
App mounts
  ↓
Load from localStorage
  ↓
Initialize game state
  ↓
Render StartScreen
```

### Level Play
```
Select Level
  ↓
Generate Tasks
  ↓
Initialize Camera & Hand Tracking
  ↓
Detect Gesture/Drawing
  ↓
Validate Answer
  ↓
Update Score & Progress
  ↓
Check Level Complete
  ↓
Save State
```

### Progression
```
Complete 5 Tasks
  ↓
Level Complete Screen
  ↓
Update Levels Array
  ↓
Unlock Next Level (if score met)
  ↓
Return to Level Select
```

## 🔄 State Management

### App-Level State
```typescript
{
  currentScreen: 'start' | 'level-select' | 'gameplay' | 'level-complete',
  currentLevel: LevelId | null,
  score: number,
  lives: number,
  levels: Level[],
  currentTaskIndex: number,
  completedTasks: number
}
```

### Component-Level State
- Camera stream
- Hand tracking results
- Drawing path
- Feedback animations
- Character messages

## 🎮 Game Logic

### Task Types
1. **Gesture**: Count fingers
   - Show N fingers
   - Answer math problems

2. **Drawing**: Draw shapes
   - Circle, Triangle, Square
   - Air drawing detection

### Scoring Rules
- Correct: +10 points
- Wrong: -5 points, -1 life
- Level unlock thresholds:
  - Level 2: 50 points
  - Level 3: 100 points
  - Level 4: 150 points

### Progression Logic
```typescript
if (tasksCompleted === totalTasks) {
  markLevelComplete();
  if (score >= nextLevel.requiredScore) {
    unlockNextLevel();
  }
}
```

## 🚀 Performance

### Optimizations
- Throttled hand detection (100ms)
- Canvas rendering optimized
- Debounced shape detection (1.5s)
- Minimal re-renders
- Lazy state updates

### Resource Usage
- CPU: ~10-15% (hand tracking)
- Memory: ~100MB (MediaPipe models)
- Network: CDN for MediaPipe assets
- Storage: <1KB (localStorage)

## 🔐 Security & Privacy

### Data Handling
- No server communication
- No video recording
- No external analytics
- Client-side processing only
- LocalStorage for persistence

### Permissions
- Camera: Required for gameplay
- Microphone: Not used
- Location: Not used
- Notifications: Not used

## 🧪 Testing Checklist

### Functional Tests
- [ ] Camera permission flow
- [ ] Finger counting accuracy
- [ ] Shape detection precision
- [ ] Score calculation
- [ ] Level unlocking
- [ ] Progress persistence
- [ ] Sound effects
- [ ] Voice synthesis
- [ ] Character animations

### Browser Tests
- [ ] Chrome (recommended)
- [ ] Edge
- [ ] Firefox
- [ ] Safari (limited)

### Device Tests
- [ ] Desktop webcam
- [ ] Laptop webcam
- [ ] External webcam
- [ ] Different lighting conditions

## 📝 Code Style

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- CSS: kebab-case

### File Structure
- One component per file
- Co-located types
- Utilities in /utils
- Hooks in /hooks

### Best Practices
- TypeScript strict mode
- Proper cleanup in useEffect
- Error boundaries (future)
- Accessibility considerations

## 🔮 Future Enhancements

### Planned Features
1. **Multiplayer Mode**
   - Real-time leaderboards
   - Challenge friends
   - Global rankings

2. **More Levels**
   - Multiplication
   - Division
   - Fractions
   - Advanced geometry

3. **Customization**
   - Character skins
   - Sound themes
   - Difficulty levels

4. **Social Features**
   - Share progress
   - Achievement badges
   - Weekly challenges

5. **Accessibility**
   - Keyboard mode
   - Mouse fallback
   - High contrast mode
   - Text-to-speech options

### Technical Debt
- Add comprehensive error boundaries
- Implement proper testing suite
- Optimize MediaPipe bundle size
- Add service worker for offline
- Improve shape detection accuracy

## 📚 Learning Resources

### MediaPipe
- [Hand Landmark Detection](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Web Integration Guide](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker/web_js)

### Motion (Framer Motion)
- [Animation Examples](https://motion.dev/docs)
- [Variants Guide](https://motion.dev/docs/react-variants)

### Web Audio API
- [Creating Sounds](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Oscillator Node](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode)

---

Built with React, TypeScript, Tailwind CSS, Motion, and MediaPipe.
