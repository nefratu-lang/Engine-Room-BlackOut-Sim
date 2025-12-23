
export enum GameStage {
  INSTRUCTIONS = 'INSTRUCTIONS', // New briefing stage
  LOBBY = 'LOBBY', // New entry stage
  START = 'START',
  HOOK = 'HOOK', // Red alert, timer start
  ROOM_EXPLORATION = 'ROOM_EXPLORATION', // Find the smoke
  TERMINOLOGY = 'TERMINOLOGY', // Match component
  MANUAL_ANALYSIS = 'MANUAL_ANALYSIS', // Read PDF, enter code
  SEQUENCE = 'SEQUENCE', // Order operations
  SUCCESS = 'SUCCESS', // Certificate
  DASHBOARD = 'DASHBOARD' // Teacher view
}

export interface StudentMetrics {
  timeElapsed: number;
  mistakes: number;
  stageReached: GameStage;
  logs: string[];
}

export interface PedagogicalContext {
  tag: string;
  description: string;
}

export const SEQUENCE_STEPS = [
  { id: 'valve', label: 'Open Fuel Valve' },
  { id: 'lube', label: 'Check Lubrication Pressure' },
  { id: 'start', label: 'Start Engine (Prime Mover)' },
  { id: 'sync', label: 'Synchronize Frequency' },
  { id: 'breaker', label: 'Close Main Breaker' },
];

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Player {
  id: string;
  name: string;
}

export type MultiplayerEvent = 
  | { type: 'CHAT'; payload: ChatMessage }
  | { type: 'STATE_UPDATE'; payload: { stage: GameStage } }
  | { type: 'SEQUENCE_UPDATE'; payload: { steps: string[] } }
  | { type: 'SYNC_REQUEST'; payload: null }
  | { type: 'SYNC_RESPONSE'; payload: { stage: GameStage; sequenceSteps: string[] } };
