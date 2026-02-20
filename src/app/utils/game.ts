// Types for the game
export type GameScreen = 'start' | 'level-select' | 'gameplay' | 'level-complete' | 'progress';

export type LevelId = 'counting' | 'addition' | 'subtraction' | 'shapes';

export interface Level {
  id: LevelId;
  name: string;
  unlocked: boolean;
  completed: boolean;
  requiredScore: number;
}

export interface Task {
  id: string;
  type: 'gesture' | 'drawing';
  question: string;
  answer: string | number;
  instruction: string;
}

export interface Mistake {
  id: string;
  type: LevelId;
  question: string;
  timestamp: number;
  sessionLabel: string;
}

export interface GameState {
  currentScreen: GameScreen;
  currentLevel: LevelId | null;
  score: number;
  lives: number;
  levels: Level[];
  currentTaskIndex: number;
  completedTasks: number;
  mistakes: Mistake[];
}

export interface KnowledgeNode {
  id: LevelId;
  label: string;
  status: 'locked' | 'current' | 'mastered';
  x: number;
  y: number;
  connections: LevelId[];
}

// Storage utility
export const StorageManager = {
  save(state: GameState) {
    try {
      localStorage.setItem('adaptive-learning-state', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  },

  load(): GameState | null {
    try {
      const data = localStorage.getItem('adaptive-learning-state');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load state:', e);
      return null;
    }
  },

  clear() {
    localStorage.removeItem('adaptive-learning-state');
  }
};

// Initial game state
export const initialGameState: GameState = {
  currentScreen: 'start',
  currentLevel: null,
  score: 0,
  lives: 3,
  currentTaskIndex: 0,
  completedTasks: 0,
  mistakes: [],
  levels: [
    {
      id: 'counting',
      name: 'Level 1 - Counting',
      unlocked: true,
      completed: false,
      requiredScore: 0
    },
    {
      id: 'addition',
      name: 'Level 2 - Addition',
      unlocked: false,
      completed: false,
      requiredScore: 50
    },
    {
      id: 'subtraction',
      name: 'Level 3 - Subtraction',
      unlocked: false,
      completed: false,
      requiredScore: 100
    },
    {
      id: 'shapes',
      name: 'Level 4 - Shapes',
      unlocked: false,
      completed: false,
      requiredScore: 150
    }
  ]
};

// Task generators
export const generateTasks = (levelId: LevelId): Task[] => {
  switch (levelId) {
    case 'counting':
      return [
        {
          id: '1',
          type: 'gesture',
          question: 'Show me 3 fingers',
          answer: 3,
          instruction: 'Hold up 3 fingers'
        },
        {
          id: '2',
          type: 'gesture',
          question: 'Show me 5 fingers',
          answer: 5,
          instruction: 'Hold up 5 fingers'
        },
        {
          id: '3',
          type: 'gesture',
          question: 'Show me 2 fingers',
          answer: 2,
          instruction: 'Hold up 2 fingers'
        },
        {
          id: '4',
          type: 'gesture',
          question: 'Show me 4 fingers',
          answer: 4,
          instruction: 'Hold up 4 fingers'
        },
        {
          id: '5',
          type: 'gesture',
          question: 'Show me 1 finger',
          answer: 1,
          instruction: 'Hold up 1 finger'
        }
      ];
    
    case 'addition':
      return [
        {
          id: '1',
          type: 'gesture',
          question: '2 + 1 = ?',
          answer: 3,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '2',
          type: 'gesture',
          question: '3 + 2 = ?',
          answer: 5,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '3',
          type: 'gesture',
          question: '1 + 1 = ?',
          answer: 2,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '4',
          type: 'gesture',
          question: '2 + 2 = ?',
          answer: 4,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '5',
          type: 'gesture',
          question: '1 + 3 = ?',
          answer: 4,
          instruction: 'Show the answer with fingers'
        }
      ];
    
    case 'subtraction':
      return [
        {
          id: '1',
          type: 'gesture',
          question: '5 - 2 = ?',
          answer: 3,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '2',
          type: 'gesture',
          question: '4 - 1 = ?',
          answer: 3,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '3',
          type: 'gesture',
          question: '3 - 1 = ?',
          answer: 2,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '4',
          type: 'gesture',
          question: '5 - 1 = ?',
          answer: 4,
          instruction: 'Show the answer with fingers'
        },
        {
          id: '5',
          type: 'gesture',
          question: '4 - 3 = ?',
          answer: 1,
          instruction: 'Show the answer with fingers'
        }
      ];
    
    case 'shapes':
      return [
        {
          id: '1',
          type: 'drawing',
          question: 'Draw a circle',
          answer: 'circle',
          instruction: 'Draw a circle in the air'
        },
        {
          id: '2',
          type: 'drawing',
          question: 'Draw a triangle',
          answer: 'triangle',
          instruction: 'Draw a triangle in the air'
        },
        {
          id: '3',
          type: 'drawing',
          question: 'Draw a square',
          answer: 'square',
          instruction: 'Draw a square in the air'
        },
        {
          id: '4',
          type: 'drawing',
          question: 'Draw a circle',
          answer: 'circle',
          instruction: 'Draw a circle in the air'
        },
        {
          id: '5',
          type: 'drawing',
          question: 'Draw a triangle',
          answer: 'triangle',
          instruction: 'Draw a triangle in the air'
        }
      ];
    
    default:
      return [];
  }
};
