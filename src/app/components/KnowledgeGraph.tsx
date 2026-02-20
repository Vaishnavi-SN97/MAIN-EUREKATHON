import { motion } from 'motion/react';
import { KnowledgeNode, LevelId } from '../utils/game';

interface KnowledgeGraphProps {
  currentLevel: LevelId | null;
  completedLevels: LevelId[];
}

function getNodeStatus(id: LevelId, currentLevel: LevelId | null, completedLevels: LevelId[]): 'locked' | 'current' | 'mastered' {
  if (completedLevels.includes(id)) return 'mastered';
  if (currentLevel === id) return 'current';
  return 'locked';
}

export function KnowledgeGraph({ currentLevel, completedLevels }: KnowledgeGraphProps) {
  const nodes: KnowledgeNode[] = [
    {
      id: 'counting',
      label: 'Counting',
      status: getNodeStatus('counting', currentLevel, completedLevels),
      x: 50,
      y: 20,
      connections: ['addition']
    },
    {
      id: 'addition',
      label: 'Addition',
      status: getNodeStatus('addition', currentLevel, completedLevels),
      x: 50,
      y: 40,
      connections: ['subtraction']
    },
    {
      id: 'subtraction',
      label: 'Subtraction',
      status: getNodeStatus('subtraction', currentLevel, completedLevels),
      x: 50,
      y: 60,
      connections: ['shapes']
    },
    {
      id: 'shapes',
      label: 'Shapes',
      status: getNodeStatus('shapes', currentLevel, completedLevels),
      x: 50,
      y: 80,
      connections: []
    }
  ];

  return (
    <div className="relative w-full h-full bg-retro-purple border-4 border-retro-green p-4">
      <h3 className="text-[10px] text-retro-cyan mb-4">SKILL TREE</h3>
      
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Connections */}
        {nodes.map((node) =>
          node.connections.map((connId) => {
            const connNode = nodes.find(n => n.id === connId);
            if (!connNode) return null;
            
            const isActive = node.status !== 'locked' || connNode.status !== 'locked';
            
            return (
              <line
                key={`${node.id}-${connId}`}
                x1={node.x}
                y1={node.y}
                x2={connNode.x}
                y2={connNode.y}
                stroke={isActive ? '#00ff88' : '#8892b0'}
                strokeWidth="2"
                strokeDasharray={isActive ? '0' : '4'}
              />
            );
          })
        )}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill={
                node.status === 'mastered' ? '#00ff88' :
                node.status === 'current' ? '#00d9ff' :
                '#16213e'
              }
              stroke={
                node.status === 'mastered' ? '#00ff88' :
                node.status === 'current' ? '#00d9ff' :
                '#8892b0'
              }
              strokeWidth="2"
              animate={node.status === 'current' ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <text
              x={node.x}
              y={node.y + 14}
              textAnchor="middle"
              fill={node.status === 'locked' ? '#8892b0' : '#ffffff'}
              fontSize="6"
              fontFamily="Press Start 2P"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
